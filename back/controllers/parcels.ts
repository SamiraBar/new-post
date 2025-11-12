import { NextFunction, Request, Response } from "express";
import Parcel from "../models/Parcel";
import mongoose from "mongoose";

export const createParcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      trackingNumber,
      partnerTrackingNumber,
      sender,
      recipient,
      originCity,
      destinationCity,
      weight,
      isPaid,
      partnerStickerReceived,
    } = req.body;

    if (
      !trackingNumber ||
      !sender ||
      !recipient ||
      !originCity ||
      !destinationCity ||
      !weight
    ) {
      return res.status(400).json({
        error: "Not all required fields are filled",
        required: [
          "trackingNumber",
          "sender",
          "recipient",
          "originCity",
          "destinationCity",
          "weight",
        ],
      });
    }

    const existingParcel = await Parcel.findOne({ trackingNumber });
    if (existingParcel) {
      return res.status(400).json({
        error: "Parcel with this tracking number already exists",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sender)) {
      return res.status(400).json({ error: "Invalid sender ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(recipient)) {
      return res.status(400).json({ error: "Invalid recipient ID" });
    }

    const newParcel = new Parcel({
      trackingNumber,
      partnerTrackingNumber,
      sender,
      recipient,
      originCity,
      destinationCity,
      weight,
      isPaid: isPaid || false,
      partnerStickerReceived: partnerStickerReceived || false,
      status: "created",
    });

    await newParcel.save();

    const populatedParcel = await Parcel.findById(newParcel._id)
      .populate("sender")
      .populate("recipient");

    res.send(populatedParcel);
  } catch (e) {
    next(e);
  }
};

export const getParcels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parcels = await Parcel.find()
      .populate("sender")
      .populate("recipient")
      .sort({ createdAt: -1 });

    res.send(parcels);
  } catch (e) {
    next(e);
  }
};

export const getParcelById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid parcel ID" });
    }

    const parcel = await Parcel.findById(id)
      .populate("sender")
      .populate("recipient");

    if (!parcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    res.send(parcel);
  } catch (e) {
    next(e);
  }
};

export const getParcelByTrackingNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { trackingNumber } = req.params;

    const parcel = await Parcel.findOne({ trackingNumber })
      .populate("sender")
      .populate("recipient");

    if (!parcel) {
      return res
        .status(404)
        .json({ error: "Parcel with this tracking number not found" });
    }

    res.send(parcel);
  } catch (e) {
    next(e);
  }
};
