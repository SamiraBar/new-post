import express, {NextFunction, Request, Response} from "express";
import Sender from "../models/Sender";
import mongoose from "mongoose";
import auth from "../middleware/auth";

const sendersRouter = express.Router();

sendersRouter.post("/",auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, phoneNumber, email, description } = req.body;
        if (!fullName || !phoneNumber || !email || !description) {
            return res.status(400).json({
                error: "Не все обязательные поля заполнены",
                required: ["fullName", "phoneNumber", "email", "description"]
            });
        }
        const newSender = new Sender({
            fullName,
            phoneNumber,
            email,
            description
        });

        await newSender.save();
        res.status(201).json({
            message: "Отправитель успешно создан",
            sender: newSender
        });
    } catch (e) {
        next(e);
    }
});

sendersRouter.get("/",auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const senders = await Sender.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: senders.length,
            senders
        });

    } catch (e) {
        next(e);
    }
});

sendersRouter.get("/:id",auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Некорректный ID отправителя" });
        }

        const sender = await Sender.findById(id);

        if (!sender) {
            return res.status(404).json({ error: "Отправитель не найден" });
        }

        res.status(200).json({ sender });

    } catch (e) {
        next(e);
    }
});

export default sendersRouter;