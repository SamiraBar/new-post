export interface Admin {
  _id: string;
  email: string;
  token: string;
  role: string;
  displayName: string;
}

export interface AdminMutation {
  displayName: string;
  email: string;
  password: string;
}

export interface IContact {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  description?: string;
  type: 'sender' | 'recipient';
  createdAt: Date;
}

export interface IParcel {
  _id: string;
  trackingNumber: string;
  partnerTrackingNumber?: string;
  sender: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    description?: string;
    type: 'sender';
    createdAt: Date;
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
}

interface Receiver {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface Order {
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
}

export interface Office {
  id: number;
  name: string;
  address: string;
}

export interface CalculatorState {
  weight: number;
  value: number;
  deliveryCost: number;
  insuranceCost: number;
  totalCost: number;
}
