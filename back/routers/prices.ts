import express from "express";
import { Request } from "express";
import Price from "../models/Price";
import XLSX from "xlsx";
import {pricesUpload} from "../multer";
import auth from "../middleware/auth";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const pricesRouter = express.Router();

pricesRouter.post("/upload", auth, pricesUpload.single("prices"), async (req: MulterRequest, res, next) => {

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Файл не найден" });
    }

    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    await Price.collection.drop();

    await Price.insertMany(jsonData);

    res.status(200).json({ message: "Данные обновлены", count: jsonData.length });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default pricesRouter;
