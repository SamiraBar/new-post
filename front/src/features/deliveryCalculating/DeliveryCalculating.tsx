import { Button } from '@/components/ui/button.tsx';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeliveryStore } from '@/stores/deliveryStore/deliveryStore.ts';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useTranslation } from 'react-i18next';
import TrackingSearch from '@/features/deliveryCalculating/components/TrackingSearch.tsx';

const DeliveryActions = () => {
  const { t } = useTranslation();

  const {
    modalSelectDeliveryVariant,
    openOrCloseModalSelectDeliveryVariant,
    selectDoorDelivery,
    selectPickup,
  } = useDeliveryStore();

  const handleButtonClick = () => {
    setTimeout(() => {
      const calculatorElement = document.getElementById('calculator');
      if (calculatorElement) {
        calculatorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }, 180);
  };

  return (
    <div className="container mx-auto my-10 p-5 max-w-6xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 text-center">
          <h4 className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 flex items-center justify-center mb-1 text-center text-base font-bold px-2 mx-auto">
            {t('deliveryCalculation.headerCalculation')}
          </h4>

          <AlertDialog
            open={modalSelectDeliveryVariant}
            onOpenChange={openOrCloseModalSelectDeliveryVariant}
          >
            <AlertDialogTrigger asChild>
              <Button
                className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 border-2 border-orange-500 bg-orange-500 text-white
    hover:bg-white hover:text-black rounded-xl
    active:scale-95 active:shadow-lg active:bg-orange-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {t('deliveryCalculation.buttonCalculation')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             max-w-md w-full p-6 sm:p-8 md:p-10 rounded-2xl border-[3px] border-orange-500
             bg-white shadow-2xl z-50"
            >
              <div className="flex flex-col gap-4">
                <VisuallyHidden asChild>
                  <AlertDialogTitle>Диалог</AlertDialogTitle>
                </VisuallyHidden>
                <VisuallyHidden asChild>
                  <AlertDialogDescription>Описание</AlertDialogDescription>
                </VisuallyHidden>
                <Button
                  className="max-w-80 sm:max-w-96 md:max-w-110 h-16 border-2 border-orange-500 bg-orange-500 text-white
      hover:bg-white hover:text-orange-600 rounded-xl
      active:scale-95 transition-all duration-300
      flex flex-col items-center justify-center py-2 relative overflow-hidden
      group transform hover:-translate-y-1
      shadow-2xl hover:shadow-3xl shadow-orange-500/30 hover:shadow-orange-500/40"
                  onClick={() => {
                    handleButtonClick();
                    selectPickup();
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
      -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]
      transition-transform duration-700"
                  ></div>

                  <span
                    className="text-lg font-bold
      text-white group-hover:text-orange-600 transition-colors duration-300
      [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)] group-hover:[text-shadow:none]"
                  >
                    {t('deliveryCalculation.modal.buttonOne')}
                  </span>
                </Button>
                <Button
                  className="max-w-80 sm:max-w-96 md:max-w-110 h-16 border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-amber-500 text-white
      hover:bg-gradient-to-br hover:from-white hover:to-orange-50 hover:text-orange-600 rounded-xl
      active:scale-95 transition-all duration-300
      flex flex-col items-center justify-center py-2 relative overflow-hidden
      group transform hover:-translate-y-1
      shadow-2xl hover:shadow-3xl shadow-amber-500/30 hover:shadow-amber-500/40"
                  onClick={() => {
                    handleButtonClick();
                    selectDoorDelivery();
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
      -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]
      transition-transform duration-700"
                  ></div>

                  <span
                    className="text-lg font-bold text-center leading-tight relative z-10
      text-white group-hover:text-orange-600 transition-colors duration-300
      [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)] group-hover:[text-shadow:none]"
                  >
                    {t('deliveryCalculation.modal.buttonTwo')}
                  </span>
                </Button>
                <div className="flex flex-col gap-3 mt-4">
                  <AlertDialogCancel
                    className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 border-2 border-gray-300 bg-white text-gray-700
          hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900
          active:bg-gray-100 active:border-gray-500 active:scale-95
          transition-all duration-200 rounded-xl shadow-md hover:shadow-lg
          font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                      openOrCloseModalSelectDeliveryVariant();
                    }}
                  >
                    {t('deliveryCalculation.modal.closeButton')}
                  </AlertDialogCancel>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="space-y-4 text-center">
          <h4 className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 flex items-center justify-center mb-1 text-center text-base font-bold px-2 mx-auto">
            {t('deliveryCalculation.parcelTracking')}
          </h4>

          <div>
            <TrackingSearch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryActions;
