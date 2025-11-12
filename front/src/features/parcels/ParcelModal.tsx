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
  useEffect(() => {
    if (open && trackNumber) {
      console.log('Делаем запрос по трек-номеру:', trackNumber);
    }
  }, [open, trackNumber]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Статус посылки: </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ParcelModal;
