import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import type { CourierCity, PickupCity } from '@/types';

interface CitiesStore {
  courierCities: CourierCity[];
  pickupCities: PickupCity[];
  getCities: () => Promise<void>;
}

const useCitiesStore = create<CitiesStore>((set) => ({
  courierCities: [],
  pickupCities: [],
  getCities: async () => {
    try {
      const courierRes = await axiosApi.get<CourierCity[]>('/cities/courier-cities');
      const pickupRes = await axiosApi.get<PickupCity[]>('/cities/pickup-cities');
      set({ courierCities: courierRes.data, pickupCities: pickupRes.data });
    } catch (error) {
      console.error('Error fetching cities', error);
    }
  },
}));

export default useCitiesStore;
