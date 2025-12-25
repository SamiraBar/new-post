import { NextFunction, Request, Response } from "express";
import Parcel from "../models/Parcel";
import mongoose from "mongoose";
import Contact from "../models/Contact";
import { generateTrackingNumber } from "../utils/generateTrackingNumber";
import {createOrderInEKit, getOrderStatus} from "../services/ekit.service";
import {CreateParcelResponse, EKitOrderResult, ParcelCreateData} from "../types";
import {syncAllEKitStatuses, syncSingleParcelStatus} from "../services/ekit.synchonization";


async function findContactIds(
    type: "sender" | "recipient",
    searchName: string
): Promise<mongoose.Types.ObjectId[]> {
  const regex = new RegExp(searchName, "i");
  const contacts = await Contact.find({ type, fullName: regex }).select("_id");
  return contacts.map((contact) => contact._id as mongoose.Types.ObjectId);
}

type MongoQuery = {
  trackingNumber?: RegExp;
  sender?: { $in: mongoose.Types.ObjectId[] };
  recipient?: { $in: mongoose.Types.ObjectId[] };
};

export const createParcel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    console.log('📦 Начало создания посылки:', req.body);
    const {
      partnerTrackingNumber,
      sender,
      recipient,
      originCity,
      destinationCity,
      originOffice,
      destinationOffice,
      weight,
      isPaid,
      partnerStickerReceived,
      deliveryType,
      partnerType,
      pvzData,
      distributionCenter,
    } = req.body;

    if (!originCity || !destinationCity || !weight) {
      return res.status(400).json({
        error: "Not all required fields are filled",
        required: ["originCity", "destinationCity", "weight"],
      });
    }
    if (!sender || !recipient) {
      return res
          .status(400)
          .json({ error: "Sender and recipient data are required" });
    }
    if (
        !sender.fullName ||
        !sender.phoneNumber ||
        !sender.email ||
        !sender.description
    ) {
      return res
          .status(400)
          .json({ error: "Not all required sender fields are filled" });
    }
    if (
        !recipient.fullName ||
        !recipient.phoneNumber ||
        !recipient.email ||
        !recipient.description
    ) {
      return res
          .status(400)
          .json({ error: "Not all required recipient fields are filled" });
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      return res
          .status(400)
          .json({ error: "Weight must be a positive number" });
    }

    const validDeliveryTypes = ["pickup", "courier"];
    if (!validDeliveryTypes.includes(deliveryType)) {
      return res.status(400).json({
        error: "Invalid deliveryType",
        validDeliveryTypes,
        provided: deliveryType,
      });
    }

    const validPartnerTypes = ["E-Kit", "KCE"];
    if (!validPartnerTypes.includes(partnerType)) {
      return res.status(400).json({
        error: "Invalid partnerType",
        validPartnerTypes,
        provided: partnerType,
      });
    }

    const trackingNumber = await generateTrackingNumber();

    const newSender = await Contact.create({ ...sender, type: "sender" });
    const newRecipient = await Contact.create({
      ...recipient,
      type: "recipient",
    });

    const parcelData: ParcelCreateData = {
      trackingNumber,
      partnerTrackingNumber,
      sender: newSender._id as mongoose.Types.ObjectId,
      recipient: newRecipient._id as mongoose.Types.ObjectId,
      originCity,
      destinationCity,
      weight: weightValue,
      isPaid: isPaid || false,
      partnerStickerReceived: partnerStickerReceived || false,
      status: "draft",
      deliveryType,
      partnerType,
      distributionCenter: distributionCenter || '',
    };

    if (originOffice !== undefined && originOffice !== null) {
      parcelData.originOffice = originOffice;
    }
    if (destinationOffice !== undefined && destinationOffice !== null) {
      parcelData.destinationOffice = destinationOffice;
    }

    if (pvzData && deliveryType === "pickup") {
      parcelData.pvzData = {
        code: pvzData.code,
        name: pvzData.name,
        address: pvzData.address,
        phone: pvzData.phone || null,
        worktime: pvzData.worktime || null,
        maxweight: pvzData.maxweight || null,
        parentcode: pvzData.parentcode || null,
        parentname: pvzData.parentname || null,
        town: pvzData.town || null,
        towncode: pvzData.towncode || null,
        region: pvzData.region || null,
        acceptcash: pvzData.acceptcash || 0,
        acceptcard: pvzData.acceptcard || 0,
      };

      if (pvzData.parentcode) {
        if (pvzData.parentcode === '2495') {
          parcelData.distributionCenter = 'ЕКБ';
          parcelData.serviceCode = '15';
        } else if (pvzData.parentcode === '18483') {
          parcelData.distributionCenter = 'МСК';
          parcelData.serviceCode = '14';
        }
      }
    }

    const newParcel = new Parcel(parcelData);
    await newParcel.save();

    // let ekitWarning: string | undefined;
    //
    // if (partnerType === 'E-Kit') {
    //   try {
    //     const populatedParcel = await Parcel.findById(newParcel._id)
    //         .populate("sender")
    //         .populate("recipient");
    //
    //     if (!populatedParcel) {
    //       throw new Error('Failed to populate parcel data');
    //     }
    //
    //     const ekitResult = await createOrderInEKit(populatedParcel);
    //
    //     newParcel.partnerTrackingNumber = ekitResult.ekitBarcode;
    //     newParcel.status = 'created';
    //     await newParcel.save();
    //
    //   } catch (ekitError: any) {
    //     console.error(' E-Kit sync failed:', ekitError.message);
    //
    //     newParcel.status = 'draft';
    //     await newParcel.save();
    //
    //     ekitWarning = `Order created but E-Kit sync failed: ${ekitError.message}. Manual processing required.`;
    //   }
    // }
    const populatedParcel = await Parcel.findById(newParcel._id)
        .populate("sender")
        .populate("recipient");

    const response: CreateParcelResponse = {
      message: "Parcel created successfully as draft",
      parcel: populatedParcel,
      trackingNumber,
    };
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

