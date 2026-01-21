import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import axios, { isAxiosError } from 'axios';
import type { ParcelState } from './types';
import type { CreateParcelData, IParcel, Order, PaginatedParcelsResponse } from '@/types';
import { toast } from 'sonner';

interface SearchFilters {
  trackingNumber?: string;
  sender?: string;
  recipient?: string;
}

interface ExtendedParcelState extends ParcelState {
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  createParcelLoading: boolean;
  createParcelError: { error: string } | null;
  createdTrackingNumber: string | null;
  createParcel: (order: Order) => Promise<string | null>;
  updatePartnerTrackingNumberLoading: boolean;
  updatePartnerTrackingNumberError: { error: string } | null;
  updatePartnerTrackingNumber: (
    id: string,
    partnerTrackingNumber: string | null,
  ) => Promise<boolean>;
  printStickerLoading: boolean;
  printStickerError: { error: string } | null;

  printSticker: (
    trackingNumber: string,
    recipientName: string,
    address: string,
  ) => Promise<boolean>;
  printPartnerSticker: (
    partnerTrackingNumber: string,
    recipientName: string,
    quantityOfPlace: number,
    pvzCode: string,
    address: string,
  ) => Promise<boolean>;

  sendParcelToEKitLoading: boolean;
  sendParcelToEKitError: { error: string } | null;
  sendParcelToEKit: (trackingNumber: string) => Promise<{ success: boolean; message?: string }>;

  syncSingleParcelLoading: boolean;
  syncSingleParcelError: { error: string } | null;
  syncSingleParcel: (trackingNumber: string) => Promise<{
    success: boolean;
    message: string;
    oldStatus?: string;
    newStatus?: string;
    ekitStatus?: string;
  }>;
}

const openPdfAndPrint = (pdfBlob: Blob, fileName = 'sticker.pdf') => {
  const blob = new Blob([pdfBlob], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  const printWindow = window.open('', '_blank');

  const cleanup = () => {
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
  };

  if (printWindow) {
    printWindow.document.title = fileName;
    printWindow.location.href = blobUrl;

    const tryPrint = () => {
      try {
        printWindow.focus();
        printWindow.print();
        cleanup();
      } catch {
        setTimeout(tryPrint, 300);
      }
    };

    setTimeout(tryPrint, 300);
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = blobUrl;

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      cleanup();
      setTimeout(() => iframe.remove(), 10_000);
    }
  };

  document.body.appendChild(iframe);
};


