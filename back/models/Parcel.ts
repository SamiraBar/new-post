import mongoose from "mongoose";
import Contact, { IContact } from "./Contact";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Schema = mongoose.Schema;

export interface IParcel extends mongoose.Document {
  trackingNumber: string;
  partnerTrackingNumber?: string;
  sender: mongoose.Types.ObjectId | IContact;
  recipient: mongoose.Types.ObjectId | IContact;
  originCity: string;
  destinationCity: string;
  status: "draft" | "created" | "accepted" | "shipped";
  isPaid: boolean;
  partnerStickerReceived: boolean;
  weight: number;
  senderFullName?: string;
  recipientFullName?: string;
  recipientPhoneNumber?: string;

  draftedAt?: Date;
  createdAt?: Date;
  acceptedAt?: Date;
  shippedAt?: Date;
  inCountryAt?: Date;
  inCityAt?: Date;
  atPickupPointAt?: Date;
  deliveredAt?: Date;

  draftedAtFormatted?: string;
  createdAtFormatted?: string;
  acceptedAtFormatted?: string;
  shippedAtFormatted?: string;
  inCountryAtFormatted?: string;
  inCityAtFormatted?: string;
  atPickupPointAtFormatted?: string;
  deliveredAtFormatted?: string;
}

const ParcelSchema = new Schema(
  {
    trackingNumber: {
      type: String,
      required: [true, "Tracking number is required"],
      unique: true,
    },
    partnerTrackingNumber: {
      type: String,
      default: null,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
      validate: {
        validator: async (value: string) => {
          const contact = await Contact.findById(value);
          return !!contact && contact.type === "sender";
        },
        message: "Sender not found or not a sender type",
      },
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
      validate: {
        validator: async (value: string) => {
          const contact = await Contact.findById(value);
          return !!contact && contact.type === "recipient";
        },
        message: "Recipient not found or not a recipient type",
      },
    },
    originCity: {
      type: String,
      required: [true, "Origin city is required"],
    },
    destinationCity: {
      type: String,
      required: [true, "Destination city is required"],
    },
    status: {
      type: String,
      enum: [
        "draft",
        "created",
        "accepted",
        "shipped",
        "in_country",
        "in_city",
        "at_pickup_point",
        "delivered",
      ],
      default: "draft",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    partnerStickerReceived: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [0.1, "Weight must be greater than 0"],
    },
    draftedAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: null,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    inCountryAt: {
      type: Date,
      default: null,
    },
    inCityAt: {
      type: Date,
      default: null,
    },
    atPickupPointAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
  },
);

ParcelSchema.pre("save", function (next) {
  const now = dayjs().tz("Asia/Bishkek").toDate();

  if (this.status === "draft" && !this.draftedAt) {
    this.draftedAt = now;
  }

  if (this.status === "created" && !this.createdAt) {
    this.createdAt = now;
  }

  if (this.status === "accepted" && !this.acceptedAt) {
    this.acceptedAt = now;
  }

  if (this.status === "shipped" && !this.shippedAt) {
    this.shippedAt = now;
  }

  if (this.status === "in_country" && !this.inCountryAt) {
    this.inCountryAt = now;
  }

  if (this.status === "in_city" && !this.inCityAt) {
    this.inCityAt = now;
  }

  if (this.status === "at_pickup_point" && !this.atPickupPointAt) {
    this.atPickupPointAt = now;
  }

  if (this.status === "delivered" && !this.deliveredAt) {
    this.deliveredAt = now;
  }

  next();
});

const dateFields = [
  "draftedAt",
  "createdAt",
  "acceptedAt",
  "shippedAt",
  "inCountryAt",
  "inCityAt",
  "atPickupPointAt",
  "deliveredAt",
] as const;

dateFields.forEach((field) => {
  ParcelSchema.virtual(`${field}Formatted`).get(function (this: IParcel) {
    if (!this[field]) return null;
    return dayjs(this[field]).tz("Asia/Bishkek").format("DD.MM.YYYY HH:mm");
  });
});

ParcelSchema.virtual("senderFullName").get(function (this: IParcel) {
  const sender = this.sender as IContact;
  return sender.fullName;
});

ParcelSchema.virtual("recipientFullName").get(function (this: IParcel) {
  const recipient = this.recipient as IContact;
  return recipient.fullName;
});

ParcelSchema.virtual("recipientPhoneNumber").get(function (this: IParcel) {
  const recipient = this.recipient as IContact;
  return recipient.phoneNumber;
});

ParcelSchema.set("toJSON", { virtuals: true });
ParcelSchema.set("toObject", { virtuals: true });

const Parcel = mongoose.model<IParcel>("Parcel", ParcelSchema);
export default Parcel;