export const sendToEKIT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        error: "Tracking number is required"
      });
    }

    const parcel = await Parcel.findOne({ trackingNumber })
        .populate("sender")
        .populate("recipient");

    if (!parcel) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found"
      });
    }

    if (parcel.status === 'created' && parcel.partnerTrackingNumber) {
      return res.status(400).json({
        success: false,
        error: "Parcel already sent to E-Kit"
      });
    }

    const ekitResult = await createOrderInEKit(parcel);

    parcel.partnerTrackingNumber = ekitResult.ekitBarcode;
    parcel.status = 'created';
    await parcel.save();

    res.json({
      success: true,
      message: "Parcel successfully sent to E-Kit",
      ekitOrderNo: ekitResult.ekitOrderNo,
      ekitBarcode: ekitResult.ekitBarcode,
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

    if (
        req.query.trackingNumber &&
        typeof req.query.trackingNumber === "string" &&
        req.query.trackingNumber.trim() !== ""
    ) {
      query.trackingNumber = new RegExp(req.query.trackingNumber.trim(), "i");
    }

    if (
        req.query.sender &&
        typeof req.query.sender === "string" &&
        req.query.sender.trim() !== ""
    ) {
      const senderIds = await findContactIds("sender", req.query.sender.trim());
      if (senderIds.length > 0) query.sender = { $in: senderIds };
      else
        return res.send({
          parcels: [],
          hasMore: false,
          currentPage: page,
          total: 0,
        });
    }

    if (
        req.query.recipient &&
        typeof req.query.recipient === "string" &&
        req.query.recipient.trim() !== ""
    ) {
      const recipientIds = await findContactIds(
          "recipient",
          req.query.recipient.trim()
      );
      if (recipientIds.length > 0) query.recipient = { $in: recipientIds };
      else
        return res.send({
          parcels: [],
          hasMore: false,
          currentPage: page,
          total: 0,
        });
    }

    const parcels = await Parcel.find(query)
        .populate("sender")
        .populate("recipient")
        .sort({ draftedAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await Parcel.countDocuments(query);
    const hasMore = page * limit < total;

    res.send({ parcels, hasMore, currentPage: page, total });
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
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid parcel ID" });

    const parcel = await Parcel.findById(id)
        .populate("sender")
        .populate("recipient");
    if (!parcel) return res.status(404).json({ error: "Parcel not found" });

    res.json(parcel);
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

    if (!parcel)
      return res
          .status(404)
          .json({ error: "Parcel with this tracking number not found" });

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

    if (!status) return res.status(400).json({ error: "Status is required" });

    const validStatuses = [
      "draft",
      "created",
      "accepted",
      "shipped",
      "in_country",
      "in_city",
      "at_pickup_point",
      "delivered",
    ];
    if (!validStatuses.includes(status))
      return res.status(400).json({
        error: "Invalid status",
        validStatuses,
        providedStatus: status,
      });

    const parcel = await Parcel.findOne({ trackingNumber })
        .populate("sender")
        .populate("recipient");
    if (!parcel)
      return res
          .status(404)
          .json({ error: "Parcel with this tracking number not found" });

    parcel.status = status;
    await parcel.save();

    const freshParcel = await Parcel.findById(parcel._id)
        .populate("sender")
        .populate("recipient");

    res.json({
      message: "Parcel status updated successfully",
      parcel: freshParcel,
    });
  } catch (e) {
    next(e);
  }
};

export const updatePartnerTrackingNumber = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { partnerTrackingNumber } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid parcel ID" });
    }

    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    if (parcel.deliveryType !== "courier") {
      return res.status(400).json({
        error:
            "partnerTrackingNumber can only be updated for courier deliveries",
      });
    }

    parcel.partnerTrackingNumber = partnerTrackingNumber || null;

    await parcel.save();

    const fresh = await Parcel.findById(id)
        .populate("sender")
        .populate("recipient");

    res.json({
      message: "partnerTrackingNumber updated successfully",
      parcel: fresh,
    });
  } catch (e) {
    next(e);
  }
};

