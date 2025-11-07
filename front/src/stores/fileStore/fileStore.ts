import {create} from "zustand";
import type {FileState} from "@/stores/fileStore/types.ts";
import {useAdminStore} from "@/stores/adminStore/adminStore.ts";


export const useFileStore = create<FileState>((set, get) => ({
  pvzFile: null,
  handFile: null,
  loadingPvz: false,
  loadingHand: false,

  setLoadingPvz: (value: boolean) => set({loadingPvz: value}),
  setLoadingHand: (value: boolean) => set({loadingHand: value}),
  setPvzFile: (file) => set({pvzFile: file}),
  setHandFile: (file) => set({handFile: file}),

  uploadFiles: async (typeFile: string) => {
    const {pvzFile, handFile} = get();

    const token = useAdminStore.getState().admin!.token;

    let fileToSend: File | null = null;

    if (typeFile === "PVZ") {
      fileToSend = pvzFile;
      set({ loadingPvz: true });
    } else if (typeFile === "Hand") {
      fileToSend = handFile;
      set({ loadingHand: true });
    }

    if (!fileToSend) {
      if (typeFile === "PVZ") set({ loadingPvz: false });
      if (typeFile === "Hand") set({ loadingHand: false });
      throw new Error("No file selected");
    }

    const formData = new FormData();
    formData.append("data", fileToSend);

    try {
      const res = await fetch(
        `http://localhost:8000/prices/upload?type=${typeFile}`,
        {
          method: "POST",
          headers: { Authorization: token },
          body: formData,
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Ошибка загрузки");
      }

      return await res.json();
    } finally {
      if (typeFile === "PVZ") set({ loadingPvz: false, pvzFile: null });
      if (typeFile === "Hand") set({ loadingHand: false, handFile: null });
    }
  },
}));

export default useFileStore;