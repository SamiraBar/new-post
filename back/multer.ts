import multer from "multer";
import path from "path";
import config from "./config";
import {promises as fs} from "fs";
import {randomUUID} from "node:crypto";

const priceStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = path.join(config.publicPath);
    await fs.mkdir(destDir, { recursive: true });
    callback(null, destDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const newFileName = randomUUID() + extension;
    callback(null, 'prices/' + newFileName);
  }
});

const companyFileStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = path.join(config.publicPath, 'company-files');
    await fs.mkdir(destDir, { recursive: true });
    callback(null, destDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const newFileName = randomUUID() + extension;
    callback(null, newFileName);
  }
});

export const companyFileUpload = multer({
  storage: companyFileStorage,
  fileFilter: (_req, file, cb: (error: Error | null, acceptFile?: boolean) => void) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"), false);
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

export const pricesUpload = multer({storage: priceStorage});