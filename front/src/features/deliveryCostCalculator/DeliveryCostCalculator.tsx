import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Clock, DollarSign,
  HandCoins,
  MapPin, Package,
  SearchIcon,
  TriangleAlert, User, UserCheck,
  Weight
} from 'lucide-react';
import TruckIconA from '@/features/deliveryCostCalculator/components/icons/TruckIconA.tsx';
import TruckIconB from '@/features/deliveryCostCalculator/components/icons/TruckIconB.tsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { toast, Toaster } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import type { Order } from '@/types';

const cities = ['Bishkek', 'Osh', 'Karakol', 'Naryn'];
const BASE_PRICE = 600;
const tariffs = [
  {
    maxWeight: 3,
    pricePerKg: 125
  },
  {
    maxWeight: 6,
    pricePerKg: 135
  },
  {
    maxWeight: 12,
    pricePerKg: 140
  },
  {
    maxWeight: 15,
    pricePerKg: 145
  },
];

const offices = [
  {
    id: 1,
    name: 'Офис Бишкек - Центр',
    address: 'ул. Чуй 100'
  },
  {
    id: 2,
    name: 'Офис Бишкек - Восток',
    address: 'мкр. Восток-5'
  },
  {
    id: 3,
    name: 'Офис Ош',
    address: 'ул. Ленина 50'
  },
  {
    id: 4,
    name: 'Офис Каракол',
    address: 'ул. Гебзе 45'
  },
  {
    id: 5,
    name: 'Офис Нарын',
    address: 'ул. Ленина 23'
  },
  {
    id: 6,
    name: 'Офис Джалал-Абад',
    address: 'ул. Токтогула 78'
  },
  {
    id: 44,
    name: 'Офис Каракол',
    address: 'ул. Гебзе 45'
  },
  {
    id: 443,
    name: 'Офис Нарын',
    address: 'ул. Ленина 23'
  },
  {
    id: 34,
    name: 'Офис Джалал-Абад',
    address: 'ул. Токтогула 78'
  },
];



