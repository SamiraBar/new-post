import type { UseFormReturn } from 'react-hook-form';

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
    city?: string;
    street?: string;
    house?: string;
    apartment?: string;
  };
  originCity: string;
  destinationCity: string;
  originOffice?: number;
  destinationOffice?: number;
  pvzData?: PvzData;
  status: 'draft' | 'created' | 'accepted' | 'shipped' | 'in_country' | 'in_city' | 'at_pickup_point' | 'delivered';
  isPaid: boolean;
  partnerStickerReceived: boolean;
  weight: number;
  draftedAt: string;
  createdAt?: string;
  acceptedAt?: string;
  shippedAt?: string;
  inCountryAt?: string;
  inCityAt?: string;
  atPickupPointAt?: string;
  deliveredAt?: string;
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
  city?: string;
  street?: string;
  house?: string;
  apartment?: string;
}

export interface CreateParcelData {
  partnerTrackingNumber: string | null;
  sender: {
    fullName: string;
    phoneNumber: string;
    email: string;
    description: string;
    address: string;
    city?: string;
    inn_passport: string;
  };
  recipient: {
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    description: string;
    city: string;
    street?: string;
    house?: string;
    apartment?: string;
  };
  originCity: string;
  destinationCity: string;
  originOffice: number | null;
  destinationOffice: number | null;
  weight: number;
  isPaid: boolean;
  partnerStickerReceived: boolean;
  deliveryType: DeliveryType;
  partnerType: PartnerType;
  pvzData?: PvzData;
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
  pvzData?: PvzData;
}

export interface PvzData {
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

export interface PaginatedParcelsResponse {
  parcels: IParcel[];
  hasMore: boolean;
  currentPage: number;
  total: number;
}

export type LatLngTuple = [number, string] | [string, string];

export interface LeafletMap {
  setView(center: LatLngTuple, zoom: number): LeafletMap;
  getCenter(): LeafletLatLng;
  getZoom(): number;
  closePopup(): LeafletMap;
  invalidateSize(): void;
  remove(): void;
}

export interface LeafletLatLng {
  lat: number;
  lng: number;
}

export interface PvzFilter {
  maxweight?: number;
  acceptcash?: number;
  acceptcard?: number;
  acceptfitting?: number;
}

export interface MeasoftMapConfig {
  mapBlock: string;
  client_id: string;
  client_code: string;
  mapSize: {
    width: string;
    height: string;
  };
  centerCoords: [string, string];
  lang: string;
  showMapButton: string;
  showMapButtonCaption: string;
  filter: PvzFilter;
  allowedFilterParams: string[];
  choicePvzCallback: () => void;
  townBlock: string;
  windowFixedPosition: string;
}

export interface MeasoftMapProps {
  form: UseFormReturn<OrderFormData>;
  onPvzSelect: (pvzData: PvzData) => void;
  clientId?: string;
  clientCode?: string;
}

export interface MeasoftMapInstance {
  config: (config: MeasoftMapConfig) => MeasoftMapInstance;
  init: () => MeasoftMapInstance;
  close?: () => void;
}

export interface MeasoftPvzData {
  code: string;
  name: string;
  address: string;
  phone: string;
  worktime: string;
  maxweight: string;
}

export interface MeasoftMapGlobal {
  config: (config: MeasoftMapConfig) => MeasoftMapInstance;
  init: () => MeasoftMapInstance;
  close?: () => void;
  getSelectedPvzData: () => MeasoftPvzData | null;
  map?: LeafletMap;
}