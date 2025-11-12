import XLSX from "xlsx";
import {PriceToPVZ} from "../models/Price";
import {Price} from "../models/Price";
import {NextFunction, Request, Response} from "express";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadPrices = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    const type = req.query.type;
    const file = req.file;

    if (!file) return res.status(400).json({message: "No file uploaded"});
    if (!type) return res.status(400).json({message: "No type"});

    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

    const normalizeMaps: Record<string, Record<string, string>> = {
      PVZ: {
        city: "Название города",
        region: "Регион",
        basePrice: "Стоимость доставки весом до 1кг, сом",
        pricePerOneLessThree: "Стоимость доставки за каждый дополнительный полный/неполный 1кг, сом (до общего веса 3кг)",
        pricePerOneLessSix: "Стоимость доставки за каждый дополнительный полный/неполный 1кг, сом (до общего веса от 3кг до 6кг)",
        pricePerOneLessTwelve: "Стоимость доставки за каждый дополнительный полный/неполный 1кг, сом (до общего веса от 6кг до 12кг)",
        pricePerOneLessFifteen: "Стоимость доставки за каждый дополнительный полный/неполный 1кг, сом (до общего веса от 12кг до 15кг)",
      },
      Hand: {
        city: "Название города",
        country: "Страна",
        tariffZone: "Тариф зоны",
        basePrice: "Стоимость до 1кг, сом",
        pricePerOneKg: "Стоимость доп 1 кг, сом"
      },
    };

    const schemaMap: Record<string, string[]> = {
      PVZ: Object.keys(normalizeMaps.PVZ),
      Hand: Object.keys(normalizeMaps.Hand),
    };

    const normalizeExcelKeys = (data: Record<string, any>[], map: Record<string, string>) => {
      const reverseMap = Object.entries(map).reduce((acc, [key, value]) => {
        acc[value.trim()] = key;
        return acc;
      }, {} as Record<string, string>);

      return data.map(row => {
        const newRow: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
          const normalizedKey = reverseMap[key.trim()];
          if (normalizedKey) newRow[normalizedKey] = value;
        }
        return newRow;
      });
    };


    const normalizeMap = normalizeMaps[String(type)];
    if (!normalizeMap) return res.status(400).json({message: `Неизвестный тип файла: ${type}`});

    const normalizedData = normalizeExcelKeys(jsonData, normalizeMap);

    const firstRow = normalizedData[0] || {};
    const keys = Object.keys(firstRow);
    const requiredFields = schemaMap[String(type)];
    const missing = requiredFields.filter(f => !keys.includes(f));


    if (missing.length > 0) {
      return res.status(400).json({
        message: `Неверный формат для типа "${type}"`,
        missingFields: missing,
        expected: requiredFields,
        received: keys,
      });
    }

    const filteredData = normalizedData.filter(row =>
      Object.values(row).some(v => v !== null && v !== undefined && v !== "")
    );

    if (filteredData.length === 0) return res.status(400).json({message: "Значения не могут быть пустыми"});

    if (type === "PVZ") {
      await PriceToPVZ.collection.drop();
      await PriceToPVZ.insertMany(normalizedData);
    } else if (type === "Hand") {
      await Price.collection.drop();
      await Price.insertMany(normalizedData);
    }

    res.status(200).json({message: "База обновлена", count: normalizedData.length});
  } catch (err) {
    console.error(err);
    next(err);
  }
}

export const getPrices = async (req: Request, res: Response) => {
  try {
    const type = req.query.type;
    if (type === "PVZ") {
      const data = await PriceToPVZ.find()
      res.send(data);
    } else if (type === "Hand") {
      const data = await Price.find()
      res.send(data);
    } else {
      return res.status(400).json({message: "Тип не указан"});
    }

  } catch {
    res.sendStatus(500);
  }
}