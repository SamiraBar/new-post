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

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      return res.status(400).json({
        error: "Weight must be a positive number",
      });
    }

    const MAX_WEIGHT = 15;
    if (weightValue > MAX_WEIGHT) {
      return res.status(400).json({
        error: `Weight cannot exceed ${MAX_WEIGHT} kg`,
        maxWeight: MAX_WEIGHT
      });
    }

    const MIN_WEIGHT = 0.1;
    if (weightValue < MIN_WEIGHT) {
      return res.status(400).json({
        error: `Weight must be at least ${MIN_WEIGHT} kg`,
        minWeight: MIN_WEIGHT
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
      weight: weightValue,
      isPaid: isPaid || false,
      partnerStickerReceived: partnerStickerReceived || false,
      status: "draft",
    });

    await newParcel.save();

    const populatedParcel = await Parcel.findById(newParcel._id)
        .populate("sender")
        .populate("recipient");

    res.status(201).json({
      message: "Parcel created successfully",
      parcel: populatedParcel
    });
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
      .sort({ draftedAt: -1 })

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
      return res.status(404).json({
        error: "Parcel with this tracking number not found",
      });
    }

    const response = {
      ...parcel.toJSON(),
      timeline: {
        draft: parcel.draftedAt ? {
          date: parcel.draftedAtFormatted,
          timestamp: parcel.draftedAt
        } : null,
        created: parcel.createdAt ? {
          date: parcel.createdAtFormatted,
          timestamp: parcel.createdAt
        } : null,
        accepted: parcel.acceptedAt ? {
          date: parcel.acceptedAtFormatted,
          timestamp: parcel.acceptedAt
        } : null,
        shipped: parcel.shippedAt ? {
          date: parcel.shippedAtFormatted,
          timestamp: parcel.shippedAt
        } : null,
      },
    };

    res.send(response);
  } catch (e) {
    next(e);
  }
};

export const updateParcelStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const { trackingNumber } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["draft", "created", "accepted", "shipped"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        validStatuses: validStatuses,
        providedStatus: status,
      });
    }

    const parcel = await Parcel.findOne({ trackingNumber })
        .populate("sender")
        .populate("recipient");

    if (!parcel) {
      return res.status(404).json({
        error: "Parcel with this tracking number not found",
      });
    }
    parcel.status = status;
    await parcel.save();

    const freshParcel = await Parcel.findById(parcel._id)
        .populate("sender")
        .populate("recipient");

    if (!freshParcel) {
      return res.status(404).json({
        error: "Parcel not found after update",
      });
    }

    let statusDate: string | null = null;

    switch (status) {
      case "draft":
        statusDate = freshParcel.draftedAtFormatted || null;
        break;
      case "created":
        statusDate = freshParcel.createdAtFormatted || null;
        break;
      case "accepted":
        statusDate = freshParcel.acceptedAtFormatted || null;
        break;
      case "shipped":
        statusDate = freshParcel.shippedAtFormatted || null;
        break;
    }

    const minimalParcel = {
      trackingNumber: freshParcel.trackingNumber,
      status: freshParcel.status,
      statusDate: statusDate,
      senderName: freshParcel.senderFullName || "",
      recipientName: freshParcel.recipientFullName || ""
    };

    res.json({
      message: "Parcel status updated successfully",
      parcel: minimalParcel
    });
  } catch (e) {
    next(e);
  }
};
