export interface Admin {
  _id: string;
  email: string;
  token: string;
  role: string;
  displayName: string;
  isActive: boolean;
}

export interface AdminMutation {
  displayName: string;
  email: string;
  password: string;
}
export interface AdminEditing {
  _id: string;
  displayName: string;
  email: string;
  password: string;
}

export interface IParcel {
  _id: string;
  trackingNumber: string;
  partnerTrackingNumber?: string;
  deliveryType: DeliveryType;
  partnerType: 'E-Kit' | 'KCE';
  sender: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    description?: string;
    type: 'sender';
    createdAt: Date;
    inn_passport: string;
  };
  recipient: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    description?: string;
    type: 'recipient';
    createdAt: Date;
  };
  originCity: string;
  destinationCity: string;
  status: 'draft' | 'created' | 'accepted' | 'shipped';
  isPaid: boolean;
  partnerStickerReceived: boolean;
  weight: number;
  draftedAt: string;
  createdAt?: string;
  acceptedAt?: string;
  shippedAt?: string;
}

export interface GlobalError {
  error: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

interface Sender {
  name: string;
  email: string;
  phone: string;
  inn_passport: string;
}

export interface Receiver {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  street?: string;
  house?: string;
  apartment?: string;
}

export type DeliveryType = 'courier' | 'pickup';
export type PartnerType = 'E-Kit' | 'KCE';

export interface Order {
  originCity: string;
  destinationCity: string;
  originOffice: number;
  destinationOffice: number;
  parcelValue: number;
  parcelWeight: number;
  deliveryCost: number;
  insuranceCost: number;
  totalCost: number;
  deliveryDate: string;
  inParcel: string;
  sender: Sender;
  receiver: Receiver;
  deliveryType: DeliveryType;
  partnerType: PartnerType;
}

export interface PaginatedParcelsResponse {
  parcels: IParcel[];
  hasMore: boolean;
  currentPage: number;
  total: number;
}

export interface PaginatedParcelsResponse {
  parcels: IParcel[];
  hasMore: boolean;
  currentPage: number;
  total: number;
}
