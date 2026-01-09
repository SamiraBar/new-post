import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore';

interface SyncStatusButtonProps {
  trackingNumber: string;
  partnerTrackingNumber?: string;
  partnerType?: string;
  className?: string;
}

const SyncStatusButton = ({
                            trackingNumber,
                            partnerTrackingNumber,
                            partnerType,
                            className = '',
                          }: SyncStatusButtonProps) => {
  const { syncSingleParcel, syncSingleParcelLoading } = useParcelsStore();

  if (partnerType !== 'E-Kit' || !partnerTrackingNumber) {
    return null;
  }

  const handleSync = async () => {
    const result = await syncSingleParcel(trackingNumber);

    if (result.success) {
      if (result.newStatus && result.newStatus !== result.oldStatus) {
        toast.success('Статус обновлен', {
          description: `${result.oldStatus} → ${result.newStatus}`,
        });
      } else {
        toast.info('Синхронизация завершена', {
          description: result.message || 'Статус уже актуален',
        });
      }
    } else {
      toast.error('Ошибка синхронизации', {
        description: result.message,
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={syncSingleParcelLoading}
      className={`flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all ${className}`}
    >
      <RefreshCw
        size={14}
        className={syncSingleParcelLoading ? 'animate-spin' : ''}
      />
      <span className="text-xs font-medium">
        {syncSingleParcelLoading ? 'Синхронизация...' : 'Синхронизировать'}
      </span>
    </Button>
  );
};

export default SyncStatusButton;