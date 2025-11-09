import express from "express";
import Parcel from "../models/Parcel";
import mongoose from "mongoose";
import auth from "../middleware/auth";

const parcelsRouter = express.Router();

parcelsRouter.post("/", auth, async (req, res, next) => {
    try {
        const {
            trackingNumber,
            partnerTrackingNumber,
            sender,
            recipient,
            originCity,
            destinationCity,
            weight,
            declaredValue,
            isPaid,
            partnerStickerReceived
        } = req.body;

        if (!trackingNumber || !sender || !recipient || !originCity || !destinationCity || !weight) {
            return res.status(400).json({
                error: "Не все обязательные поля заполнены",
                required: ["trackingNumber", "sender", "recipient", "originCity", "destinationCity", "weight"]
            });
        }

        const existingParcel = await Parcel.findOne({ trackingNumber });
        if (existingParcel) {
            return res.status(400).json({
                error: "Посылка с таким трек-номером уже существует"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(sender)) {
            return res.status(400).json({ error: "Некорректный ID отправителя" });
        }
        if (!mongoose.Types.ObjectId.isValid(recipient)) {
            return res.status(400).json({ error: "Некорректный ID получателя" });
        }

        const newParcel = new Parcel({
            trackingNumber,
            partnerTrackingNumber,
            sender,
            recipient,
            originCity,
            destinationCity,
            weight,
            declaredValue: declaredValue || 0,
            isPaid: isPaid || false,
            partnerStickerReceived: partnerStickerReceived || false,
            status: 'created'
        });

        await newParcel.save();

        const populatedParcel = await Parcel.findById(newParcel._id)
            .populate('sender')
            .populate('recipient');

        res.status(201).json({
            message: "Посылка успешно создана",
            parcel: populatedParcel
        });

    } catch (e) {
        next(e);
    }
});

parcelsRouter.get("/",auth, async (req, res, next) => {
    try {
        const parcels = await Parcel.find()
            .populate('sender')
            .populate('recipient')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: parcels.length,
            parcels
        });

    } catch (e) {
        next(e);
    }
});

parcelsRouter.get("/:id",auth, async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Некорректный ID посылки" });
        }

        const parcel = await Parcel.findById(id)
            .populate('sender')
            .populate('recipient');

        if (!parcel) {
            return res.status(404).json({ error: "Посылка не найдена" });
        }

        res.status(200).json({ parcel });

    } catch (e) {
        next(e);
    }
});

parcelsRouter.get("/tracking/:trackingNumber",auth, async (req, res, next) => {
    try {
        const { trackingNumber } = req.params;

        const parcel = await Parcel.findOne({ trackingNumber })
            .populate('sender')
            .populate('recipient');

        if (!parcel) {
            return res.status(404).json({ error: "Посылка с таким трек-номером не найдена" });
        }

        res.status(200).json({ parcel });

    } catch (e) {
        next(e);
    }
});

export default parcelsRouter;