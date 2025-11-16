import {
  type ChangeEvent,
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import TruckIconA from '@/features/deliveryCostCalculator/components/icons/TruckIconA.tsx';
import TruckIconB from '@/features/deliveryCostCalculator/components/icons/TruckIconB.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Clock, HandCoins, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import type { Order } from '@/types';
import useFileStore from '@/stores/fileStore/fileStore.ts';
import { cities as senderCities } from '@/constants.ts';

interface Props {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  onHandleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
}

const Step1Calculator: FC<Props> = ({ order, setOrder, onHandleChange, handleNext }) => {
  const { citiesPVZ, citiesHand, getCities } = useFileStore();
  const [citySearch, setCitySearch] = useState({ origin: '', destination: '' });

  const recipientCities = order.deliveryType === 'courier' ? citiesHand : citiesPVZ;

  useEffect(() => {
    setOrder(prev => ({ ...prev, destinationCity: '' }));
    getCities(order.deliveryType === 'courier' ? 'Hand' : 'PVZ');
  }, [order.deliveryType, getCities, setOrder]);

  const filteredOriginCities = senderCities.filter(c =>
    c.toLowerCase().includes(citySearch.origin.toLowerCase())
  );

  const filteredDestinationCities = recipientCities.filter(c =>
    c.city.toLowerCase().includes(citySearch.destination.toLowerCase())
  );

  return (
    <div className="w-full lg:flex pt-5">
      <div className="border p-5 rounded-lg w-full shadow-lg">
        <FieldGroup>
          <FieldSet>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
              <FieldGroup className="gap-4">
                <div className="flex items-center">
                  <FieldLabel>Жиберүүчү / Отправитель</FieldLabel>
                  <span className="w-[140] ml-auto">
                    <TruckIconA />
                  </span>
                </div>
                <Select
                  required
                  onValueChange={(value) => setOrder(prev => ({ ...prev, originCity: value }))}
                  value={order.originCity}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Жиберүүчү шаар / Город отправителя" />
                  </SelectTrigger>
                  <SelectContent>
                    <Input
                      name="origin"
                      value={citySearch.origin}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCitySearch(prev => ({ ...prev, origin: e.target.value }))
                      }
                      className="w-full"
                    />
                    {filteredOriginCities.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
              <FieldGroup className="gap-4">
                <div className="flex items-center justify-between">
                  <FieldLabel>Алуучу / Получатель</FieldLabel>
                  <span className="w-[140] ml-auto">
                    <TruckIconB />
                  </span>
                </div>
                <Select
                  required
                  disabled={!recipientCities.length}
                  onValueChange={(value) => setOrder(prev => ({ ...prev, destinationCity: value }))}
                  value={order.destinationCity}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        recipientCities.length
                          ? "Алуучу шаар / Город получателя"
                          : "Города загружаются..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <Input
                      value={citySearch.destination}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCitySearch(prev => ({ ...prev, destination: e.target.value }))
                      }
                      className="w-full"
                    />
                    {filteredDestinationCities.map(city => (
                      <SelectItem key={city.city} value={city.city}>
                        {city.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
            </div>
            <FieldGroup className="flex flex-col sm:flex-row justify-between mt-5 min-w-0">
              <Field>
                <FieldLabel>Посылканын баалуулугу / Ценность посылки</FieldLabel>
                <div className="relative">
                  <Input
                    placeholder="1000"
                    name="parcelValue"
                    type="number"
                    min={0}
                    className="w-full pr-8"
                    value={order.parcelValue || ''}
                    onChange={onHandleChange}
                  />
                  <HandCoins
                    size={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                <p className="text-red-500 text-opacity-80 text-xs sm:text-sm italic mt-1">
                  Максимальная стоимость посылки - 50000 сом
                </p>
              </Field>
              <Field>
                <FieldLabel>Посылканын салмагы / Вес посылки</FieldLabel>
                <div className="relative">
                  <Input
                    placeholder="кг"
                    name="parcelWeight"
                    type="number"
                    min={1}
                    step={0.1}
                    className="w-full pr-8"
                    value={order.parcelWeight || ''}
                    onChange={onHandleChange}
                  />
                  <Weight
                    size={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                <p className="text-red-500 text-opacity-80 text-xs sm:text-sm italic mt-1">
                  Максимальный вес посылки - 15кг
                </p>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </div>
      <div className="shadow-lg border flex flex-col gap-4 p-5 rounded-lg w-full mt-5 lg:mt-0 lg:ml-5 lg:w-1/2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-orange-500" />
            <div>
              <p className="text-sm md:text-base font-medium">Жеткирүү баасы</p>
              <p className="text-sm md:text-base text-gray-600">Стоимость доставки</p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-orange-500 font-bold">
            {order.deliveryCost.toFixed(0)} сом
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-orange-500" />
            <div>
              <p className="text-sm md:text-base font-medium">Жеткирүү убактысы</p>
              <p className="text-sm md:text-base text-gray-600">Время доставки</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg md:text-xl font-semibold">10 - Күн</p>
            <p className="text-sm text-gray-600">Дней</p>
          </div>
        </div>

        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-5 md:py-6 mt-2 text-sm md:text-base font-medium transition-colors"
          onClick={handleNext}
        >
          <div className="text-center">
            <div>Посылканы онлайн каттоо</div>
            <div>Оформить посылку онлайн</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Step1Calculator;
