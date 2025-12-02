import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';

interface DeliveryStore {
  isDoorDelivery: boolean;
  isPickup: boolean;
  modalSelectDeliveryVariant: boolean;
  calcModal: boolean;

  openOrCloseModalSelectDeliveryVariant: () => void;
  selectDoorDelivery: () => void;
  selectPickup: () => void;
  openOrCloseCalcModal: () => void;
  clearActions: () => void;
  fetchDeliveryCost: (city: string, weight: number) => Promise<number>;
}

export const useDeliveryStore = create<DeliveryStore>()((set, get) => ({
  isDoorDelivery: false,
  isPickup: false,
  modalSelectDeliveryVariant: false,
  calcModal: false,

  openOrCloseModalSelectDeliveryVariant: () =>
    set({ modalSelectDeliveryVariant: !get().modalSelectDeliveryVariant }),

  openOrCloseCalcModal: () => set({ calcModal: !get().calcModal }),

  selectDoorDelivery: () =>
    set({
      isDoorDelivery: true,
      isPickup: false,
      modalSelectDeliveryVariant: false,
      calcModal: false,
    }),

  selectPickup: () =>
    set({
      isDoorDelivery: false,
      isPickup: true,
      modalSelectDeliveryVariant: false,
      calcModal: false,
    }),

  clearActions: () =>
    set({
      isDoorDelivery: false,
      isPickup: false,
    }),

    fetchDeliveryCost: async (city: string, weight: number) => {
        if (!city || weight <= 0 || weight > 15) return 0;

        const type = get().isPickup ? 'PVZ' : 'Hand';

        try {
            const res = await axiosApi.get('/prices/calculate', {
                params: { type, city, weight },
            });

            return res.data.totalCost ?? 0;
        } catch (error) {
            console.error('Failed to calculate delivery price', error);
            return 0;
        }
    },
}));
