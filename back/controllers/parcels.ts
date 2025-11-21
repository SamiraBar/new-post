import { NextFunction, Request, Response } from "express";
import Parcel from "../models/Parcel";
import mongoose from "mongoose";
import Contact from "../models/Contact";

async function findContactIds(type: 'sender' | 'recipient', searchName: string): Promise<mongoose.Types.ObjectId[]> {
  const regex = new RegExp(searchName, 'i');
  const contacts = await Contact.find({
    type: type,
    fullName: regex
  }).select('_id');

  return contacts.map(contact => contact._id as mongoose.Types.ObjectId);
}

type MongoQuery = {
  sender?: { $in: mongoose.Types.ObjectId[] };
  recipient?: { $in: mongoose.Types.ObjectId[] };
};

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

    if (!trackingNumber || !originCity || !destinationCity || !weight) {
      return res.status(400).json({
        error: "Not all required fields are filled",
        required: ["trackingNumber", "originCity", "destinationCity", "weight"],
      });
    }

    if (!sender || !recipient) {
      return res.status(400).json({
        error: "Sender and recipient data are required"
      });
    }

    if (!sender.fullName || !sender.phoneNumber || !sender.email || !sender.description) {
      return res.status(400).json({
        error: "Not all required sender fields are filled"
      });
    }

    if (!recipient.fullName || !recipient.phoneNumber || !recipient.email || !recipient.description) {
      return res.status(400).json({
        error: "Not all required recipient fields are filled"
      });
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      return res.status(400).json({
        error: "Weight must be a positive number",
      });
    }

    const existingParcel = await Parcel.findOne({ trackingNumber });
    if (existingParcel) {
      return res.status(400).json({
        error: "Parcel with this tracking number already exists",
      });
    }
    const newSender = await Contact.create({
      ...sender,
      type: 'sender'
    });

    const newRecipient = await Contact.create({
      ...recipient,
      type: 'recipient'
    });
    const newParcel = new Parcel({
      trackingNumber,
      partnerTrackingNumber,
      sender: newSender._id,
      recipient: newRecipient._id,
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let query: MongoQuery = {};

    if (req.query.sender && typeof req.query.sender === 'string' && req.query.sender.trim() !== '') {
      const senderIds = await findContactIds('sender', req.query.sender.trim());
      query.sender = { $in: senderIds.length > 0 ? senderIds : [] };
    }

    if (req.query.recipient && typeof req.query.recipient === 'string' && req.query.recipient.trim() !== '') {
      const recipientIds = await findContactIds('recipient', req.query.recipient.trim());
      query.recipient = { $in: recipientIds.length > 0 ? recipientIds : [] };
    }

    const parcels = await Parcel.find(query)
        .populate("sender")
        .populate("recipient")
        .sort({ draftedAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Parcel.countDocuments(query);
    const hasMore = page * limit < total;

    res.send({
      parcels,
      hasMore,
      currentPage: page,
      total
    });
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

    res.send(parcel);
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

    res.json({
      message: "Parcel status updated successfully",
      parcel: freshParcel
    });
  } catch (e) {
    next(e);
  }
};
