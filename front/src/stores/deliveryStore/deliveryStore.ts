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
      const response = await axiosApi.get('/prices', { params: { type: 'PVZ' } });
      const pvzPrice = response.data.length ? response.data[0].basePrice : 0;

      const responseDoor = await axiosApi.get('/prices', { params: { type: 'Hand' } });
      const doorPrice = responseDoor.data.length ? responseDoor.data[0].basePrice : 0;

      set({
        pricing: { pvz: pvzPrice, door: doorPrice },
        selectedPrice: get().isPickup ? pvzPrice : doorPrice,
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
