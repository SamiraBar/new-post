import { CircleAlert, DollarSign, MapPin, Package, User, UserCheck } from 'lucide-react';
import type { Order } from '@/types';
import type { FC } from 'react';

interface Props {
  order: Order;
  doorDelivery?: boolean;
}

const Step5Review: FC<Props> = ({ order, doorDelivery }) => {
  return (
    <div className="w-full pt-5">
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-400/30 border border-yellow-300 mb-6">
        <CircleAlert strokeWidth={2.5} className="text-yellow-600 mt-1" />
        <div>
          <p className="font-medium text-yellow-800">
            Сураныч, алуучунун жана жөнөтүүчүнүн маалыматтарын так текшериңиз.
          </p>
          <p className="text-sm text-gray-700">
            Башка өлкөгө жөнөткөндө, эгер аты-жөнү туура эмес жазылса, посылканы жеткирүүдөн же
            берүүдөн баш тартылышы мүмкүн.
          </p>
          <hr className="my-2 border-yellow-200" />
          <p className="font-medium text-yellow-800">
            Пожалуйста, проверьте данные получателя и отправителя.
          </p>
          <p className="text-sm text-gray-700 mb-2">
            При отправке в другую страну опечатка в ФИО может стать причиной отказа в доставке или
            выдаче посылки.
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-center mb-8">
        Маалыматты ырастоо / Подтверждение данных
      </h3>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin className="text-orange-500" />
            Маршрут / Маршрут
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Кайдан / Откуда</p>
              <p className="font-semibold">{order.originCity}</p>
              <p className="text-sm text-gray-600">Офис #{order.originOffice}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Кайда / Куда</p>
              <p className="font-semibold">{order.destinationCity}</p>
              {doorDelivery ? (
                <p className="text-sm text-gray-600">
                  {doorDelivery ? 'Адрес' : 'Офис'} #{order.receiver.address}
                </p>
              ) : (
                <p className="text-sm text-gray-600">Офис #{order.destinationOffice}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Package className="text-orange-500" />
            Посылка туурасында / О посылке
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Жарыяланган наркы / Объявленная стоимость</p>
              <p className="font-semibold">{order.parcelValue} сом</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Салмагы / Вес</p>
              <p className="font-semibold">{order.parcelWeight} кг</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ичинде / Содержимое</p>
              <p className="font-semibold">{order.inParcel || 'Не указано'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Жеткирүү датасы / Дата доставки</p>
              <p className="font-semibold">{order.deliveryDate || 'Не указано'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <User className="text-orange-500" />
            Жиберүүчү / Отправитель
          </h4>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">ФИО</p>
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
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <UserCheck className="text-orange-500" />
            Алуучу / Получатель
          </h4>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">ФИО</p>
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
            Баасы / Стоимость
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-700">Доставка</p>
              <p className="font-semibold">{order.deliveryCost} сом</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Страховка</p>
              <p className="font-semibold">{order.insuranceCost} сом</p>
            </div>
            <hr className="border-orange-300" />
            <div className="flex justify-between text-xl">
              <p className="font-bold text-orange-700">Жалпы / Итого</p>
              <p className="font-bold text-orange-700">{order.totalCost} сом</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5Review;
