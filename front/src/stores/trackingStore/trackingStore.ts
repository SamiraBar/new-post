import { create } from 'zustand';
import { toast } from 'sonner';
import type { ParcelInfo } from './types';

interface TrackingStore {
  trackNumber: string;
  parcelInfo: ParcelInfo | null;
  isModalOpen: boolean;
  isLoading: boolean;

  setTrackNumber: (number: string) => void;
  searchParcel: () => Promise<void>;
  closeModal: () => void;
}

const MOCK_DATA: Record<string, ParcelInfo> = {
  'KGZ-312-123456': {
    trackNumber: 'KGZ-312-123456',
    sender: {
      location: 'Бишкек',
      address: 'ул. Толстого 24/1',
    },
    recipient: {
      location: 'Белгород',
      address: 'проспект Славы, дом 129',
    },
    currentStatus: 'Выдано',
    isDelivered: true,
    statuses: [
      { date: '05 ноября 2025', time: '14:18', status: 'Создан' },
      { date: '05 ноября 2025', time: '18:14', status: 'Принят на доставку' },
      { date: '06 ноября 2025', time: '18:14', status: 'Отправлен в город назначения' },
      { date: '11 ноября 2025', time: '18:14', status: 'На складе в стране назначения' },
      { date: '12 ноября 2025', time: '18:14', status: 'В пути в город назначения' },
      { date: '14 ноября 2025', time: '18:14', status: 'В городе назначения' },
      { date: '15 ноября 2025', time: '18:14', status: 'На выдаче в ПВЗ' },
      { date: '16 ноября 2025', time: '18:14', status: 'Выдано' },
    ],
  },
  'KGZ-312-654321': {
    trackNumber: 'KGZ-312-654321',
    sender: {
      location: 'Ош',
      address: 'ул. Ленина 45',
    },
    recipient: {
      location: 'Москва',
      address: 'ул. Тверская 12',
    },
    currentStatus: 'В пути в город назначения',
    isDelivered: false,
    statuses: [
      { date: '10 ноября 2025', time: '09:30', status: 'Создан' },
      { date: '10 ноября 2025', time: '15:45', status: 'Принят на доставку' },
      { date: '11 ноября 2025', time: '13:00', status: 'Отправлен в город назначения' },
      { date: '13 ноября 2025', time: '14:30', status: 'На складе в стране назначения' },
      { date: '14 ноября 2025', time: '15:40', status: 'В пути в город назначения' },
    ],
  },
};

export const useTrackingStore = create<TrackingStore>((set, get) => ({
  trackNumber: '',
  parcelInfo: null,
  isModalOpen: false,
  isLoading: false,

  setTrackNumber: (number) => set({ trackNumber: number }),

  searchParcel: async () => {
    const { trackNumber } = get();

    if (!trackNumber.trim()) {
      toast.error('Трек-номерди киргизиңиз / Введите трек-номер');
      return;
    }

    set({ isLoading: true });

    // Имитация запроса к бэкенду
    await new Promise((resolve) => setTimeout(resolve, 800));

    // ЗДЕСЬ В БУДУЩЕМ БУДЕТ РЕАЛЬНЫЙ API ЗАПРОС:
    // try {
    //   const response = await fetch(`/api/tracking/${trackNumber}`);
    //   if (!response.ok) {
    //     throw new Error('Посылка не найдена');
    //   }
    //   const data = await response.json();
    //   set({ parcelInfo: data, isModalOpen: true, isLoading: false });
    //   toast.success('Посылка табылды / Посылка найдена');
    // } catch (error) {
    //   toast.error('Посылка табылган жок / Посылка не найдена');
    //   set({ isLoading: false });
    // }

    const parcelInfo = MOCK_DATA[trackNumber];

    if (parcelInfo) {
      set({
        parcelInfo,
        isModalOpen: true,
        isLoading: false,
      });
      toast.success('Посылка табылды / Посылка найдена');
    } else {
      set({ isLoading: false });
      toast.error(
        'Посылка табылган жок. / Посылка не найдена. Попробуйте: KGZ-312-123456 или KGZ-312-654321',
      );
    }
  },

  closeModal: () => set({ isModalOpen: false }),
}));
