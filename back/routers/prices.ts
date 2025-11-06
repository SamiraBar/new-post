import express from "express";
import { Request } from "express";
import PriceToPVZ from "../models/PriceToPVZ";
import XLSX from "xlsx";
import {pricesUpload} from "../multer";
import auth from "../middleware/auth";
import PriceToHand from "../models/PriceToHand";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const pricesRouter = express.Router();

pricesRouter.post("/upload", auth, pricesUpload.single("data"), async (req: MulterRequest, res, next) => {
  try {
    const type = req.query.type;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (type === "PVZ") {
      await PriceToPVZ.collection.drop();
      await PriceToPVZ.insertMany(jsonData);
    } else if (type === "Hand") {
      await PriceToHand.collection.drop();
      await PriceToHand.insertMany(jsonData);
    } else {
      return res.status(400).json({ message: "No type" });
    }


    res.status(200).json({ message: "Base updated", count: jsonData.length });
  } catch (err) {
    console.error(err);
    next(err);
  }
});


pricesRouter.get("/", async (req, res, next) => {
  try {
    const type = req.query.type;
    if (type === "PVZ") {
      const data = await PriceToPVZ.find()
      res.send(data);
    } else if (type === "Hand") {
      const data = await PriceToHand.find()
      res.send(data);
    } else {
      return res.status(400).json({ message: "No type" });
    }

  } catch {
    res.sendStatus(500);
  }
})

export default pricesRouter;
