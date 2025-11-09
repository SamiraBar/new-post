export interface Admin {
  _id: string;
  email: string;
  token: string;
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
