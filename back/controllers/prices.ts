import XLSX from "xlsx";
import PriceToPVZ from "../models/PriceToPVZ";
import PriceToHand from "../models/PriceToHand";
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

        const schemaMap: Record<string, string[]> = {
            PVZ: ["city", "region", "basePrice", "pricePerOneLessThree", "pricePerOneLessSix", "pricePerOneLessTwelve", "pricePerOneLessFifteen"],
            Hand: ["city", "country", "tariffZone","basePrice", "pricePerOneKg"],
        };

        const requiredFields = schemaMap[String(type)];

        if (!requiredFields) return res.status(400).json({message: `Неизвестный тип данных: ${type}`});

        const firstRow = jsonData[0] || {};
        const keys = Object.keys(firstRow);
        const missing = requiredFields.filter(f => !keys.includes(f));

        if (missing.length > 0) {
            return res.status(400).json({
                message: `Неверный формат для типа "${type}"`,
                missingFields: missing,
                expected: requiredFields,
                received: keys,
            });
        }

        const filteredData = jsonData.filter(row =>
            Object.values(row).some(v => v !== null && v !== undefined && v !== "")
        );

        if (filteredData.length === 0) return res.status(400).json({message: "Значения не могут быть пустыми"});

        if (type === "PVZ") {
            await PriceToPVZ.collection.drop();
            await PriceToPVZ.insertMany(jsonData);
        } else if (type === "Hand") {
            await PriceToHand.collection.drop();
            await PriceToHand.insertMany(jsonData);
        }

        res.status(200).json({message: "База обновлена", count: jsonData.length});
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
            const data = await PriceToHand.find()
            res.send(data);
        } else {
            return res.status(400).json({message: "Тип не указан"});
        }

    } catch {
        res.sendStatus(500);
    }
}