const DeliveryCostCalculator = () => {
  const [citySearch, setCitySearch] = useState<{ origin: string, destination: string }>({
    origin: '',
    destination: ''
  });
  const doorDelivery = false;
  const [currentStep, setCurrentStep] = useState(1);
  const [destinationOfficeSearch, setDestinationOfficeSearch] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  const [order, setOrder] = useState<Order>({

    originCity: '',
    destinationCity: '',
    originOffice: 0,
    destinationOffice: 0,
    parcelValue: 0,
    parcelWeight: 0,
    deliveryCost: 0,
    insuranceCost: 0,
    totalCost: 0,
    deliveryDate: '',
    inParcel: '',
    sender: {
      name: '',
      email: '',
      phone: '',
    },
    receiver: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const filteredOriginCities = cities.filter((c) => c.toLowerCase().includes(citySearch.origin.toLowerCase()));
  const filteredDestinationCities = cities.filter((c) => c.toLowerCase().includes(citySearch.destination.toLowerCase()));
  const filteredDestinationOffices = offices.filter((c) => c.name.toLowerCase().includes(destinationOfficeSearch.toLowerCase()));

  const calculateDeliveryCost = useCallback((weight: number) => {
    if (order.parcelWeight <= 0) return 0;
    const tariff = tariffs.find(t => weight <= t.maxWeight) || tariffs[tariffs.length - 1];
    const total = BASE_PRICE + (weight - 1) * tariff.pricePerKg;
    return Math.max(total, BASE_PRICE);
  }, [order.parcelWeight]);

  const calculateInsuranceCost = useCallback((parcelValue: number) => {
    if (parcelValue <= 0) return 0;
    if (parcelValue <= 10000) {
      return parcelValue * 0.01;
    } else if (parcelValue <= 50000) {
      return parcelValue * 0.015;
    } else {
      return parcelValue * 0.02;
    }
  }, []);

  useEffect(() => {
    const delivery = calculateDeliveryCost(order.parcelWeight);
    const insurance = calculateInsuranceCost(order.parcelValue);
    const total = delivery + insurance;

    setOrder(prevOrder => ({
      ...prevOrder,
      deliveryCost: delivery,
      insuranceCost: insurance,
      totalCost: total,
    }));

  }, [order.parcelWeight, order.parcelValue, calculateDeliveryCost, calculateInsuranceCost]);

  const validateOrder = () => {
    const validations = [
      {
        field: order.originCity,
        message: 'Жиберүүчү шаарды тандаңыз / Выберите город отправителя'
      },
      {
        field: order.destinationCity,
        message: 'Алуучунун шаарын тандаңыз / Выберите город получателя'
      },
      {
        field: order.parcelValue,
        message: 'Посылканын баасын киргизиңиз / Введите цену посылки'
      },
      {
        field: order.parcelWeight,
        message: 'Посылканын салмагын киргизиңиз / Введите вес посылки'
      }
    ];

    for (const {
      field,
      message
    } of validations) {
      if (!field) {
        toast.error(message);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success('Subject submitted successfully');
  };

  const onHandleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    const {
      name,
      value
    } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, userType?: 'sender' | 'receiver') => {
    const { name, value } = e.target;

    if (userType) {
      setOrder((prevOrder) => ({
        ...prevOrder,
        [userType]: {
          ...prevOrder[userType],
          [name]: value
        }
      }));
    } else {
      setOrder((prevOrder) => ({
        ...prevOrder,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateOrder()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!order.originOffice) {
        return toast.error('Жиберүү кеңсесин тандаңыз / Выберите офис отправки');
      }
      if (doorDelivery) {
        return setCurrentStep(4);
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!order.destinationOffice) {
        return toast.error('Алуучу кеңсесин тандаңыз / Выберите офис получателя');
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!order.sender.name) {
        return toast.error('Жиберүүчүнүн атын киргизиңиз / Введите имя отправителя');
      } else if (!order.sender.email) {
        return toast.error('Жиберүүчүнүн emailин киргизиңиз / Введите email отправителя');
      } else if (!order.sender.phone) {
        return toast.error('Жиберүүчүнүн телефонун киргизиңиз / Введите телефон отправителя');
      } else if (!order.receiver.name) {
        return toast.error('Алуучунун атын киргизиңиз / Введите имя получателя');
      } else if (!order.receiver.email) {
        return toast.error('Алуучунун emailин киргизиңиз / Введите email получателя');
      } else if (!order.receiver.phone) {
        return toast.error('Алуучунун телефонун киргизиңиз / Введите телефон получателя');
      } else if (doorDelivery && !order.receiver.address) {
        return toast.error('Алуучунун дарегин киргизиңиз / Введите адрес получателя');      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // soon
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (doorDelivery && currentStep === 4) {
        return setCurrentStep(2);
      }
      setCurrentStep(currentStep - 1);
    }
  };
  const renderStep1 = () => (
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
                      <TruckIconA/>
                    </span>
                  </div>
                  <Select
                    required
                    onValueChange={(value) => setOrder(prev => ({
                      ...prev,
                      originCity: value
                    }))}
                    value={order.originCity}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Жиберүүчү шаар / Город отправителя"/>
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        name="origin"
                        value={citySearch.origin}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCitySearch(prev => ({
                          ...prev,
                          origin: e.target.value
                        }))}
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
                      <TruckIconB/>
                    </span>
                  </div>
                  <Select
                    required
                    onValueChange={(value) => setOrder(prev => ({
                      ...prev,
                      destinationCity: value
                    }))}
                    value={order.destinationCity}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Алуучу шаар / Город получателя"/>
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        value={citySearch.destination}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCitySearch(prev => ({
                          ...prev,
                          destination: e.target.value
                        }))}
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
                    <HandCoins size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
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
                    <Weight size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
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
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-orange-500"/>
            <div>
              <p className="text-sm md:text-base font-medium">Жеткирүү наркы</p>
              <p className="text-sm md:text-base text-gray-600">Стоимость доставки</p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-orange-500 font-bold">{order.deliveryCost.toFixed(0)} сом</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-blue-500"/>
            <div>
              <p className="text-sm md:text-base font-medium">Страховка</p>
              <p className="text-sm md:text-base text-gray-600">Insurance</p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-blue-500 font-bold">{order.insuranceCost.toFixed(0)} сом</span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t-2 border-orange-200 pt-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 text-green-500"/>
            <div>
              <p className="text-base md:text-lg font-bold">Жалпы сумма</p>
              <p className="text-sm md:text-base text-gray-600">Общая стоимость</p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-green-500 font-bold">{order.totalCost.toFixed(0)} сом</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-orange-500"/>
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
  const renderStep2 = () => (
    <div className="w-full pt-5">
      <h3 className="text-2xl font-bold text-center mb-8">
        Жиберүү кеңсесин тандаңыз / Выберите офис отправки
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
        {offices.map((office) => (
          <button
            type="button"
            key={office.id}
            onClick={() => setOrder(prev => ({
              ...prev,
              originOffice: office.id
            }))}
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
              <div className={`mt-3 text-sm font-medium ${
                order.originOffice === office.id ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {order.originOffice === office.id ? '✓ Таңдалды / Выбран' : 'Тандоо / Выбрать'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
  const renderStep3 = () => (
    <div className="w-full pt-5">
      <h3 className="text-2xl font-bold text-center mb-8">
        Алуучунун офисин тандоо / Выбрать офис получателя
      </h3>

      <InputGroup className="bg-white">
        <InputGroupInput
          placeholder="Поиск отделения"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDestinationOfficeSearch(e.target.value)}
          value={destinationOfficeSearch}
        />
        <InputGroupAddon align="inline-end">
          <SearchIcon/>
        </InputGroupAddon>
      </InputGroup>

      <ScrollArea className="mt-4 h-[35vh] pr-5">
        {filteredDestinationOffices.length > 0 ? (
          <RadioGroup
            value={order.destinationOffice?.toString()}
            onValueChange={(value) => setOrder(prev => ({...prev, destinationOffice: Number(value)}))}
          >
            {filteredDestinationOffices.map((office) => (
              <Label
                key={office.id}
                htmlFor={`office-${office.id}`}
                className="flex items-center gap-3 bg-white p-4 rounded-xl cursor-pointer shadow-sm hover:shadow-lg hover:scale-[0.99] transition-all duration-200 mb-1 border-2 border-transparent data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50"
              >
                <RadioGroupItem
                  value={office.id.toString()}
                  id={`office-${office.id}`}
                  className="border-2 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <div className="flex items-center gap-2 flex-1">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin className="size-5 text-orange-600"/>
                  </div>
                  <span className="font-medium text-gray-800">{office.name}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <MapPin className="size-12 mx-auto mb-2 opacity-30"/>
            <p>Офис не найден</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
  const renderStep4 = () => (
    <div className="w-full pt-5">
      <h3 className="text-2xl font-bold text-center mb-8">
        Жиберүүчүнүн жана алуучунун маалыматы / Данные отправителя и получателя
      </h3>
      <div>
        <FieldGroup>
          <FieldSet>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup className="gap-3">
                <FieldLabel>Жиберүүчү / Отправитель</FieldLabel>
                <Input placeholder="Аты-жөнү / ФИО" className="bg-gray-100" name="name" onChange={(e) => handleChange(e, 'sender')} value={order.sender.name} />
                <Input placeholder="Телфон +996" className="bg-gray-100" name="phone" onChange={(e) => handleChange(e, 'sender')} value={order.sender.phone} />
                <Input placeholder="Email" className="bg-gray-100" name="email" onChange={(e) => handleChange(e, 'sender')} value={order.sender.email} />
              </FieldGroup>

              <FieldGroup className="gap-3">
                <FieldLabel>Алуучу / Получатель</FieldLabel>
                <Input placeholder="Аты-жөнү / ФИО" className="bg-gray-100" name="name" onChange={(e) => handleChange(e, 'receiver')} value={order.receiver.name} />
                <Input placeholder="Телфон +996" className="bg-gray-100" name="phone" onChange={(e) => handleChange(e, 'receiver')} value={order.receiver.phone} />
                <Input placeholder="Email" className="bg-gray-100" name="email" onChange={(e) => handleChange(e, 'receiver')} value={order.receiver.email} />
                {doorDelivery && (
                  <Textarea
                    placeholder="Алуучунун толук дареги, мисалы: Бишкек шаары, Фрунзе көчөсү, 123-үй Подробный адрес Получателя например: город Белгород, проспект Фрунзе дом 123"
                    className="bg-gray-100"
                    name="address"
                    onChange={(e) => handleChange(e, 'receiver')}
                    value={order.receiver.address}
                  />
                )}
              </FieldGroup>

              <Textarea
                className="col-span-1 sm:col-span-2 w-full bg-gray-100"
                placeholder="Посылканын ичиндеги тизмеси / Содержимое посылки"
                name="inParcel"
                onChange={onHandleChange}
                value={order.inParcel}
              />
            </div>
          </FieldSet>
        </FieldGroup>
      </div>
    </div>
  );
  const renderStep5 = () => (
    <div className="w-full pt-5">
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-400/30 border border-yellow-300 mb-6">
        <CircleAlert strokeWidth={2.5} className="text-yellow-600 mt-1"/>
        <div>
          <p className="font-medium text-yellow-800">
            Сураныч, алуучунун жана жөнөтүүчүнүн маалыматтарын так текшериңиз.
          </p>
          <p className="text-sm text-gray-700">
            Башка өлкөгө жөнөткөндө, эгер аты-жөнү туура эмес жазылса, посылканы жеткирүүдөн же берүүдөн баш тартылышы мүмкүн.
          </p>
          <hr className="my-2 border-yellow-200"/>
          <p className="font-medium text-yellow-800">
            Пожалуйста, проверьте данные получателя и отправителя.
          </p>
          <p className="text-sm text-gray-700 mb-2">
            При отправке в другую страну опечатка в ФИО может стать причиной отказа в доставке или выдаче посылки.
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-center mb-8">
        Маалыматты ырастоо / Подтверждение данных
      </h3>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin className="text-orange-500"/>
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
                <p className="text-sm text-gray-600">{doorDelivery ? 'Адрес' : 'Офис'} #{order.receiver.address}</p>
              ) : <p className="text-sm text-gray-600">Офис #{order.destinationOffice}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Package className="text-orange-500"/>
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
            <User className="text-orange-500"/>
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
            <UserCheck className="text-orange-500"/>
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
            <DollarSign className="text-orange-600"/>
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
            <hr className="border-orange-300"/>
            <div className="flex justify-between text-xl">
              <p className="font-bold text-orange-700">Жалпы / Итого</p>
              <p className="font-bold text-orange-700">{order.totalCost} сом</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container" id={'calculator'}>
      <Toaster/>
      <h3 className="text-xl font-medium text-center mb-10">
        Жеткирүү баасын эсептөө калькулятору <br/> Калькулятор расчёта стоимости доставки
      </h3>

      <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg">
        <div className="flex flex-col items-center w-full mb-8 px-4">
          <div className="relative flex justify-between items-center w-full max-w-2xl">
            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-200 -translate-y-1/2 rounded-full">
              <div
                className="h-[3px] bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>
            {(doorDelivery ? [1, 2, 3, 4] : [1, 2, 3, 4, 5]).map((step) => (
              <div key={step} className="relative flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm sm:text-base z-10 transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-orange-500 text-white shadow-md scale-105'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-5">
              <Button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 w-full sm:w-auto justify-center bg-gray-500 hover:bg-gray-600 text-white px-6 py-3"
              >
                <ArrowLeft size={20} />
                <span>Артка / Назад</span>
              </Button>
              {currentStep === 4 && (
                <div className="flex items-start sm:items-center gap-2 w-full sm:w-auto text-center sm:text-left -order-1 sm:order-none">
                  <Checkbox
                    checked={isAgreed}
                    onCheckedChange={() => setIsAgreed(!isAgreed)}
                  />
                  <Label className="text-sm text-gray-600 leading-tight">
                    Мен жеке маалыматтарды иштетүүгө макулмун<br />
                    Я согласен на обработку персональных данных
                  </Label>
                </div>
              )}
              {currentStep === 5 ? (
                <Button
                  type="button"
                  disabled={!isAgreed}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                >
                  <span>Төлөө / Оплата</span>
                  <ArrowRight size={20} />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === 4 && !isAgreed}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <span>{currentStep === 5 ? 'Төлөө / Оплата' : 'Алдыга / Вперед'}</span>
                  <ArrowRight size={20} />
                </Button>
              )}
            </div>

          )}
          {currentStep === 1 && (
            <div className="flex flex-col gap-5 mt-10 text-sm md:text-base px-1 sm:px-5">
              <div className="p-5 border rounded-lg shadow-lg flex gap-2 items-center">
                <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange"/>
                <div>
                  <p>Посылканын баасын туура көрсөт. Посылка жоголсо, баасын кайтарып беребиз.</p>
                  <p>Указывай стоимость посылки правильно. В случае потери вернем указанную стоимость.</p>
                </div>
              </div>
              <div className="p-5 border rounded-lg shadow-lg flex gap-2 items-center">
                <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange"/>
                <div>
                  <p>Посылканын салмагын туура көрсөт.</p>
                  <p>Правльно указывайте вес посылки.</p>
                </div>
              </div>
              <div className="p-5 border rounded-lg shadow-lg flex gap-2 items-center">
                <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange"/>
                <div>
                  <p>Посылканын баардык тараптарынын суммасы 250 см ашпашы керек.</p>
                  <p>Эң узун тарап 100 см ашпашы керек.</p>
                  <p>Сумма всех сторон посылки не должна превышать 250 см.</p>
                  <p>Самая длинная сторона не должна превышать 100 см.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCostCalculator;