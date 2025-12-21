import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDeliveryStore } from '@/stores/deliveryStore/deliveryStore.ts';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useTranslation } from 'react-i18next';
import TrackingSearch from '@/features/deliveryCalculating/components/TrackingSearch.tsx';
import { Package, Truck, X } from 'lucide-react';

const DeliveryActions = () => {
  const { t } = useTranslation();

  const {
    modalSelectDeliveryVariant,
    openOrCloseModalSelectDeliveryVariant,
    selectDoorDelivery,
    selectPickup,
  } = useDeliveryStore();

  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      const offsetTop = calculatorElement.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleDeliverySelection = (deliveryType: 'pickup' | 'door') => {
    if (deliveryType === 'pickup') {
      selectPickup();
    } else {
      selectDoorDelivery();
    }

    openOrCloseModalSelectDeliveryVariant(false);
    setTimeout(scrollToCalculator, 300);
  };

  const handleCloseModal = () => {
    openOrCloseModalSelectDeliveryVariant(false);
  };

  return (
    <div className="container mx-auto my-10 p-5 max-w-6xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 text-center">
          <h4 className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 flex items-center justify-center mb-1 text-center text-base font-bold px-2 mx-auto">
            {t('deliveryCalculation.headerCalculation')}
          </h4>

          <Dialog
            open={modalSelectDeliveryVariant}
            onOpenChange={openOrCloseModalSelectDeliveryVariant}
          >
            <DialogTrigger asChild>
              <Button
                className="w-full max-w-80 sm:max-w-96 md:max-w-110 h-12 border-2 border-orange-500 bg-orange-500 text-white
                hover:bg-white hover:text-black rounded-xl
                active:scale-95 active:shadow-lg active:bg-orange-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {t('deliveryCalculation.buttonCalculation')}
              </Button>
            </DialogTrigger>

            <DialogContent
              onInteractOutside={handleCloseModal}
              onEscapeKeyDown={handleCloseModal}
              className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 m-1 sm:m-0 w-[calc(100%-2rem)] sm:w-full
                        border-none shadow-2xl bg-transparent"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden">
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-t-2xl z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-8 h-8 animate-bounce" />
                      <div>
                        <DialogTitle className="text-2xl font-bold">
                          Выберите тип доставки
                        </DialogTitle>
                        <p className="text-orange-100 text-sm mt-1">
                          Нажмите на подходящий вариант
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCloseModal}
                      className="hover:bg-white/20 text-white rounded-full transition-all duration-300
                                hover:rotate-90 active:scale-90"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <VisuallyHidden asChild>
                  <DialogDescription>Выбор типа доставки</DialogDescription>
                </VisuallyHidden>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Кнопка ПВЗ */}
                  <Button
                    onClick={() => handleDeliverySelection('pickup')}
                    className="w-full h-auto min-h-[100px] border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-amber-500 text-white
            hover:from-white hover:to-orange-50 hover:text-orange-600 hover:border-orange-600
            rounded-2xl p-6 sm:p-6 relative overflow-hidden group
            transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl
            shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50
            active:scale-[0.98]"
                  >
                    {/* Анимированный блик */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
              -skew-x-12 transform -translate-x-full group-hover:translate-x-full
              transition-transform duration-1000 ease-in-out"
                    />

                    {/* Контент кнопки */}
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                      {/* Иконка */}
                      <div
                        className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center
                  group-hover:bg-orange-500 group-hover:rotate-12
                  transition-all duration-500"
                      >
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-500" />
                      </div>

                      {/* Текст */}
                      <div className="flex-1 text-center sm:text-left">
                        <p
                          className="text-lg sm:text-xl font-bold mb-1
                  text-white group-hover:text-orange-600
                  transition-colors duration-300
                  [text-shadow:_0_2px_4px_rgb(0_0_0_/_30%)] group-hover:[text-shadow:none] whitespace-pre-line sm:pr-7"
                        >
                          {t('deliveryCalculation.modal.buttonOne')}
                        </p>
                        <p className="text-xs sm:text-sm text-orange-100 group-hover:text-orange-400 transition-colors duration-300">
                          Самовывоз из пункта выдачи
                        </p>
                      </div>
                    </div>

                    {/* Декоративные элементы */}
                    <div
                      className="absolute top-2 right-2 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-2xl
                group-hover:bg-orange-300/30 transition-all duration-500"
                    />
                    <div
                      className="absolute bottom-2 left-2 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-xl
                group-hover:bg-amber-300/30 transition-all duration-500"
                    />
                  </Button>

                  {/* Кнопка Курьер */}
                  <Button
                    onClick={() => handleDeliverySelection('door')}
                    className="w-full h-auto min-h-[100px] border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-amber-500 text-white
            hover:from-white hover:to-orange-50 hover:text-orange-600 hover:border-orange-600
            rounded-2xl p-4 sm:p-6 relative overflow-hidden group
            transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl
            shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50
            active:scale-[0.98]"
                  >
                    {/* Анимированный блик */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
              -skew-x-12 transform -translate-x-full group-hover:translate-x-full
              transition-transform duration-1000 ease-in-out"
                    />

                    {/* Контент кнопки */}
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                      {/* Иконка */}
                      <div
                        className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center
                  group-hover:bg-orange-500 group-hover:rotate-12
                  transition-all duration-500"
                      >
                        <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-500" />
                      </div>

                      {/* Текст */}
                      <div className="flex-1 text-center sm:text-left">
                        <p
                          className="text-lg sm:text-xl font-bold mb-1
                  text-white group-hover:text-orange-600
                  transition-colors duration-300
                  [text-shadow:_0_2px_4px_rgb(0_0_0_/_30%)] group-hover:[text-shadow:none]"
                        >
                          {t('deliveryCalculation.modal.buttonTwo')}
                        </p>
                        <p className="text-xs sm:text-sm text-orange-100 group-hover:text-orange-400 transition-colors duration-300">
                          Доставка курьером до адреса
                        </p>
                      </div>
                    </div>

                    {/* Декоративные элементы */}
                    <div
                      className="absolute top-2 right-2 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-2xl
                group-hover:bg-orange-300/30 transition-all duration-500"
                    />
                    <div
                      className="absolute bottom-2 left-2 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-xl
                group-hover:bg-amber-300/30 transition-all duration-500"
                    />
                  </Button>

                  {/* Информационный блок */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                    <p className="text-sm text-gray-600 text-center">
                      💡 Выберите подходящий способ доставки.
                      <br />
                      Стоимость будет рассчитана автоматически.
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
