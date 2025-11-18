import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';

interface DeliveryStore {
  isDoorDelivery: boolean;
  isPickup: boolean;
  modalSelectDeliveryVariant: boolean;
  calcModal: boolean;
  pricing: { pvz: number; door: number };
  selectedPrice: number;

  openOrCloseModalSelectDeliveryVariant: () => void;
  selectDoorDelivery: () => void;
  selectPickup: () => void;
  openOrCloseCalcModal: () => void;
  fetchPricing: () => Promise<void>;
  clearActions: () => void;
}

export const useDeliveryStore = create<DeliveryStore>()((set, get) => ({
  isDoorDelivery: false,
  isPickup: false,
  modalSelectDeliveryVariant: false,
  calcModal: false,
  pricing: { pvz: 0, door: 0 },
  selectedPrice: 0,

  openOrCloseModalSelectDeliveryVariant: () =>
    set({ modalSelectDeliveryVariant: !get().modalSelectDeliveryVariant }),

  openOrCloseCalcModal: () => set({ calcModal: !get().calcModal }),

  selectDoorDelivery: () =>
    set({
      isDoorDelivery: true,
      isPickup: false,
      modalSelectDeliveryVariant: false,
      calcModal: false,
      selectedPrice: get().pricing.door,
    }),

  selectPickup: () =>
    set({
      isDoorDelivery: false,
      isPickup: true,
      modalSelectDeliveryVariant: false,
      calcModal: false,
      selectedPrice: get().pricing.pvz,
    }),

  fetchPricing: async () => {
    try {
      const response = await axiosApi.get('/parcels/pricing');
      const pricing = response.data;
      set({
        pricing,
        selectedPrice: get().isPickup ? pricing.pvz : pricing.door,
      });
    } catch (error) {
      console.error('Failed to fetch pricing', error);
    }
  },

  clearActions: () =>
    set({
      isDoorDelivery: false,
      isPickup: false,
      selectedPrice: 0,
    }),
}));
