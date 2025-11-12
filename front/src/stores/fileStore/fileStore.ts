import {create} from "zustand";
import type {FileState} from "@/stores/fileStore/types.ts";
import {useAdminStore} from "@/stores/adminStore/adminStore.ts";
import axiosApi from "@/axiosApi.ts";
import {isAxiosError} from "axios";


export const useFileStore = create<FileState>((set, get) => ({
  pvzFile: null,
  handFile: null,
  loadingPvz: false,
  loadingHand: false,

  setLoadingPvz: (value: boolean) => set({ loadingPvz: value }),
  setLoadingHand: (value: boolean) => set({ loadingHand: value }),
  setPvzFile: (file) => set({ pvzFile: file }),
  setHandFile: (file) => set({ handFile: file }),

  uploadFiles: async (typeFile: string) => {
    const { pvzFile, handFile } = get();

    const token = useAdminStore.getState().admin!.token;

    let fileToSend: File | null = null;

    if (typeFile === 'PVZ') {
      fileToSend = pvzFile;
      set({loadingPvz: true});
    } else if (typeFile === "Hand") {
      fileToSend = handFile;
      set({loadingHand: true});
    }

    if (!fileToSend) {
      if (typeFile === "PVZ") set({loadingPvz: false});
      if (typeFile === "Hand") set({loadingHand: false});
      throw new Error("Файл не выбран");
    }

    const formData = new FormData();
    formData.append('data', fileToSend);

    try {
      await axiosApi.post(`/prices/upload?type=${typeFile}`, formData, {headers: {Authorization: token}})
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status) {
        console.log(e)
        throw new Error(e.response.data.message);
      }
    } finally {
      if (typeFile === "PVZ") set({loadingPvz: false, pvzFile: null});
      if (typeFile === "Hand") set({loadingHand: false, handFile: null});
    }
  },
}));

export default useFileStore;
