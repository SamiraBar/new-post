export interface IOffice {
  _id: string;
  name: string;
  address: string;
  mapUrl: string;
  city: string;
  phone: string;
  worktime: string;
  createdAt?: string;
}

export interface IAdminOffice extends IOffice {
  isActive: boolean;
}

export interface CreateOfficeData {
  name: string;
  address: string;
  mapUrl: string;
  city: string;
  phone: string;
  worktime: string;
}

export interface UpdateOfficeData {
  name?: string;
  address?: string;
  mapUrl?: string;
  city?: string;
  phone?: string;
  worktime?: string;
}