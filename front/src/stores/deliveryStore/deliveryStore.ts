import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';

type DeliveryCostResult = { totalCost: number; distributionCenter?: string };

interface DeliveryStore {
  isDoorDelivery: boolean;
  isPickup: boolean;
  modalSelectDeliveryVariant: boolean;
  calcModal: boolean;
  deliveryType: 'pickup' | 'courier';

  openOrCloseModalSelectDeliveryVariant: (open: boolean) => void;
  selectDoorDelivery: () => void;
  selectPickup: () => void;
  openOrCloseCalcModal: () => void;
  clearActions: () => void;
  fetchDeliveryCost: (city: string, weight: number) => Promise<DeliveryCostResult>;
  pricing: {
    pvz: number;
    door: number;
  };
  selectedPrice: number;
  totalCost: number;
}

export const useDeliveryStore = create<DeliveryStore>()((set, get) => ({
  isDoorDelivery: false,
  isPickup: false,
  modalSelectDeliveryVariant: false,
  calcModal: false,
  pricing: {
    pvz: 0,
    door: 0,
  },
  selectedPrice: 0,
  totalCost: 0,
  deliveryType: 'pickup',

  openOrCloseModalSelectDeliveryVariant: (open?: boolean) =>
    set({
      modalSelectDeliveryVariant: open !== undefined ? open : !get().modalSelectDeliveryVariant,
    }),

  openOrCloseCalcModal: () => set({ calcModal: !get().calcModal }),

  selectDoorDelivery: () =>
    set({
      isDoorDelivery: true,
      isPickup: false,
      deliveryType: 'courier',
      modalSelectDeliveryVariant: false,
      calcModal: false,
    }),

  selectPickup: () =>
    set({
      isDoorDelivery: false,
      isPickup: true,
      deliveryType: 'pickup',
      modalSelectDeliveryVariant: false,
      calcModal: false,
    }),

  clearActions: () =>
    set({
      isDoorDelivery: false,
      isPickup: false,
      deliveryType: 'pickup',
    }),

  fetchDeliveryCost: async (city: string, weight: number) => {
    if (!city || weight <= 0 || weight > 15) {
      console.warn('Invalid delivery cost params:', { city, weight });
      return { totalCost: 0, distributionCenter: '' };
    }

    const type = get().isPickup ? 'PVZ' : 'Hand';
    const normalizedCity = city
      .trim()
      .replace(/\s+(город|г\.?|city)$/i, '')
      .trim();

    try {
      const res = await axiosApi.get('/prices/calculate', {
        params: { type, city: normalizedCity, weight },
      });

      const cost = res.data.totalCost ?? 0;

      if (type === 'PVZ') {
        set((prev) => ({
          pricing: { ...prev.pricing, pvz: cost },
          selectedPrice: cost,
          totalCost: cost,
        }));

        return { totalCost: cost, distributionCenter: res.data.distributionCenter ?? '' };
      } else {
        set((prev) => ({
          pricing: { ...prev.pricing, door: cost },
          selectedPrice: cost,
          totalCost: cost,
        }));

        return { totalCost: cost };
      }
    } catch (error) {
      console.error('Failed to calculate delivery price:', error);
      set((prev) => ({
        pricing: type === 'PVZ' ? { ...prev.pricing, pvz: 0 } : { ...prev.pricing, door: 0 },
        selectedPrice: 0,
        totalCost: 0,
      }));

      return { totalCost: 0, distributionCenter: '' };
    }
  },
}));
