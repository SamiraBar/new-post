import { useEffect } from 'react';
import { useDeliveryStore } from '@/stores/deliveryStore/deliveryStore.ts';
import { Button } from '@/components/ui/button';

interface DeliveryModalProps {
  setOrderDeliveryType: (type: 'PVZ' | 'Hand') => void;
}

const DeliveryModal = ({ setOrderDeliveryType }: DeliveryModalProps) => {
  const { calcModal, openOrCloseCalcModal, selectDoorDelivery, selectPickup } =
    useDeliveryStore();

  useEffect(() => {
    if (calcModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [calcModal]);

  if (!calcModal) return null;

  const handlePVZ = () => {
    selectPickup();
    setOrderDeliveryType('PVZ');
    openOrCloseCalcModal();
  };

  const handleHand = () => {
    selectDoorDelivery();
    setOrderDeliveryType('Hand');
    openOrCloseCalcModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={openOrCloseCalcModal}
    >
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   max-w-md w-full p-6 sm:p-8 md:p-10 rounded-2xl border-[3px] border-orange-500
                   bg-white shadow-2xl z-50 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <Button
            className="w-full h-auto min-h-16 border-2 border-orange-500 bg-orange-500 text-white
                       hover:bg-white hover:text-orange-600 rounded-xl
                       active:scale-95 transition-all duration-300
                       flex flex-col items-center justify-center py-3 px-4 relative overflow-hidden
                       group transform hover:-translate-y-1
                       shadow-lg hover:shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30"
            onClick={handlePVZ}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                         -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]
                         transition-transform duration-700"
            ></div>
            <span className="text-base font-bold text-center leading-tight
                             text-white group-hover:text-orange-600 transition-colors duration-300
                             whitespace-normal break-words">
              Посылка беруу пунктка чейин жеткирүү
            </span>
            <span className="text-sm font-bold text-center leading-tight relative z-10
                             text-white group-hover:text-orange-500 transition-colors duration-300 mt-1
                             whitespace-normal break-words">
              Доставка до пункта выдачи посылок
            </span>
          </Button>

          <Button
            className="w-full h-auto min-h-16 border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-amber-500 text-white
                       hover:bg-gradient-to-br hover:from-white hover:to-orange-50 hover:text-orange-600 rounded-xl
                       active:scale-95 transition-all duration-300
                       flex flex-col items-center justify-center py-3 px-4 relative overflow-hidden
                       group transform hover:-translate-y-1
                       shadow-lg hover:shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30"
            onClick={handleHand}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                         -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]
                         transition-transform duration-700"
            ></div>
            <span className="text-base font-bold text-center leading-tight relative z-10
                             text-white group-hover:text-orange-600 transition-colors duration-300
                             whitespace-normal break-words">
              Алуучунун уйунө чейин жеткирүү
            </span>
            <span className="text-sm font-bold text-center leading-tight relative z-10
                             text-white group-hover:text-orange-500 transition-colors duration-300 mt-1
                             whitespace-normal break-words">
              Доставка до двери получателя
            </span>
          </Button>

          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-gray-300 bg-white text-gray-700
                         hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900
                         active:bg-gray-100 active:border-gray-500 active:scale-95
                         transition-all duration-200 rounded-xl shadow-sm hover:shadow-md
                         font-bold"
              onClick={openOrCloseCalcModal}
            >
              Жабуу / Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;
