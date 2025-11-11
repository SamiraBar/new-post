import { create } from 'zustand';

interface DeliveryStore {
  isDoorDelivery: boolean;
  isPickup: boolean;
  modalSelectDeliveryVariant: boolean;
  calcModal: boolean;
  openOrCloseModalSelectDeliveryVariant: () => void;
  selectDoorDelivery: () => void;
  selectPickup: () => void;
  clearActions: () => void;
  openOrCloseCalcModal: () => void;
}

export const useDeliveryStore = create<DeliveryStore>()((set) => ({
  isDoorDelivery: false,
  isPickup: false,
  modalSelectDeliveryVariant: false,
  calcModal: false,

  openOrCloseModalSelectDeliveryVariant: () =>
    set({ modalSelectDeliveryVariant: !useDeliveryStore.getState().modalSelectDeliveryVariant }),
  openOrCloseCalcModal: () => set({ calcModal: !useDeliveryStore.getState().calcModal }),

  selectDoorDelivery: () =>
    set({ isDoorDelivery: true, isPickup: false, modalSelectDeliveryVariant: false, calcModal: false }),
  selectPickup: () =>
    set({ isDoorDelivery: false, isPickup: true, modalSelectDeliveryVariant: false, calcModal: false }),
  clearActions: () => set({ isDoorDelivery: false, isPickup: false }),
}));
