import { offices } from '@/constants.ts';
import type { Order } from '@/types';
import type { Dispatch, FC, SetStateAction } from 'react';

interface Props {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
}

const Step2OfficeSelection: FC<Props> = ({ order, setOrder }) => {
  if (order.deliveryType === 'courier') {
    return (
      <div className="w-full pt-5">
        <h3 className="text-2xl font-bold text-center mb-8">
          Введите адрес получателя
        </h3>

        <div className="flex flex-col gap-4 px-5">
          <input
            type="text"
            placeholder="Город"
            value={order.receiver.city || order.destinationCity || ''}
            onChange={(e) =>
              setOrder((prev) => ({
                ...prev,
                receiver: { ...prev.receiver, city: e.target.value },
              }))
            }
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="text"
            placeholder="Улица"
            value={order.receiver.street || ''}
            onChange={(e) =>
              setOrder((prev) => ({
                ...prev,
                receiver: { ...prev.receiver, street: e.target.value },
              }))
            }
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="text"
            placeholder="Дом"
            value={order.receiver.house || ''}
            onChange={(e) =>
              setOrder((prev) => ({
                ...prev,
                receiver: { ...prev.receiver, house: e.target.value },
              }))
            }
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="text"
            placeholder="Квартира (если есть)"
            value={order.receiver.apartment || ''}
            onChange={(e) =>
              setOrder((prev) => ({
                ...prev,
                receiver: { ...prev.receiver, apartment: e.target.value },
              }))
            }
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-5">
      <h3 className="text-2xl font-bold text-center mb-8">
        Выберите офис отправки
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
        {offices.map((office) => (
          <button
            type="button"
            key={office.id}
            onClick={() =>
              setOrder((prev) => ({
                ...prev,
                originOffice: office.id,
                originCity: office.address.split(',')[0] || '',
              }))
            }
            className={`
              p-6 border-2 rounded-lg transition-all duration-300 text-left
              hover:shadow-lg hover:border-orange-300 hover:scale-105
              ${
              order.originOffice === office.id
                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl scale-105 ring-2 ring-orange-200 ring-opacity-50'
                : 'border-gray-300 bg-white'
            }
            `}
          >
            <div className="flex flex-col h-full">
              <h4 className="font-bold text-lg mb-2 text-gray-800">{office.name}</h4>
              <p className="text-gray-600 flex-grow">{office.address}</p>
              <div
                className={`mt-3 text-sm font-medium ${
                  order.originOffice === office.id ? 'text-orange-600' : 'text-gray-500'
                }`}
              >
                {order.originOffice === office.id ? '✓ выбран' : 'Выбрать'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step2OfficeSelection;
