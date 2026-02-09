import { X, Printer, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { IParcel } from '@/types';
import Barcode from 'react-barcode';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore';

import logo from '../../../assets/logo/logo.png';
import { useEffect, useState } from 'react';

type StickerType = 'own' | 'partner';

interface PrintStickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: IParcel;
  stickerType: StickerType;
}

const PrintStickerModal = ({ isOpen, onClose, parcel, stickerType }: PrintStickerModalProps) => {
  const { printSticker, printPartnerSticker, printStickerLoading } = useParcelsStore();
  const [barcodeWidth, setBarcodeWidth] = useState(1.5);

  useEffect(() => {
    const updateBarcodeWidth = () => {
      setBarcodeWidth(window.innerWidth >= 450 ? 1.5 : 1);
    };

    updateBarcodeWidth();

    window.addEventListener('resize', updateBarcodeWidth);

    return () => window.removeEventListener('resize', updateBarcodeWidth);
  }, []);

  const handlePrint = async () => {
    let success = false;

    if (stickerType === 'own') {
      success = await printSticker(
        parcel.trackingNumber,
        parcel.recipient.fullName,
        parcel.recipient.address,
      );
    } else {
      if (!parcel.partnerTrackingNumber) {
        toast.error('Отсутствует трек-номер партнера');
        return;
      }

      if (!parcel.pvzData?.code) {
        toast.error('Отсутствует код ПВЗ');
        return;
      }

      success = await printPartnerSticker(
        parcel.partnerTrackingNumber,
        parcel.recipient.fullName,
        1,
        parcel.pvzData.code,
        parcel.recipient.address,
      );
    }

    if (success) {
      toast.success('Стикер успешно отправлен на печать!');
      onClose();
    }
  };

  const displayTrackingNumber =
    stickerType === 'partner' ? parcel.partnerTrackingNumber : parcel.trackingNumber;
  const title = stickerType === 'partner' ? 'Печать стикера партнера' : 'Печать стикера';

  if (!displayTrackingNumber) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Printer className="w-5 h-5 sm:w-6 sm:h-6" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 sm:mt-4">
          <div className="bg-white border-2 border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 shadow-lg">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="text-center">
                {stickerType === 'own' ? (
                  <img
                    src={logo}
                    alt="New Post logo"
                    className="h-10 sm:h-12 md:h-16 w-auto object-contain"
                  />
                ) : (
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">НОВАЯ ПОЧТА ООО</div>
                )}
              </div>
            </div>

            <div className="flex justify-center bg-white overflow-x-auto">
              <Barcode
                value={displayTrackingNumber}
                height={60}
                width={barcodeWidth}
                fontSize={14}
                background="#ffffff"
                lineColor="#000000"
                displayValue={false}
                margin={0}
              />
            </div>

            <div className="text-center my-4 sm:mb-6">
              <div className="text-md sm:text-xl md:text-2xl font-bold tracking-wider break-all px-2">
                {displayTrackingNumber}
              </div>
            </div>

            {stickerType === 'partner' && parcel.pvzData && (
              <>
                <div>
                  <div className="text-right text-base sm:text-lg font-semibold">
                    <span>КОЛ-ВО: 1</span>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
              <div>
                <div className="text-base sm:text-lg font-semibold">Получатель:</div>
                <div className="text-base sm:text-lg font-medium wrap-break-word">
                  {parcel.recipient.fullName}
                </div>
              </div>

              <div>
                <div className="text-base sm:text-lg font-semibold">Адрес:</div>
                <div className="text-sm sm:text-lg font-medium wrap-break-word">
                  {parcel.recipient.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={printStickerLoading}
            className="flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-1"
          >
            <X className="w-4 h-4" />
            Закрыть
          </Button>
          <Button
            onClick={handlePrint}
            disabled={printStickerLoading}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 w-full sm:w-auto order-1 sm:order-2"
          >
            {printStickerLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Печать...
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Напечатать стикер</span>
                <span className="inline sm:hidden">Печать</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintStickerModal;
