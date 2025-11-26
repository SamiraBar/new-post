import { create } from "zustand";
import axiosApi from "@/axiosApi.ts";
import type { Pvz, PvzState } from "./types";
import { isAxiosError } from "axios";

export const usePvzStore = create<PvzState>()((set) => ({
  pvzList: [],
  selectedPvz: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    acceptcash: false,
    acceptcard: false,
    acceptfitting: false,
  },

  async fetchPvz({ city, weight }) {
    if (!city) {
      set({ pvzList: [], selectedPvz: null, error: null, loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const { data } = await axiosApi.get<Pvz[]>("/pvz", {
        params: { city, weight },
      });

      set((state) => ({
        pvzList: data,
        selectedPvz:
            state.selectedPvz && data.some((p) => p.code === state.selectedPvz?.code)
                ? state.selectedPvz
                : null,
        loading: false,
        error: null,
      }));
    } catch (e) {
      let message = "Не удалось загрузить пункты самовывоза";
      if (isAxiosError(e) && e.response?.data?.error) {
        message = e.response.data.error;
      }
      set({ pvzList: [], selectedPvz: null, error: message, loading: false });
    }
  },

  setSelectedPvz(pvz) {
    set({ selectedPvz: pvz });
  },

  setSearch(term) {
    set((state) => ({
      filters: { ...state.filters, search: term },
    }));
  },

  toggleFilter(key) {
    set((state) => ({
      filters: { ...state.filters, [key]: !state.filters[key] },
    }));
  },

  clear() {
    set({
      pvzList: [],
      selectedPvz: null,
      loading: false,
      error: null,
      filters: {
        search: "",
        acceptcash: false,
        acceptcard: false,
        acceptfitting: false,
      },
    });
  },
}));

export default usePvzStore;
