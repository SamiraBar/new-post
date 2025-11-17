import { create } from 'zustand';
import { toast } from 'sonner';
import type { ParcelInfo, TrackingStatus } from './types.ts';
import i18n from '../../i18n/i18n.ts';

interface FormattedParcelInfo {
  trackNumber: string;
  currentStatus: string;
  isDelivered: boolean;
  sender: {
    location: string;
    address: string;
  };
  recipient: {
    location: string;
    address: string;
  };
  statuses: TrackingStatus[];
}

interface TrackingStore {
  trackNumber: string;
  parcelInfo: FormattedParcelInfo | null;
  isModalOpen: boolean;
  isLoading: boolean;

  setTrackNumber: (number: string) => void;
  searchParcel: () => Promise<void>;
  closeModal: () => void;
}

const API_URL = 'http://localhost:8000';

const getStatusTranslation = (status: string): string => {
  return i18n.t(`deliveryCalculation.statuses.${status}`);
};

const formatParcelData = (data: ParcelInfo): FormattedParcelInfo => {
  const statuses: TrackingStatus[] = [];

  if (data.timeline.draft) {
    statuses.push({
      status: getStatusTranslation('draft'),
      date: data.timeline.draft.date,
      location: data.originCity,
    });
  }

  if (data.timeline.created) {
    statuses.push({
      status: getStatusTranslation('created'),
      date: data.timeline.created.date,
      location: data.originCity,
    });
  }

  if (data.timeline.accepted) {
    statuses.push({
      status: getStatusTranslation('accepted'),
      date: data.timeline.accepted.date,
      location: 'Склад обработки',
    });
  }

  if (data.timeline.shipped) {
    statuses.push({
      status: getStatusTranslation('shipped'),
      date: data.timeline.shipped.date,
      location: data.destinationCity,
    });
  }

  return {
    trackNumber: data.trackingNumber,
    currentStatus: getStatusTranslation(data.status),
    isDelivered: data.status === 'shipped',
    sender: {
      location: data.originCity,
      address: data.sender.address,
    },
    recipient: {
      location: data.destinationCity,
      address: data.recipient.address,
    },
    statuses,
  };
};

export const useTrackingStore = create<TrackingStore>((set, get) => ({
  trackNumber: '',
  parcelInfo: null,
  isModalOpen: false,
  isLoading: false,

  setTrackNumber: (number) => set({ trackNumber: number }),

  searchParcel: async () => {
    const { trackNumber } = get();

    if (!trackNumber.trim()) {
      toast.error(i18n.t('deliveryCalculation.toast.enterTrackNumber'));
      return;
    }

    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/parcels/track/${trackNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Parcel not found');
        }
        throw new Error('Error loading data');
      }

      const data: ParcelInfo = await response.json();
      const formattedData = formatParcelData(data);

      set({
        parcelInfo: formattedData,
        isModalOpen: true,
        isLoading: false,
      });

      toast.success(i18n.t('deliveryCalculation.toast.parcelFound'));
    } catch (error) {
      if (error instanceof Error && error.message === 'Parcel not found') {
        toast.error(i18n.t('deliveryCalculation.toast.parcelNotFound'));
      } else {
        toast.error(i18n.t('deliveryCalculation.toast.errorOccurred'));
      }

      set({ isLoading: false });
    }
  },

  closeModal: () => set({ isModalOpen: false }),
}));
