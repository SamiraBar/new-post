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
  downloadFile: (id: string, fileName: string) => Promise<void>;
}

const useCompanyFilesStore = create<CompanyFilesState>((set, get) => ({
  items: [],
  loading: false,

  fetchFiles: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosApi.get('/admin/company-files');
      set({ items: data });
    } finally {
      set({ loading: false });
    }
  },

  uploadFile: async (formData: FormData) => {
    set({ loading: true });
    try {
      await axiosApi.post('/admin/company-files', formData);
      await get().fetchFiles();
    } finally {
      set({ loading: false });
    }
  },

  replaceFile: async (id: string, formData: FormData) => {
    set({ loading: true });
    try {
      await axiosApi.patch(`/admin/company-files/${id}`, formData);
      await get().fetchFiles();
    } finally {
      set({ loading: false });
    }
  },

  deleteFile: async (id: string) => {
    set({ loading: true });
    try {
      await axiosApi.delete(`/admin/company-files/${id}`);
      await get().fetchFiles();
    } finally {
      set({ loading: false });
    }
  },

  downloadFile: async (id: string) => {
    const response = await axiosApi.get(`/admin/company-files/download/${id}`, {
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'file.pdf';

    if (contentDisposition) {
      const match = contentDisposition.match(/filename\*=UTF-8''(.+)$/);
      if (match) fileName = decodeURIComponent(match[1]);
    }

    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
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
