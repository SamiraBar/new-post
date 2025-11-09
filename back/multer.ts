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

export const pricesUpload = multer({storage: priceStorage});