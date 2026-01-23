import type {NextFunction, Request, Response} from "express";
import path from "path";
import PDFDocument from "pdfkit";
import bwipjs from "bwip-js";
import axios from "axios";
import xml2js from "xml2js";
import fs from "fs";
import {getWaybillPdfBuffer} from "../services/ekit.service";

type EKitConfig = {
  apiUrl: string;
  login: string;
  pass: string;
  extra: string;
  client: string;
};

type WaybillPdfResult = {
  orderCode?: string;
  pdfBuffer: Buffer;
};

const DPI = 203;

const dotToPt = (dots: number) => (dots * 72) / DPI;
const mmToPt = (mm: number) => (mm / 25.4) * 72;

const LABEL_W_PT = mmToPt(75);
const LABEL_H_PT = mmToPt(140);

const ASSETS_DIR = path.resolve(process.cwd(), "assets");
const FONT_REGULAR = path.join(ASSETS_DIR, "fonts", "DejaVuSans.ttf");
const FONT_BOLD = path.join(ASSETS_DIR, "fonts", "DejaVuSans-Bold.ttf");
const LOGO_PNG = path.join(ASSETS_DIR, "logo.png");

const setNoStore = (res: Response) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}

const makeCode128Png = async (text: string, heightDots: number) => {
  const heightMm = (heightDots / DPI) * 25.4;

  return bwipjs.toBuffer({
    bcid: "code128",
    text,
    scale: 2,
    height: heightMm,
    includetext: false,
    backgroundcolor: "FFFFFF",
  });
}

const normalizeAddress = (value: string) => {
  const s = (value ?? "").toString();
  return s
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

const addressWithSmartBreaks = (value: string) => {
  return normalizeAddress(value).replace(/,\s/g, ",\n");
}

const createDoc = (res: Response, fileName: string) => {
  const doc = new PDFDocument({
    size: [LABEL_W_PT, LABEL_H_PT],
    margins: { top: 0, left: 0, right: 0, bottom: 0 },
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
  setNoStore(res);

  doc.pipe(res);

  doc.registerFont("R", FONT_REGULAR);
  try {
    doc.registerFont("B", FONT_BOLD);
  } catch {
  }

  doc.font("R");
  return doc;
}

const textOneLine = (
  doc: PDFKit.PDFDocument,
  value: string,
  xDots: number,
  yDots: number,
  fontDots: number,
  widthDots: number,
  useBold = false
) => {
  doc
    .font(useBold ? "B" : "R")
    .fontSize(dotToPt(fontDots))
    .text(value ?? "", dotToPt(xDots), dotToPt(yDots), {
      width: dotToPt(widthDots),
      lineBreak: false,
      ellipsis: true,
    });
}

const textMultiline = (
  doc: PDFKit.PDFDocument,
  value: string,
  xDots: number,
  yDots: number,
  fontDots: number,
  widthDots: number,
  maxHeightPt: number,
  lineGap = 2
) => {
  doc
    .font("R")
    .fontSize(dotToPt(fontDots))
    .text(value ?? "", dotToPt(xDots), dotToPt(yDots), {
      width: dotToPt(widthDots),
      height: maxHeightPt,
      lineGap,
      ellipsis: true,
    });
}

export const stickerPdf = async (req: Request, res: Response) => {
  const { trackingNumber, recipientName, address } = req.body;

  if (!trackingNumber || !recipientName || !address) {
    return res.status(400).json({ error: "Missing fields" });
  }

  let barcodePng: Buffer;
  try {
    barcodePng = await makeCode128Png(trackingNumber, 180);
  } catch (e: any) {
    return res.status(500).json({ error: "Barcode generation failed", details: e?.message });
  }

  const doc = createDoc(res, `sticker-${trackingNumber}.pdf`);

  try {
    doc.image(LOGO_PNG, dotToPt(130), dotToPt(50), { width: dotToPt(250) });
  } catch {}

  doc.image(barcodePng, dotToPt(70), dotToPt(250), { height: dotToPt(180) });
  textOneLine(doc, trackingNumber, 100, 450, 35, 400);
  textOneLine(doc, "Получатель:", 70, 550, 35, 450, true);
  textOneLine(doc, recipientName, 70, 600, 30, 450);
  textOneLine(doc, "Адрес:", 70, 675, 35, 450, true);

  const addrText = addressWithSmartBreaks(address);

  const addrY = dotToPt(720);
  const bottomPadding = dotToPt(18);
  const maxH = (LABEL_H_PT - addrY) - bottomPadding;

  textMultiline(doc, addrText, 70, 720, 30, 450, maxH, 3);

  doc.end();
};

export const partnerStickerPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trackingNumber = String(req.params.trackingNumber || req.query.trackingNumber || "").trim();
    if (!trackingNumber) {
      return res.status(400).json({ error: "trackingNumber is required" });
    }

    const { pdfBuffer } = await getWaybillPdfBuffer({ trackingNumber, form: 2 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${trackingNumber}.pdf"`);
    setNoStore(res);

    return res.status(200).send(pdfBuffer);
  } catch (e) {
    next(e);
  }
};
