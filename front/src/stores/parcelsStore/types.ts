import type { GlobalError, IParcel, PaginatedParcelsResponse } from '@/types';

export interface ParcelState {
  parcels: IParcel[] | null;
  parcel: IParcel | null;
  parcelsResponse: PaginatedParcelsResponse | null;
  getParcelsLoading: boolean;
  getParcelsError: GlobalError | null;
  getParcels: (p: number) => Promise<boolean>;
  getParcelLoading: boolean;
  getParcelError: GlobalError | null;
  getParcelById: (id: string) => Promise<boolean>;
  editParcelStatusLoading: boolean;
  editParcelStatusError: string | null;
  editParcelStatus: (trackingNumber: string, status: string) => Promise<boolean>;
}
