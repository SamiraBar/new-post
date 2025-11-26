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

export type DeliveryType = "courier" | "pickup";

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

  destinationPvzCode?: string;
  destinationPvzName?: string;
  destinationPvzAddress?: string;
  destinationPvzPhone?: string;
  destinationPvzWorktime?: string;

  receiver: Receiver;
  deliveryType: DeliveryType;
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

export type MeasoftSelectedPvzData = {
  code: string;
  name: string;
  address: string;
  phone: string;
  worktime: string;
  maxweight: string;
  parentname?: string;
};

export type MeasoftConfigParams = {
  mapBlock: string;
  client_id: string;
  client_code?: string;
  lang?: "ru" | "en";
  showMapButton?: "0" | "1" | "2";
  showMapButtonCaption?: string;
  centerCoords?: readonly [string, string] | readonly string[];
  mapSize?: { width: string | number; height: string | number };
  townBlock?: string;
  townRegexp?: string;
  filter?: {
    acceptcash?: "YES" | "";
    acceptcard?: "YES" | "";
    acceptfitting?: "YES" | "";
    acceptindividuals?: "YES" | "";
    maxweight?: number;
    store?: string | number;
  };
  allowedFilterParams?: Array<
      "acceptcash" | "acceptcard" | "acceptfitting" | "store"
  >;
  choicePvzCallback?: (pvzCode: string) => void;
};

export type MeasoftMapGlobal = {
  config: (params: Partial<MeasoftConfigParams>) => MeasoftMapGlobal;
  init: (loadStores?: number) => void;
  open?: (mode?: string) => void;
  showMap?: (loadStores?: number) => void;
  clear?: () => void;
  close?: () => void;
  getSelectedPvzData: () => MeasoftSelectedPvzData;
  applyFilter?: (param: string, value: string, manualLoadStore?: number) => void;
};

declare global {
  interface Window {
    measoftMap?: MeasoftMapGlobal;
  }
}