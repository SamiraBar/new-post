import multer from "multer";
import path from "path";
import config from "./config";
import {promises as fs} from "fs";
import {randomUUID} from "node:crypto";

const priceStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = path.join(config.publicPath, "uploads/prices/");
    await fs.mkdir(destDir, { recursive: true });
    callback(null, destDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const newFileName = randomUUID() + extension;
    callback(null, newFileName);
  }
});

const companyFileStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = path.join(config.publicPath, "uploads/company-files/");
    await fs.mkdir(destDir, { recursive: true });
    callback(null, destDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, extension)
        .normalize('NFC')
        .replace(/[\\/:"*?<>|]+/g, "_");

    const newFileName = `${Date.now()}_${nameWithoutExt}${extension}`;
    callback(null, newFileName);
  }
});

export const companyFileUpload = multer({
  storage: companyFileStorage,
  fileFilter: (_req, file, cb: multer.FileFilterCallback) => {
    if (file.mimetype !== "application/pdf") {
      return cb(null, false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});


export const pricesUpload = multer({storage: priceStorage});