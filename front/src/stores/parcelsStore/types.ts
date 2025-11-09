import type { GlobalError, IParcel } from '@/types';

export interface ParcelState {
  parcels: IParcel[] | null;
  getParcelsLoading: boolean;
  getParcelsError: GlobalError | null;

  getParcels: () => Promise<boolean>;
}