export const useParcelsStore = create<ExtendedParcelState>()((set, get) => ({
  parcels: [],
  parcel: null,
  getParcelsLoading: false,
  getParcelsError: null,
  parcelsResponse: null,
  getParcelLoading: false,
  getParcelError: null,
  editParcelStatusLoading: false,
  editParcelStatusError: null,
  createParcelLoading: false,
  createParcelError: null,
  createdTrackingNumber: null,
  searchFilters: {},
  updatePartnerTrackingNumberLoading: false,
  updatePartnerTrackingNumberError: null,
  printStickerLoading: false,
  printStickerError: null,
  sendParcelToEKitLoading: false,
  sendParcelToEKitError: null,
  syncSingleParcelLoading: false,
  syncSingleParcelError: null,

  async sendParcelToEKit(trackingNumber: string) {
    set({
      sendParcelToEKitLoading: true,
      sendParcelToEKitError: null,
    });

    try {
      const { data } = await axiosApi.post<{
        success: boolean;
        message?: string;
        ekitOrderNo?: string;
        ekitBarcode?: string;
        warning?: string;
      }>('/parcels/send-to-ekit', { trackingNumber });

      if (data.success) {
        const currentParcel = get().parcel;
        if (currentParcel && currentParcel.trackingNumber === trackingNumber) {
          set({
            parcel: {
              ...currentParcel,
              status: 'created',
              partnerTrackingNumber: data.ekitBarcode || currentParcel.partnerTrackingNumber,
            },
          });
        }
        await get().getParcels(1);

        if (data.warning) {
          console.warn('Предупреждение при отправке в E-Kit:', data.warning);
        }

        set({ sendParcelToEKitLoading: false });
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Неизвестная ошибка отправки в E-Kit');
      }
    } catch (e: unknown) {
      let errorMessage = 'Не удалось отправить посылку в E-Kit';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }

      set({
        sendParcelToEKitError: { error: errorMessage },
        sendParcelToEKitLoading: false,
      });

      return { success: false, message: errorMessage };
    }
  },

  setSearchFilters(filters: SearchFilters) {
    set({ searchFilters: filters });
    get().getParcels(1);
  },

  async getParcels(page: number) {
    try {
      set({
        getParcelsLoading: true,
        getParcelsError: null,
      });

      const { searchFilters } = get();
      const params = new URLSearchParams();

      if (searchFilters.trackingNumber?.trim()) {
        params.append('trackingNumber', searchFilters.trackingNumber.trim());
      }
      if (searchFilters.sender?.trim()) {
        params.append('sender', searchFilters.sender.trim());
      }
      if (searchFilters.recipient?.trim()) {
        params.append('recipient', searchFilters.recipient.trim());
      }

      params.append('page', String(page));

      const url = `/parcels?${params.toString()}`;

      const { data } = await axiosApi.get<PaginatedParcelsResponse>(url);

      if (page === 1) {
        set({
          parcels: data.parcels,
          parcelsResponse: data,
        });
      } else {
        const current = get().parcels || [];
        const newParcels = data.parcels.filter((p) => !current.some((c) => c._id === p._id));

        set((state) => ({
          parcels: [...(state.parcels ?? []), ...newParcels],
          parcelsResponse: data,
        }));
      }

      return true;
    } catch (e: unknown) {
      let errorMessage = '';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({ getParcelsError: { error: errorMessage } });
      return false;
    } finally {
      set({ getParcelsLoading: false });
    }
  },

  async getParcelById(id: string) {
    try {
      set({
        getParcelLoading: true,
        getParcelError: null,
      });
      const { data } = await axiosApi.get<IParcel>(`/parcels/${id}`);
      set({ parcel: data });
      return true;
    } catch (e: unknown) {
      let errorMessage = '';
      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      set({ getParcelError: { error: errorMessage } });
      return false;
    } finally {
      set({ getParcelLoading: false });
    }
  },

  async editParcelStatus(trackingNumber: string, status: string) {
    set({
      editParcelStatusLoading: true,
      editParcelStatusError: null,
    });
    try {
      const { data } = await axiosApi.patch<{
        message: string;
        parcel: IParcel;
      }>(`/parcels/tracking/${trackingNumber}/status`, { status });
      set({
        editParcelStatusLoading: false,
        parcel: data.parcel,
      });
      return true;
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        set({
          editParcelStatusError: e.response.data.error,
          editParcelStatusLoading: false,
        });
      }
    }
    return false;
  },

  async createParcel(order: Order) {
    set({
      createParcelLoading: true,
      createParcelError: null,
      createdTrackingNumber: null,
    });

    try {
      const parcelData: CreateParcelData = {
        partnerTrackingNumber: null,
        description: order.inParcel,
        sender: {
          fullName: order.sender.name,
          phoneNumber: order.sender.phone,
          email: order.sender.email,
          address: order.originCity,
          inn_passport: order.sender.inn_passport,
        },
        recipient: {
          fullName: order.receiver.name,
          phoneNumber: order.receiver.phone,
          email: order.receiver.email,
          address: order.destinationCity,
          city: order.destinationCity,
        },
        originCity: order.originCity,
        destinationCity: order.destinationCity,
        originOffice: order.originOffice || null,
        destinationOffice: order.destinationOffice || null,
        weight: order.parcelWeight,
        price:order.totalCost,
        inshprice:order.parcelValue,
        isPaid: false,
        partnerStickerReceived: false,
        deliveryType: order.deliveryType,
        partnerType: order.partnerType,
      };

      if (order.deliveryType === 'courier') {
        const fullAddress = [
          order.receiver.city || order.destinationCity,
          order.receiver.street,
          order.receiver.house,
          order.receiver.apartment ? `кв. ${order.receiver.apartment}` : '',
        ]
          .filter(Boolean)
          .join(', ');

        parcelData.recipient = {
          ...parcelData.recipient,
          city: order.receiver.city || order.destinationCity,
          street: order.receiver.street || '',
          house: order.receiver.house || '',
          apartment: order.receiver.apartment || '',
          address: fullAddress,
        };
      }

      if (order.pvzData && order.deliveryType === 'pickup') {
        parcelData.pvzData = {
          code: order.pvzData.code,
          name: order.pvzData.name,
          address: order.pvzData.address,
          phone: order.pvzData.phone,
          worktime: order.pvzData.worktime,
          maxweight: order.pvzData.maxweight,
          parentcode: order.pvzData.parentcode,
          parentname: order.pvzData.parentname,
          town: order.pvzData.town,
          towncode: order.pvzData.towncode,
          region: order.pvzData.region,
          acceptcash: order.pvzData.acceptcash,
          acceptcard: order.pvzData.acceptcard,
        };

        parcelData.recipient = {
          ...parcelData.recipient,
          address: order.pvzData.address,
          city: order.pvzData.town || order.destinationCity,
        };
      }

      const { data } = await axiosApi.post<{
        message: string;
        parcel: IParcel;
        trackingNumber: string;
        warning?: string;
        emailNotificationTriggered?: boolean;
      }>('/parcels', parcelData);

      if (data.warning) {
        console.warn('E-Kit sync warning:', data.warning);
      }

      set({
        createParcelLoading: false,
        parcel: data.parcel,
        createdTrackingNumber: data.trackingNumber,
      });

      if (data.emailNotificationTriggered) {
        toast.success('Посылка создана. Уведомление отправлено!', {
          description: `Email: ${order.sender.email}\nГород: ${order.destinationCity}\nТрек-номер: ${data.trackingNumber}`,
        });
      }

      return data.trackingNumber;
    } catch (e: unknown) {
      let errorMessage = 'Failed to create parcel';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        createParcelError: { error: errorMessage },
        createParcelLoading: false,
      });

      return null;
    }
  },

  async updatePartnerTrackingNumber(id: string, partnerTrackingNumber: string | null) {
    set({ updatePartnerTrackingNumberLoading: true, updatePartnerTrackingNumberError: null });
    try {
      const { data } = await axiosApi.patch<{ message: string; parcel: IParcel }>(
        `/parcels/${id}/partner-tracking-number`,
        { partnerTrackingNumber },
      );
      set({ parcel: data.parcel, updatePartnerTrackingNumberLoading: false });
      get().getParcels(1);
      return true;
    } catch (e: unknown) {
      let errorMessage = 'Failed to update partnerTrackingNumber';
      if (axios.isAxiosError(e)) errorMessage = e.response?.data?.error || e.message;
      else if (e instanceof Error) errorMessage = e.message;
      else if (typeof e === 'string') errorMessage = e;

      set({
        updatePartnerTrackingNumberError: { error: errorMessage },
        updatePartnerTrackingNumberLoading: false,
      });
      return false;
    }
  },

  async printSticker(trackingNumber: string, recipientName: string, address: string) {
    set({ printStickerLoading: true, printStickerError: null });

    try {
      const { data } = await axiosApi.post(
        '/printer/sticker-pdf',
        { trackingNumber, recipientName, address },
        { responseType: 'blob' },
      );

      openPdfAndPrint(data, `sticker-${trackingNumber}.pdf`);

      set({ printStickerLoading: false });
      return true;
    } catch (e: unknown) {
      let errorMessage = 'Не удалось сформировать PDF для печати';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        printStickerError: { error: errorMessage },
        printStickerLoading: false,
      });

      toast.error('Ошибка печати', { description: errorMessage });
      return false;
    }
  },

  async printPartnerSticker(
    partnerTrackingNumber: string,
    recipientName: string,
    quantityOfPlace: number,
    pvzCode: string,
    address: string,
  ) {
    set({ printStickerLoading: true, printStickerError: null });

    try {
      const { data } = await axiosApi.post(
        '/printer/partner-sticker-pdf',
        { partnerTrackingNumber, recipientName, quantityOfPlace, pvzCode, address },
        { responseType: 'blob' },
      );

      openPdfAndPrint(data, `partner-sticker-${partnerTrackingNumber}.pdf`);

      set({ printStickerLoading: false });
      return true;
    } catch (e: unknown) {
      let errorMessage = 'Не удалось сформировать PDF для печати';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        printStickerError: { error: errorMessage },
        printStickerLoading: false,
      });

      toast.error('Ошибка печати', { description: errorMessage });
      return false;
    }
  },

  async syncSingleParcel(trackingNumber: string) {
    set({
      syncSingleParcelLoading: true,
      syncSingleParcelError: null,
    });

    try {
      const { data } = await axiosApi.post<{
        success?: boolean;
        message: string;
        trackingNumber?: string;
        oldStatus?: string;
        newStatus?: string;
        ekitStatus?: string;
        error?: string;
      }>(`/parcels/tracking/${trackingNumber}/sync`);

      if (data.newStatus && data.newStatus !== data.oldStatus) {
        const currentParcel = get().parcel;
        if (currentParcel && currentParcel.trackingNumber === trackingNumber) {
          await get().getParcelById(currentParcel._id);
        }

        await get().getParcels(1);
      }

      set({ syncSingleParcelLoading: false });

      return {
        success: true,
        message: data.message,
        oldStatus: data.oldStatus,
        newStatus: data.newStatus,
        ekitStatus: data.ekitStatus,
      };
    } catch (e: unknown) {
      let errorMessage = 'Не удалось синхронизировать посылку';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.response?.data?.message || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        syncSingleParcelError: { error: errorMessage },
        syncSingleParcelLoading: false,
      });

      return {
        success: false,
        message: errorMessage,
      };
    }
  },
}));

export default useParcelsStore;
