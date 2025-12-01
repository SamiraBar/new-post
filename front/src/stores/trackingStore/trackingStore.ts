import { create } from 'zustand';
import { toast } from 'sonner';
import type { ParcelInfo, TrackingStatus } from './types.ts';
import i18n from '../../i18n/i18n.ts';

const getStatusTranslation = (status: string): string => {
  return i18n.t(`deliveryCalculation.statuses.${status}`);
};

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

const formatDate = (date: Date | string | null | undefined): string | null => {
  if (!date) return null;

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const formatParcelData = (data: ParcelInfo): FormattedParcelInfo => {
  const statuses: TrackingStatus[] = [];

  if (data.draftedAt) {
    const formattedDate = formatDate(data.draftedAt);
    if (formattedDate) {
      statuses.push({
        status: getStatusTranslation('draft'),
        date: formattedDate,
        location: data.originCity,
      });
    }
  }

  if (data.createdAt) {
    const formattedDate = formatDate(data.createdAt);
    if (formattedDate) {
      statuses.push({
        status: getStatusTranslation('created'),
        date: formattedDate,
        location: data.originCity,
      });
    }
  }

  if (data.acceptedAt) {
    const formattedDate = formatDate(data.acceptedAt);
    if (formattedDate) {
      statuses.push({
        status: getStatusTranslation('accepted'),
        date: formattedDate,
        location: data.originCity,
      });
    }
  }

  if (data.shippedAt) {
    const formattedDate = formatDate(data.shippedAt);
    if (formattedDate) {
      statuses.push({
        status: getStatusTranslation('shipped'),
        date: formattedDate,
        location: i18n.t('deliveryCalculation.inTransit'),
      });
    }
  }

  if (data.inCountryAt) {
    const formattedDate = formatDate(data.inCountryAt);
    if (formattedDate) {
      statuses.push({
        status: getStatusTranslation('in_country'),
        date: formattedDate,
        location: i18n.t('deliveryCalculation.customsClearance'),
      });
    }
  }

  if (data.inCityAt) {
    const formattedDate = formatDate(data.inCityAt);
    if (formattedDate) {
      statuses.push({
        status: getStatusTranslation('in_city'),
        date: formattedDate,
        location: data.destinationCity,
      });
    }
  }

  if (data.atPickupPointAt) {
    const formattedDate = formatDate(data.atPickupPointAt);
    if (formattedDate) {
      statuses.push({
        status: getStatusTranslation('at_pickup_point'),
        date: formattedDate,
        location: `${data.destinationCity} - ${i18n.t('deliveryCalculation.pickupPointInDevelopment')}`,
      });
    }
  }

  if (data.deliveredAt) {
    const formattedDate = formatDate(data.deliveredAt);
    if (formattedDate) {
      statuses.push({
        status: getStatusTranslation('delivered'),
        date: formattedDate,
        location: data.destinationCity,
      });
    }
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
      toast.error(i18n.t('deliveryCalculation.toast.enterTrackNumber'), {
        style: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          border: '2px solid #b91c1c',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '16px',
        },
        icon: '❌',
      });
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

      toast.success(i18n.t('deliveryCalculation.toast.parcelFound'), {
        style: {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: '2px solid #047857',
          borderRadius: '12px',
          fontWeight: 'bold',
        },
        icon: '✅',
      });

    } catch (error) {
      if (error instanceof Error && error.message === 'Parcel not found') {
        toast.error(i18n.t('deliveryCalculation.toast.parcelNotFound'), {
          style: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
            color: 'white',
            border: '2px solid #7f1d1d',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
          },
          icon: '🔍',
          duration: 5000,
        });
      } else {
        toast.error(i18n.t('deliveryCalculation.toast.errorOccurred'), {
          style: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: '2px solid #b91c1c',
            borderRadius: '12px',
            fontWeight: 'bold',
          },
          icon: '⚠️',
        });
      }

      set({ isLoading: false });
    }
  },

  closeModal: () => set({ isModalOpen: false }),
}));
