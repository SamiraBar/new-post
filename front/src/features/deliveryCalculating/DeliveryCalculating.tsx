import { Button } from '@/components/ui/button.tsx';
import { Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DeliveryCalculating = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      const calculatorElement = document.getElementById('calculator');
      if (calculatorElement) {
        calculatorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 180);
  };

  const { t } = useTranslation();

  return (
    <div className="container mx-auto my-10 p-5 max-w-6xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 text-center">
          <h4 className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 flex items-center justify-center mb-1 text-center text-base font-bold px-2 mx-auto">
            {t('deliveryCalculation.headerCalculation')}
          </h4>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 border-2 border-orange-500 bg-orange-500 text-white
    hover:bg-white hover:text-black rounded-xl
    active:scale-95 active:shadow-lg active:bg-orange-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {t('deliveryCalculation.buttonCalculation')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md mx-auto p-6 sm:p-8 md:p-10 rounded-2xl border-[3px] border-orange-500 bg-white shadow-2xl">
              <div className="flex flex-col gap-4">
                <Button
                  className="max-w-80 sm:max-w-96 md:max-w-110 h-16 border-2 border-orange-500 bg-orange-500 text-white
      hover:bg-white hover:text-orange-600 rounded-xl
      active:scale-95 transition-all duration-300
      flex flex-col items-center justify-center py-2 relative overflow-hidden
      group transform hover:-translate-y-1
      shadow-2xl hover:shadow-3xl shadow-orange-500/30 hover:shadow-orange-500/40"
                  onClick={handleButtonClick}
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
                  onClick={handleButtonClick}
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
                      setIsDialogOpen(false);
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

          <div className="flex gap-0 w-full max-w-80 sm:max-w-96 md:max-w-110 mx-auto">
            <input
              type="text"
              placeholder="Трек-номер..."
              className="flex-1 p-2 rounded-l-xl border-2 border-orange-500 border-r-0
               focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
               transition-all duration-200 shadow-md"
            />
            <Button
              className="bg-orange-500 text-white border-2 border-orange-500 rounded-l-none rounded-r-xl
                  hover:bg-orange-400 hover:border-orange-500
                  active:scale-95 active:shadow-lg active:bg-orange-500 transition-all duration-200 h-11 shadow-md hover:shadow-lg"
            >
              <Search className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCalculating;
