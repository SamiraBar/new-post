import { create } from 'zustand';
import axiosApi from '@/axiosApi';

export interface CompanyFile {
  _id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

interface CompanyFilesState {
  items: CompanyFile[];
  loading: boolean;

  fetchFiles: () => Promise<void>;
  uploadFile: (data: FormData) => Promise<void>;
  replaceFile: (id: string, data: FormData) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  downloadFile: (id: string, fileName: string) => void;
}

const useCompanyFilesStore = create<CompanyFilesState>((set, get) => ({
  items: [],
  loading: false,

  fetchFiles: async () => {
    const { data } = await axiosApi.get('/admin/company-files');
    set({ items: data, loading: false });
  },

  uploadFile: async (formData: FormData) => {
    await axiosApi.post('/admin/company-files', formData);
    await get().fetchFiles();
  },

  replaceFile: async (id: string, formData: FormData) => {
    await axiosApi.patch(`/admin/company-files/${id}`, formData);
    await get().fetchFiles();
  },

  deleteFile: async (id: string) => {
    await axiosApi.delete(`/admin/company-files/${id}`);
    await get().fetchFiles();
  },

  downloadFile: async (id: string, fileName: string) => {
    const { data } = await axiosApi.get(
      `/admin/company-files/download/${id}`,
      { responseType: 'blob' }
    );

    const blobUrl = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  },
}));

export default useCompanyFilesStore;
