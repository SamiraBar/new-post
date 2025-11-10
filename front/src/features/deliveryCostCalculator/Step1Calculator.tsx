import { type ChangeEvent, type Dispatch, type FC, type SetStateAction, useState } from 'react';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import TruckIconA from '@/features/deliveryCostCalculator/components/icons/TruckIconA.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Input } from '@/components/ui/input.tsx';
import TruckIconB from '@/features/deliveryCostCalculator/components/icons/TruckIconB.tsx';
import { Clock, HandCoins, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import type { Order } from '@/types';
import { cities } from '@/constants.ts';

interface Props {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  onHandleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
}

const Step1Calculator: FC<Props> = ({ order, setOrder, onHandleChange, handleNext }) => {
  const [citySearch, setCitySearch] = useState<{ origin: string; destination: string }>({
    origin: '',
    destination: '',
  });
  const filteredOriginCities = cities.filter((c) =>
    c.toLowerCase().includes(citySearch.origin.toLowerCase()),
  );
  const filteredDestinationCities = cities.filter((c) =>
    c.toLowerCase().includes(citySearch.destination.toLowerCase()),
  );

  return (
    <div className="w-full lg:flex pt-5">
      <div className="border p-5 rounded-lg w-full shadow-lg">
        <FieldGroup>
          <FieldSet>
            <div>
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
                    onValueChange={(value) =>
                      setOrder((prev) => ({
                        ...prev,
                        originCity: value,
                      }))
                    }
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
                          setCitySearch((prev) => ({
                            ...prev,
                            origin: e.target.value,
                          }))
                        }
                        className="w-full"
                      />
                      {filteredOriginCities.map((city) => (
                        <SelectItem value={city} key={city}>
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
                    onValueChange={(value) =>
                      setOrder((prev) => ({
                        ...prev,
                        destinationCity: value,
                      }))
                    }
                    value={order.destinationCity}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Алуучу шаар / Город получателя" />
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        value={citySearch.destination}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCitySearch((prev) => ({
                            ...prev,
                            destination: e.target.value,
                          }))
                        }
                      />
                      {filteredDestinationCities.map((city) => (
                        <SelectItem value={city} key={city}>
                          {city}
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
                      min={'0'}
                      className="w-full pr-8"
                      value={order.parcelValue || ''}
                      onChange={onHandleChange}
                    />
                    <HandCoins
                      size={20}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel>Посылканын салмагы / Вес посылки</FieldLabel>
                  <div className="relative">
                    <Input
                      placeholder="кг"
                      name="parcelWeight"
                      type="number"
                      min={'1'}
                      step="0.1"
                      className="w-full pr-8"
                      value={order.parcelWeight || ''}
                      onChange={onHandleChange}
                    />
                    <Weight
                      size={20}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </Field>
              </FieldGroup>
            </div>
          </FieldSet>
        </FieldGroup>
      </div>

      <div className="shadow-lg border flex flex-col gap-4 p-5 rounded-lg w-full mt-5 lg:mt-0 lg:ml-5 lg:w-1/2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-orange-500" />
            <div>
              <p className="text-sm md:text-base font-medium">Жеткирүү наркы</p>
              <p className="text-sm md:text-base text-gray-600">Стоимость доставки</p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-orange-500 font-bold">
            {order.deliveryCost.toFixed(0)} сом
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-blue-500" />
            <div>
              <p className="text-sm md:text-base font-medium">Страховка</p>
              <p className="text-sm md:text-base text-gray-600">Insurance</p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-blue-500 font-bold">
            {order.insuranceCost.toFixed(0)} сом
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t-2 border-orange-200 pt-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 text-green-500" />
            <div>
              <p className="text-base md:text-lg font-bold">Жалпы сумма</p>
              <p className="text-sm md:text-base text-gray-600">Общая стоимость</p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-green-500 font-bold">
            {order.totalCost.toFixed(0)} сом
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
