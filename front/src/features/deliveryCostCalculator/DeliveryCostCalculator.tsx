import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Clock,
  HandCoins,
  MapPin,
  SearchIcon,
  TriangleAlert,
  Weight
} from 'lucide-react';
import TruckIconA from '@/features/deliveryCostCalculator/components/icons/TruckIconA.tsx';
import TruckIconB from '@/features/deliveryCostCalculator/components/icons/TruckIconB.tsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';

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

interface Order {
  originCity: string;
  destinationCity: string;
  originOffice: string;
  destinationOffice: string;
  parcelValue: number;
  parcelWeight: number;
  deliveryCost: number;
  insuranceCost: number;
  totalCost: number;
  deliveryDate: string;
}

const DeliveryCostCalculator = () => {
  const [city, setCity] = useState('');
  const [weight, setWeight] = useState(0);
  const [value, setValue] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [insuranceCost, setInsuranceCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOffice, setSelectedOffice] = useState<number | null>(null);
  const [receiverBranch, setReceiverBranch] = useState('');
  const [selectReceiverBranch, setSelectReceiverBranch] = useState('');

  const [order, setOrder] = useState<Order>({
    originCity: '',
    destinationCity: '',
    originOffice: '',
    destinationOffice: '',
    parcelValue: 0,
    parcelWeight: 0,
    deliveryCost: 0,
    insuranceCost: 0,
    totalCost: 0,
    deliveryDate: '',
  });

  const filteredCities = cities.filter((c) => c.toLowerCase().includes(city.toLowerCase()));
  const filteredReceiverBranches = offices.filter((c) => c.name.toLowerCase().includes(receiverBranch.toLowerCase()));

  const calculateDeliveryCost = (weight: number) => {
    if (weight <= 0) return 0;
    const tariff = tariffs.find(t => weight <= t.maxWeight) || tariffs[tariffs.length - 1];
    const total = BASE_PRICE + (weight - 1) * tariff.pricePerKg;
    return Math.max(total, BASE_PRICE);
  };

  const calculateInsuranceCost = (parcelValue: number) => {
    if (parcelValue <= 0) return 0;
    if (parcelValue <= 10000) {
      return parcelValue * 0.01;
    } else if (parcelValue <= 50000) {
      return parcelValue * 0.015;
    } else {
      return parcelValue * 0.02;
    }
  };

  useEffect(() => {
    const delivery = calculateDeliveryCost(weight);
    const insurance = calculateInsuranceCost(value);
    const total = delivery + insurance;

    setDeliveryCost(delivery);
    setInsuranceCost(insurance);
    setTotalCost(total);
  }, [weight, value]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (weight > 0 && value > 0) {
      setCurrentStep(2);
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  const onHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  }

  const handleNext = () => {
    if (currentStep === 2 && selectedOffice) {
      setCurrentStep(3);
    } else if (currentStep === 3 && selectedOffice) {
      setCurrentStep(4);
    } else if (currentStep === 4 && selectedOffice) {
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const renderStep1 = () => (
    <form className="w-full lg:flex pt-5" onSubmit={handleSubmit}>
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
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Жиберүүчү шаар / Город отправителя"/>
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        name="originCity"
                        value={order.originCity}
                        onChange={onHandleChange}
                        className="w-full"
                      />
                      {filteredCities.map((city) => (
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
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Алуучу шаар / Город получателя"/>
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        value={city}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                      />
                      {filteredCities.map((city) => (
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
                      required
                      type="number"
                      min={'0'}
                      className="w-full pr-8"
                      value={value || ''}
                      onChange={(e) => setValue(Number(e.target.value) || 0)}
                    />
                    <HandCoins size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                  </div>
                </Field>
                <Field>
                  <FieldLabel>Посылканын салмагы / Вес посылки</FieldLabel>
                  <div className="relative">
                    <Input
                      placeholder="кг"
                      required
                      type="number"
                      min={'1'}
                      step="0.1"
                      className="w-full pr-8"
                      value={weight || ''}
                      onChange={(e) => setWeight(Number(e.target.value) || 0)}
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
          <span className="text-2xl md:text-3xl text-orange-500 font-bold">{deliveryCost.toFixed(0)} сом</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-blue-500"/>
            <div>
              <p className="text-sm md:text-base font-medium">Страховка</p>
              <p className="text-sm md:text-base text-gray-600">Insurance</p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-blue-500 font-bold">{insuranceCost.toFixed(0)} сом</span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t-2 border-orange-200 pt-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 text-green-500"/>
            <div>
              <p className="text-base md:text-lg font-bold">Жалпы сумма</p>
              <p className="text-sm md:text-base text-gray-600">Общая стоимость</p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-green-500 font-bold">{totalCost.toFixed(0)} сом</span>
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
          type="submit"
        >
          <div className="text-center">
            <div>Посылканы онлайн каттоо</div>
            <div>Оформить посылку онлайн</div>
          </div>
        </Button>
      </div>
    </form>
  );
  const renderStep2 = () => (
    <div className="w-full pt-5">
      <h3 className="text-2xl font-bold text-center mb-8">
        Тандоо кеңсесин / Выберите офис отправки
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
        {offices.map((office) => (
          <button
            key={office.id}
            onClick={() => setSelectedOffice(office.id)}
            className={`
            p-6 border-2 rounded-lg transition-all duration-300 text-left
            hover:shadow-lg hover:border-orange-300 hover:scale-105
            ${
              selectedOffice === office.id
                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl scale-105 ring-2 ring-orange-200 ring-opacity-50'
                : 'border-gray-300 bg-white'
            }
          `}
          >
            <div className="flex flex-col h-full">
              <h4 className="font-bold text-lg mb-2 text-gray-800">{office.name}</h4>
              <p className="text-gray-600 flex-grow">{office.address}</p>
              <div className={`mt-3 text-sm font-medium ${
                selectedOffice === office.id ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {selectedOffice === office.id ? '✓ Таңдалды / Выбран' : 'Тандоо / Выбрать'}
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
      <div>
        <div>
          <InputGroup className="bg-white">
            <InputGroupInput placeholder="Поиск отделения"
                             onChange={(e: ChangeEvent<HTMLInputElement>) => setReceiverBranch(e.target.value)}
                             value={receiverBranch}/>
            <InputGroupAddon align="inline-end">
              <SearchIcon/>
            </InputGroupAddon>
          </InputGroup>
          <ScrollArea className="mt-4 h-[35vh] pr-5">
            {
              filteredReceiverBranches.map((office) => (
                <div
                  key={office.id}
                  className="flex items-center gap-2 bg-white mb-1 p-2 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
                  onClick={() => setSelectReceiverBranch(String(office.id))}
                >
                  <Checkbox
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-0 size-5"
                    size="size-5"
                    checked={selectReceiverBranch === String(office.id)}
                  />
                  <MapPin className="size-4"/>
                  <div className="text-[16] font-medium">{office.name}</div>
                </div>
              ))
            }
          </ScrollArea>
        </div>
      </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 grid-c gap-4">
              <FieldGroup className="gap-3">
                <FieldLabel>Жиберүүчү / Отправитель</FieldLabel>
                <Input placeholder="Аты-жөнү / ФИО" className="bg-gray-100" required/>
                <Input placeholder="Телфон" className="bg-gray-100" required />
                <Input placeholder="Email" className="bg-gray-100" required />
              </FieldGroup>
              <FieldGroup className="gap-3">
                <FieldLabel>Жиберүүчү / Отправитель</FieldLabel>
                <Input placeholder="Аты-жөнү / ФИО" className="bg-gray-100" required />
                <Input placeholder="Телфон" className="bg-gray-100" required />
                <Input placeholder="Email" className="bg-gray-100" required />
              </FieldGroup>
              <Textarea
                className="col-span-1 sm:col-span-2 w-full bg-gray-100"
                placeholder="Посылканын ичиндеги тизмеси / Содержимое посылки" required
              />
            </div>
          </FieldSet>
        </FieldGroup>
      </div>
    </div>
  );
  const renderStep5 = () => (
    <div className="w-full pt-5">
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-400/30 border border-yellow-300">
        <CircleAlert strokeWidth={2.5} className="text-yellow-600 mt-1" />
        <div>
          <p className="font-medium text-yellow-800">
            Сураныч, алуучунун жана жөнөтүүчүнүн маалыматтарын так текшериңиз.
          </p>
          <p className="text-sm text-gray-700">
            Башка өлкөгө жөнөткөндө, эгер аты-жөнү туура эмес жазылса, посылканы жеткирүүдөн же берүүдөн баш тартылышы мүмкүн.          </p>
          <hr className="my-2 border-yellow-200" />
          <p className="font-medium text-yellow-800">
            Пожалуйста, проверьте данные получателя и отправителя.
          </p>
          <p className="text-sm text-gray-700 mb-2">
            При отправке в другую страну опечатка в ФИО может стать причиной отказа в доставке или выдаче посылки.
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-center mb-8">
        Подтверждение отправки
      </h3>
      <div>

      </div>
    </div>
  );

  console.log(order);

  return (
    <div className="container" id={'calculator'}>
      <h3 className="text-xl font-medium text-center mb-10">
        Жеткирүү баасын эсептөө калькулятору <br/> Калькулятор расчёта стоимости доставки
      </h3>

      <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <div className={`w-20 h-1 ${currentStep >= 3 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <div className={`w-20 h-1 ${currentStep >= 4 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 4 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
              4
            </div>
            <div className={`w-20 h-1 ${currentStep >= 5 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 5 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
              5
            </div>
          </div>
        </div>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep > 1 && (
          <div className="flex justify-between mt-8 px-5">
            <Button
              onClick={handleBack}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3"
            >
              <ArrowLeft size={20}/>
              <span>Артка / Назад</span>
            </Button>

            {currentStep <= 5 && (
              <Button
                onClick={handleNext}
                disabled={currentStep === 2 && !selectedOffice}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span>{ currentStep === 5 ? 'Төлөө / Оплата' : 'Алдыга / Вперед'}</span>
                <ArrowRight size={20}/>
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
  );
};

export default DeliveryCostCalculator;