export const syncParcelWithEKit = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid parcel ID" });
    }

    const parcel = await Parcel.findById(id)
        .populate("sender")
        .populate("recipient");

    if (!parcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    if (parcel.partnerType !== "E-Kit") {
      return res.status(400).json({
        error: "Parcel is not for E-Kit delivery",
        partnerType: parcel.partnerType
      });
    }

    if (parcel.partnerTrackingNumber) {
      return res.status(400).json({
        error: "Parcel already synced with E-Kit",
        ekitTracking: parcel.partnerTrackingNumber,
      });
    }

    const ekitResult: EKitOrderResult = await createOrderInEKit(parcel);

    parcel.partnerTrackingNumber = ekitResult.ekitBarcode;
    parcel.status = "created";
    await parcel.save();

    const fresh = await Parcel.findById(id)
        .populate("sender")
        .populate("recipient");

    const response = {
      message: "Successfully synced with E-Kit",
      parcel: fresh,
      ekitTracking: ekitResult.ekitBarcode,
    };

    res.json(response);
  } catch (e) {
    if (e instanceof Error) {
      console.error(' Manual sync failed:', e.message);
      next(e);
    } else {
      console.error(' Manual sync failed with unknown error:', e);
      next(new Error(String(e)));
    }
  }
};

export const getEKitStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid parcel ID" });
    }

    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    if (parcel.partnerType !== 'E-Kit') {
      return res.status(400).json({
        error: "This parcel is not for E-Kit delivery"
      });
    }

    if (!parcel.partnerTrackingNumber) {
      return res.status(400).json({
        error: "Parcel not synced with E-Kit yet"
      });
    }

    const statusData = await getOrderStatus(parcel.trackingNumber);

    if (!statusData) {
      return res.status(404).json({
        error: "Could not get status from E-Kit"
      });
    }

    res.json({
      trackingNumber: parcel.trackingNumber,
      ekitTracking: parcel.partnerTrackingNumber,
      currentStatus: parcel.status,
      ekitStatus: statusData.status,
      ekitStatusTitle: statusData.statusTitle,
      deliveredDate: statusData.deliveredDate,
      deliveredTime: statusData.deliveredTime,
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to get order status from E-Kit:', error.message);
    } else {
      console.error('Failed to get order status from E-Kit:', String(error));
      next(new Error(String(error)));
    }
  }
};

export const syncAllParcels = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    console.log("Manual sync triggered for all E-Kit parcels");

    const result = await syncAllEKitStatuses();

    res.json({
      message: "Synchronization completed",
      result: {
        totalChecked: result.totalChecked,
        updated: result.updated,
        skipped: result.skipped,
        failed: result.failed,
      },
      details: result.details,
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Sync all failed:", error.message);
      return res.status(500).json({
        error: "Failed to sync parcels",
        message: error.message,
      });
    }
    next(error);
  }
};

export const syncSingleParcel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const { trackingNumber } = req.params;

    console.log(`Manual sync triggered for ${trackingNumber}`);

    const result = await syncSingleParcelStatus(trackingNumber);

    if (!result.success) {
      return res.status(400).json({
        error: result.message,
        ekitStatus: result.ekitStatus,
      });
    }

    res.json({
      message: result.message,
      trackingNumber,
      oldStatus: result.oldStatus,
      newStatus: result.newStatus,
      ekitStatus: result.ekitStatus,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Sync single failed:`, error.message);
      return res.status(500).json({
        error: "Failed to sync parcel",
        message: error.message,
      });
    }
    next(error);
  }
};