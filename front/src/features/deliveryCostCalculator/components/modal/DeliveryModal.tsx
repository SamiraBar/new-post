import { useEffect } from 'react';
import { useDeliveryStore } from '@/stores/deliveryStore/deliveryStore.ts';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const DeliveryModal = () => {
  const {
    calcModal,
    openOrCloseCalcModal,
    selectDoorDelivery,
    selectPickup,
    pricing,
    selectedPrice,
    isPickup,
    isDoorDelivery,
  } = useDeliveryStore();

  const { t } = useTranslation();

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
            className={`
              w-full h-auto min-h-16 border-2 rounded-xl flex flex-col items-center justify-center py-3 px-4
              relative overflow-hidden group transform transition-all duration-300 shadow-lg
              ${isPickup ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-orange-500 text-orange-600'}
              hover:bg-white hover:text-orange-600 hover:shadow-xl
            `}
            onClick={selectPickup}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                         -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]
                         transition-transform duration-700"
            ></div>
            <span className="text-base font-bold text-center leading-tight relative z-10">
              {t('deliveryCostCalculator.modal.toPoint')}
            </span>
            <span className="text-sm font-semibold mt-1 relative z-10">
              {pricing.pvz ? '₽ ' + pricing.pvz : selectedPrice ? '₽ ' + selectedPrice : ''}
            </span>
          </Button>
          <Button
            className={`
              w-full h-auto min-h-16 border-2 rounded-xl flex flex-col items-center justify-center py-3 px-4
              relative overflow-hidden group transform transition-all duration-300 shadow-lg
              ${isDoorDelivery ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-orange-500 text-orange-600'}
              hover:bg-white hover:text-orange-600 hover:shadow-xl
            `}
            onClick={selectDoorDelivery}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                         -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]
                         transition-transform duration-700"
            ></div>
            <span className="text-base font-bold text-center leading-tight relative z-10">
              {t('deliveryCostCalculator.modal.toTheDoor')}
            </span>
            <span className="text-sm font-semibold mt-1 relative z-10">
              {pricing.door ? '₽ ' + pricing.door : selectedPrice ? '₽ ' + selectedPrice : ''}
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
              {t('deliveryCostCalculator.modal.close')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;
