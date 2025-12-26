export interface IOffice {
  _id: string;
  name: string;
  address: string;
  mapUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminOffice extends IOffice {
  isActive: boolean;
}

export interface CreateOfficeData {
  name: string;
  address: string;
  mapUrl: string;
}

export interface UpdateOfficeData {
  name?: string;
  address?: string;
  mapUrl?: string;
}