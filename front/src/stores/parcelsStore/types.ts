import type { GlobalError, IParcel } from '@/types';

export interface ParcelState {
  parcels: IParcel[] | null;
  parcel: IParcel | null;
  getParcelsLoading: boolean;
  getParcelsError: GlobalError | null;
  getParcels: () => Promise<boolean>;
  getParcelLoading: boolean;
  getParcelError: GlobalError | null;
  getParcelById: (id: string) => Promise<boolean>;
}
