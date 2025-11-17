import { create } from "zustand";
import type { FileState } from "@/stores/fileStore/types.ts";
import { useAdminStore } from "@/stores/adminStore/adminStore.ts";
import axiosApi from "@/axiosApi.ts";
import { isAxiosError } from "axios";

interface PriceItem {
  city: string;
  region?: string;
  country?: string;
}

const useFileStore = create<
  FileState & {
  citiesPVZ: PriceItem[];
  citiesHand: PriceItem[];
  loadingCities: boolean;
  getCities: (type: "PVZ" | "Hand") => Promise<void>;
}
>((set, get) => ({
  pvzFile: null,
  handFile: null,

  setPvzFile: (file) => set({ pvzFile: file }),
  setHandFile: (file) => set({ handFile: file }),

  loadingPvz: false,
  loadingHand: false,

  uploadFiles: async (typeFile: "PVZ" | "Hand") => {
    const { pvzFile, handFile } = get();
    const token = useAdminStore.getState().admin!.token;

    let fileToSend: File | null = null;

    if (typeFile === "PVZ") {
      fileToSend = pvzFile;
      set({ loadingPvz: true });
    } else {
      fileToSend = handFile;
      set({ loadingHand: true });
    }

    if (!fileToSend) {
      if (typeFile === "PVZ") set({ loadingPvz: false });
      else set({ loadingHand: false });
      throw new Error("File not selected");
    }

    const formData = new FormData();
    formData.append("data", fileToSend);

    try {
      await axiosApi.post(`/prices/upload?type=${typeFile}`, formData, {
        headers: { Authorization: token },
      });
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        throw new Error(e.response.data.message);
      }
    } finally {
      if (typeFile === "PVZ") {
        set({ loadingPvz: false, pvzFile: null });
      } else {
        set({ loadingHand: false, handFile: null });
      }
    }
  },

  citiesPVZ: [],
  citiesHand: [],
  loadingCities: false,

  getCities: async (type: "PVZ" | "Hand") => {
    set({ loadingCities: true });

    try {
      const response = await axiosApi.get<PriceItem[]>("/prices", {
        params: { type },
      });

      const formatted = response.data.map((c) => ({
        city: c.city,
        region: c.region,
        country: c.country,
      }));

      if (type === "PVZ") {
        set({ citiesPVZ: formatted });
      } else {
        set({ citiesHand: formatted });
      }
    } catch (e) {
      console.error(e);

      if (type === "PVZ") {
        set({ citiesPVZ: [] });
      } else {
        set({ citiesHand: [] });
      }
    } finally {
      set({ loadingCities: false });
    }
  },
}));

export default useFileStore;
