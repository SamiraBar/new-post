export interface Admin {
  _id: string;
  email: string;
  token: string;
}

export interface IParcel {
  _id: string;
  trackingNumber: string;
  partnerTrackingNumber: string;
  senderFullName: string;
  recipientFullName: string;
  recipientPhoneNumber: string;
  originCity: string;
  destinationCity: string;
  status: string;
  createdAt: string;
  isPaid: boolean;
  partnerStickerReceived: boolean;
  weight: number;
}

export interface GlobalError {
  error: string;
}

export interface LoginMutation {
  email: string;
  password: string;
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
