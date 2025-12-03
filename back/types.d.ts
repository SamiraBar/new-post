import {JwtPayload} from "jsonwebtoken";

export interface AdminDef {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  isActive: boolean;
}

interface JwtAdminPayload extends JwtPayload {
  id: string;
}

export interface IPvzData {
  code: string;
  name: string;
  address: string;
  phone?: string;
  worktime?: string;
  maxweight?: string;
  parentcode?: string;
  parentname?: string;
  town?: string;
  towncode?: string;
  region?: string;
  acceptcash?: number;
  acceptcard?: number;
}

export interface ParcelCreateData {
  trackingNumber: string;
  partnerTrackingNumber?: string | null;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  originCity: string;
  destinationCity: string;
  originOffice?: number | null;
  destinationOffice?: number | null;
  weight: number;
  isPaid: boolean;
  partnerStickerReceived: boolean;
  status: "draft" | "created" | "accepted" | "shipped" | "in_country" | "in_city" | "at_pickup_point" | "delivered";
  deliveryType: "courier" | "pickup";
  partnerType: "E-Kit" | "KCE";
  pvzData?: IPvzData;
}