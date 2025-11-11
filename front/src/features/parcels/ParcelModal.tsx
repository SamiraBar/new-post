import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { useEffect } from 'react';

interface ParcelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackNumber: string;
}

const ParcelModal = ({ open, onOpenChange, trackNumber }: ParcelModalProps) => {
  const parcel = {
    _id: 'testParcelId',
    trackingNumber: 'KGZ-312-SLFKDJEWSL',
    partnerTrackingNumber: '№LSDFKJEWXOXS',
    senderFullName: 'Иванов Петр Сергеевич',
    recipientFullName: 'Сидоров Женя Александрович',
    recipientPhoneNumber: '+996 700 234 412',
    originCity: 'Бишкек',
    destinationCity: 'Москва',
    status: 'Создан',
    createdAt: '2025-09-11T10:16:37.775Z',
    isPaid: false,
    partnerStickerReceived: false,
    weight: 0.6,
  };

  useEffect(() => {
    if (open && trackNumber) {
      console.log('Делаем запрос по трек-номеру:', trackNumber);
    }
  }, [open, trackNumber]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Статус посылки: {parcel.trackingNumber}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ParcelModal;
