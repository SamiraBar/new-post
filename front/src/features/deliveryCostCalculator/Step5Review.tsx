import { CircleAlert, Clock, DollarSign, MapPin, Package, Phone, User, UserCheck } from 'lucide-react';
import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeliveryStore } from '@/stores/deliveryStore/deliveryStore';
import type { UseFormReturn } from 'react-hook-form';
import type { OrderFormData } from '@/lib/order.schema.ts';

interface Props {
  form: UseFormReturn<OrderFormData>;
  doorDelivery?: boolean;
}

const Step5Review: FC<Props> = ({ form, doorDelivery }) => {
  const { t } = useTranslation();
  const { fetchDeliveryCost } = useDeliveryStore();
  const order = form.getValues();
  useEffect(() => {
    const ensurePrice = async () => {
      if (order.deliveryCost === 0 && order.destinationCity && Number(order.parcelWeight) > 0) {
        console.log('Step5: No delivery cost, recalculating...');
        const cityForCalculation = order.pvzData?.town || order.destinationCity;
        console.log('  - Город для пересчёта:', cityForCalculation);
        console.log('  - Вес:', order.parcelWeight);
        await fetchDeliveryCost(cityForCalculation, Number(order.parcelWeight));
      } else {
        console.log('Step5: Delivery cost already set:', order.deliveryCost);
      }
    };

    void ensurePrice();
  }, [fetchDeliveryCost, order.deliveryCost, order.destinationCity, order.parcelWeight, order.pvzData]);

  return (
    <div className="w-full pt-5">
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-400/30 border border-yellow-300 mb-6">
        <CircleAlert strokeWidth={2.5} className="text-yellow-600 mt-1" />
        <div>
          <p className="font-medium text-yellow-800">
            {t('deliveryCostCalculator.stepFive.warningTextOne')}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            {t('deliveryCostCalculator.stepFive.warningTextTwo')}
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-center mb-8">
        {t('deliveryCostCalculator.stepFive.title')}
      </h3>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin className="text-orange-500" />
            Маршрут
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t('deliveryCostCalculator.stepFive.where')}</p>
              <p className="font-semibold">{order.originCity}</p>
              <p className="text-sm text-gray-600">
                {t('deliveryCostCalculator.stepFive.office')} #{order.originOffice}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t('deliveryCostCalculator.stepFive.toWhere')}
              </p>
              <p className="font-semibold">{order.destinationCity}</p>
              {doorDelivery ? (
                <p className="text-sm text-gray-600">
                  {t('deliveryCostCalculator.stepFive.address')}:{' '}
                  {order.receiver.address || order.receiver.street}
                </p>
              ) : order.pvzData ? (
                <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-semibold text-orange-900">ПВЗ: {order.pvzData.name}</p>
                  <p className="text-xs text-gray-700 mt-1">{order.pvzData.address}</p>
                  {order.pvzData.town && (
                    <p className="text-xs text-gray-700 mt-1">
                      <span className="font-semibold">{t('measoftMap.actualPvzCity')}:</span>{' '}
                      {order.pvzData.town}
                    </p>
                  )}
                  {order.pvzData.phone && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <Phone className="w-3 h-3" />
                      {order.pvzData.phone}
                    </div>
                  )}
                  {order.pvzData.worktime && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {order.pvzData.worktime}
                    </div>
                  )}
                  {(order.pvzData.acceptcash === 1 || order.pvzData.acceptcard === 1) && (
                    <div className="flex gap-2 mt-2">
                      {order.pvzData.acceptcash === 1 && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          💵 Наличные
                        </span>
                      )}
                      {order.pvzData.acceptcard === 1 && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          💳 Карта
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  {t('deliveryCostCalculator.stepFive.office')} #{order.destinationOffice}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Package className="text-orange-500" />
            {t('deliveryCostCalculator.stepFive.about')}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t('deliveryCostCalculator.stepFive.price')}</p>
              <p className="font-semibold">{order.parcelValue} сом</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('deliveryCostCalculator.stepFive.weight')}</p>
              <p className="font-semibold">{order.parcelWeight} кг</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t('deliveryCostCalculator.stepFive.content')}
              </p>
              <p className="font-semibold">
                {order.inParcel || t('deliveryCostCalculator.stepFive.notSpecified')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('deliveryCostCalculator.stepFive.date')}</p>
              <p className="font-semibold">
                {order.deliveryDate || t('deliveryCostCalculator.stepFive.notSpecified')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <User className="text-orange-500" />
            {t('deliveryCostCalculator.stepFive.sender')}
          </h4>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">
                {t('deliveryCostCalculator.stepFive.inputName')}
              </p>
              <p className="font-semibold">{order.sender.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{order.sender.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Телефон</p>
              <p className="font-semibold">{order.sender.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ИНН/Паспорт</p>
              <p className="font-semibold">{order.sender.inn_passport}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <UserCheck className="text-orange-500" />
            {t('deliveryCostCalculator.stepFive.recipient')}
          </h4>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">
                {t('deliveryCostCalculator.stepFive.inputName')}
              </p>
              <p className="font-semibold">{order.receiver.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{order.receiver.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Телефон</p>
              <p className="font-semibold">{order.receiver.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 shadow-sm border-2 border-orange-300">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <DollarSign className="text-orange-600" />
            {t('deliveryCostCalculator.stepFive.sum')}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-700">{t('deliveryCostCalculator.stepFive.delivery')}</p>
              <p className="font-semibold">{order.deliveryCost} сом</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">{t('deliveryCostCalculator.stepFive.insurance')}</p>
              <p className="font-semibold">{order.insuranceCost} сом</p>
            </div>
            <hr className="border-orange-300" />
            <div className="flex justify-between text-xl">
              <p className="font-bold text-orange-700">
                {t('deliveryCostCalculator.stepFive.total')}
              </p>
              <p className="font-bold text-orange-700">{order.totalCost} сом</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5Review;