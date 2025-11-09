import express, { Request, Response } from "express";
import Recipient from "../models/Recipient";
import mongoose from "mongoose";
import auth from "../middleware/auth";

const recipientsRouter = express.Router();

recipientsRouter.post("/",auth, async (req, res, next) => {
    try {
        const { fullName, phoneNumber, email, address } = req.body;

        if (!fullName || !phoneNumber || !email || !address) {
            return res.status(400).json({
                error: "Не все обязательные поля заполнены",
                required: ["fullName", "phoneNumber", "email", "address"]
            });
        }

        const newRecipient = new Recipient({
            fullName,
            phoneNumber,
            email,
            address
        });

        await newRecipient.save();

        res.status(201).json({
            message: "Получатель успешно создан",
            recipient: newRecipient
        });

    } catch (e) {
        next(e);
    }
});

recipientsRouter.get("/",auth, async (req, res, next) => {
    try {
        const recipients = await Recipient.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: recipients.length,
            recipients
        });

    } catch (error: any) {
        console.error("Error fetching recipients:", error);
        res.status(500).json({
            error: "Ошибка при получении получателей",
            details: error.message
        });
    }
});

recipientsRouter.get("/:id",auth, async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Некорректный ID получателя" });
        }

        const recipient = await Recipient.findById(id);

        if (!recipient) {
            return res.status(404).json({ error: "Получатель не найден" });
        }

        res.status(200).json({ recipient });

    } catch (e) {
        next(e);
    }
});

export default recipientsRouter;