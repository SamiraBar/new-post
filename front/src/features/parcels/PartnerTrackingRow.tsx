import { useState } from 'react';
import { Copy, Edit2, Check, X } from 'lucide-react';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore';
import { toast } from 'sonner';
import type { IParcel } from '@/types';
import SyncStatusButton from '@/features/parcels/SyncStatusButton';

interface State {
  editing: boolean;
  partnerTrack: string;
}

const PartnerTrackingRow = ({ parcel }: { parcel: IParcel }) => {
  const [state, setState] = useState<State>({
    editing: false,
    partnerTrack: parcel.partnerTrackingNumber || '',
  });

  const { updatePartnerTrackingNumber, updatePartnerTrackingNumberLoading } = useParcelsStore();

  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success('Трек номер скопирован');
    }
  };

  const savePartnerTracking = async () => {
    const success = await updatePartnerTrackingNumber(parcel._id, state.partnerTrack);
    if (success) {
      setState((prev) => ({ ...prev, editing: false }));
      toast.success('Трек номер партнера обновлен');
    } else {
      toast.error('Ошибка при обновлении трек номера');
    }
  };

  return (
      <div
          data-testid="partner-tracking-row"
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-3 sm:px-4 py-2.5"
      >
      <span className="text-sm text-gray-700 whitespace-nowrap">
        Трек Номер {parcel.partnerType || 'Партнера'}
      </span>

        <div className="flex items-center gap-2">
          {parcel.deliveryType === 'courier' ? (
              state.editing ? (
                  <>
                    <input
                        type="text"
                        data-testid="partner-tracking-input"
                        value={state.partnerTrack}
                        onChange={(e) => setState((prev) => ({ ...prev, partnerTrack: e.target.value }))}
                        className="border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:border-blue-500"
                        placeholder="Введите трек номер"
                    />
                    <div className="relative group">
                      <button
                          data-testid="save-partner-tracking"
                          onClick={savePartnerTracking}
                          disabled={updatePartnerTrackingNumberLoading}
                          className="p-2 rounded hover:bg-green-100 disabled:opacity-50 transition cursor-pointer"
                      >
                        <Check size={18} className="text-green-600" />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                        Сохранить
                      </div>
                    </div>

                    <div className="relative group">
                      <button
                          data-testid="cancel-partner-tracking"
                          onClick={() => {
                            setState({ editing: false, partnerTrack: parcel.partnerTrackingNumber || '' });
                          }}
                          className="p-2 rounded hover:bg-red-100 transition cursor-pointer"
                      >
                        <X size={18} className="text-red-600" />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                        Отмена
                      </div>
                    </div>
                  </>
              ) : (
                  <>
              <span
                  data-testid="partner-tracking-value"
                  className="bg-gray-100 border border-gray-300 px-2 sm:px-3 py-1 rounded text-gray-800 text-xs sm:text-sm break-all max-w-[180px] sm:max-w-none text-right font-mono"
              >
                {state.partnerTrack || 'Не указан'}
              </span>

                    <div className="relative group">
                      <button
                          data-testid="edit-partner-tracking"
                          onClick={() => setState((prev) => ({ ...prev, editing: true }))}
                          className="p-2 rounded hover:bg-blue-100 transition cursor-pointer"
                      >
                        <Edit2 size={16} className="text-blue-600" />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                        Изменить
                      </div>
                    </div>

                    <Copy
                        size={14}
                        className="text-gray-500 cursor-pointer shrink-0 hover:text-blue-600 transition-colors"
                        onClick={() => handleCopy(state.partnerTrack)}
                    />
                  </>
              )
          ) : (
              parcel.partnerTrackingNumber ? (
                  <>
              <span className="bg-blue-100 border border-blue-300 px-2 sm:px-3 py-1 rounded text-blue-800 text-xs sm:text-sm break-all max-w-[180px] sm:max-w-none text-right font-mono">
                {parcel.partnerTrackingNumber}
              </span>
                    <Copy
                        size={14}
                        className="text-gray-500 cursor-pointer shrink-0 hover:text-blue-600 transition-colors"
                        onClick={() => handleCopy(parcel.partnerTrackingNumber!)}
                    />
                    <SyncStatusButton
                        trackingNumber={parcel.trackingNumber}
                        partnerTrackingNumber={parcel.partnerTrackingNumber}
                        partnerType={parcel.partnerType}
                    />
                  </>
              ) : (
                  <span className="bg-gray-100 border border-gray-300 px-2 sm:px-3 py-1 rounded text-gray-500 text-xs sm:text-sm italic">
              Не создан
            </span>
              )
          )}
        </div>
      </div>
  );
};

export default PartnerTrackingRow;