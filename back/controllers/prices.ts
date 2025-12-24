import XLSX from "xlsx";
import { PriceToPVZ } from "../models/Price";
import { Price } from "../models/Price";
import { NextFunction, Request, Response } from "express";
import { PipelineStage } from "mongoose";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadPrices = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const type = req.query.type;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });
    if (!type) return res.status(400).json({ message: "No type" });

    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<
      string,
      any
    >[];

    const normalizeMaps: Record<string, Record<string, string>> = {
      PVZ: {
        city: "Название города",
        region: "Регион",
        distributionCenter: "РЦ",
        basePrice: "Стоимость доставки весом до 1кг, сом",
        pricePerOneLessThree:
          "Стоимость доставки за каждый дополнительный полный/неполный 1кг, сом (до общего веса 3кг)",
        pricePerOneLessSix:
          "Стоимость доставки за каждый дополнительный полный/неполный 1кг, сом (до общего веса от 3кг до 6кг)",
        pricePerOneLessTwelve:
          "Стоимость доставки за каждый дополнительный полный/неполный 1кг, сом (до общего веса от 6кг до 12кг)",
        pricePerOneLessFifteen:
          "Стоимость доставки за каждый дополнительный полный/неполный 1кг, сом (до общего веса от 12кг до 15кг)",
      },
      Hand: {
        city: "Название города",
        country: "Страна",
        tariffZone: "Тариф зоны",
        basePrice: "Стоимость до 1кг, сом",
        pricePerOneKg: "Стоимость доп 1 кг, сом",
      },
    };

    const schemaMap: Record<string, string[]> = {
      PVZ: Object.keys(normalizeMaps.PVZ),
      Hand: Object.keys(normalizeMaps.Hand),
    };

    const normalizeExcelKeys = (
      data: Record<string, any>[],
      map: Record<string, string>,
    ) => {
      const reverseMap = Object.entries(map).reduce(
        (acc, [key, value]) => {
          acc[value.trim()] = key;
          return acc;
        },
        {} as Record<string, string>,
      );

      return data.map((row) => {
        const newRow: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
          const normalizedKey = reverseMap[key.trim()];
          if (normalizedKey) newRow[normalizedKey] = value;
        }
        return newRow;
      });
    };

    const normalizeMap = normalizeMaps[String(type)];
    if (!normalizeMap)
      return res
        .status(400)
        .json({ message: `Unknown file type: ${type}` });

    const normalizedData = normalizeExcelKeys(jsonData, normalizeMap);

    const firstRow = normalizedData[0] || {};
    const keys = Object.keys(firstRow);
    const requiredFields = schemaMap[String(type)];
    const missing = requiredFields.filter((f) => !keys.includes(f));

    if (missing.length > 0) {
      return res.status(400).json({
        message: `Invalid format for type "${type}"`,
        missingFields: missing,
        expected: requiredFields,
        received: keys,
      });
    }

    const filteredData = normalizedData.filter((row) =>
      Object.values(row).some((v) => v !== null && v !== undefined && v !== ""),
    );

    if (filteredData.length === 0)
      return res
        .status(400)
        .json({ message: "Values cannot be empty" });

    if (type === "PVZ") {
      await PriceToPVZ.collection.drop();
      await PriceToPVZ.insertMany(normalizedData);
    } else if (type === "Hand") {
      await Price.collection.drop();
      await Price.insertMany(normalizedData);
    }

    res
      .status(200)
      .json({ message: "The database has been updated", count: normalizedData.length });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getPrices = async (req: Request, res: Response) => {
  try {
    const type = req.query.type;

    if (!type) {
      return res.status(400).json({ message: "Type not specified" });
    }

    const pipeline: PipelineStage[] = [
      {
        $addFields: {
          priority: {
            $switch: {
              branches: [
                { case: { $eq: ["$city", "Москва"] }, then: 1 },
                { case: { $eq: ["$city", "Санкт-Петербург"] }, then: 2 },
                { case: { $eq: ["$city", "Екатеринбург"] }, then: 3 },
                { case: { $eq: ["$city", "Новосибирск"] }, then: 4 },
              ],
              default: 999,
            },
          },
        },
      },
      {
        $sort: { priority: 1, city: 1 },
      },
      {
        $project: { priority: 0 },
      },
    ];

    if (type === "PVZ") {
      const data = await PriceToPVZ.aggregate(pipeline);
      res.send(data);
    } else if (type === "Hand") {
      const data = await Price.aggregate(pipeline);
      res.send(data);
    } else {
      return res.status(400).json({ message: "Type not specified" });
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

export const calculatePrice = async (req: Request, res: Response) => {
  try {
    const { type, city, weight } = req.query;

    if (!type || !city || !weight) {
      return res
        .status(400)
        .json({ message: "type, city, and weight are required" });
    }

    const numericWeight = Number(weight);

    if (isNaN(numericWeight) || numericWeight <= 0) {
      return res.status(400).json({ message: "Invalid weight format" });
    }

    const w = Math.ceil(numericWeight);

    if (w > 15) {
      return res
          .status(400)
          .json({ message: "Максимальный вес для расчета — 15 кг" });
    }

    if (type === "PVZ") {
      const priceData = await PriceToPVZ.findOne({ city });
      if (!priceData)
        return res.status(404).json({ message: "City not found in tariffs" });

      let price = priceData.basePrice;

      if (numericWeight > 1) {
        const extra = numericWeight - 1;

        if (numericWeight <= 3) {
          price += extra * priceData.pricePerOneLessThree;
        } else if (numericWeight <= 6) {
          price +=
            2 * priceData.pricePerOneLessThree +
            (numericWeight - 3) * priceData.pricePerOneLessSix;
        } else if (numericWeight <= 12) {
          price +=
            2 * priceData.pricePerOneLessThree +
            3 * priceData.pricePerOneLessSix +
            (numericWeight - 6) * priceData.pricePerOneLessTwelve;
        } else if (numericWeight <= 15) {
          price +=
            2 * priceData.pricePerOneLessThree +
            3 * priceData.pricePerOneLessSix +
            6 * priceData.pricePerOneLessTwelve +
            (numericWeight - 12) * priceData.pricePerOneLessFifteen;
        }
      }

      return res.json({
        totalCost: price,
        billedWeight: w,
        distributionCenter: priceData.distributionCenter,
      });
    }

    if (type === "Hand") {
      const priceData = await Price.findOne({ city });
      if (!priceData)
        return res.status(404).json({ message: "City not found in tariffs" });

      if (!priceData) {
        return res
            .status(404)
            .json({ message: "Город не найден в тарифах Hand" });
      }

      let total = priceData.basePrice;

      if (w > 1) {
        total += (w - 1) * priceData.pricePerOneKg;
      }

      return res.json({
        totalCost: total,
        billedWeight: w,
      });
    }

    return res.status(400).json({ message: "Unknown tariff type" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
