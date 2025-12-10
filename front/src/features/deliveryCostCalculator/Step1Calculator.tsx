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
import { AlertCircle, CheckCircle, Clock, HandCoins, Weight, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import type { Order } from '@/types';
import { cities as senderCities } from '@/constants.ts';
import useFileStore from '@/stores/fileStore/fileStore.ts';
import { useTranslation } from 'react-i18next';
import type { OrderFormData } from '@/lib/order.schema.ts';

interface Props {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  onHandleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
}

const Step1Calculator: FC<Props> = ({ order, setOrder, onHandleChange, handleNext }) => {
  const { citiesPVZ, citiesHand, getCities, loadingCities } = useFileStore();
  const [citySearch, setCitySearch] = useState({ origin: '', destination: '' });
  const [validationError, setValidationError] = useState<string | null>(null);
  const { t } = useTranslation();

  const {
    register,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext<OrderFormData>();

  const originCity = watch('originCity');
  const destinationCity = watch('destinationCity');
  const parcelValue = watch('parcelValue');
  const parcelWeight = watch('parcelWeight');
  const deliveryType = watch('deliveryType');
  const totalCost = watch('totalCost') || 0;

  useEffect(() => {
    const type: 'PVZ' | 'Hand' = deliveryType === 'courier' ? 'Hand' : 'PVZ';
    setValue('destinationCity', '');
    getCities(type);
  }, [deliveryType, getCities, setValue]);

  const filteredOriginCities = senderCities.filter((c) =>
    c.toLowerCase().includes(citySearch.origin.toLowerCase())
  );

  const recipientCities = deliveryType === 'courier' ? citiesHand : citiesPVZ;
  const filteredDestinationCities = recipientCities.filter((c) =>
    c.city.toLowerCase().includes(citySearch.destination.toLowerCase())
  );

  const handleNextClick = async () => {
    const valid = await trigger([
      'originCity',
      'destinationCity',
      'parcelValue',
      'parcelWeight'
    ]);

    if (valid) {
      handleNext();
    }
  };



  const renderCheck = (valid: boolean) =>
    valid ? (
      <CheckCircle className="ml-2 text-green-500" size={20} />
    ) : (
      <XCircle className="ml-2 text-gray-300" size={20} />
    );

  const isStep1Valid = !!originCity && !!destinationCity && !!parcelValue && parcelValue > 0 && !!parcelWeight && parcelWeight > 0;

  return (
    <div className="w-full lg:flex pt-5 gap-5">
      <div className="border p-5 rounded-lg w-full shadow-lg">
        <FieldGroup>
          <FieldSet>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
              <FieldGroup className="gap-4 w-full">
                <div className="flex items-center">
                  <FieldLabel>
                    {t('deliveryCostCalculator.stepOneForm.sender')}
                  </FieldLabel>
                  {renderCheck(!!originCity)}
                  <span className="w-[140] ml-auto">
                    <TruckIconA />
                  </span>
                </div>
                <Select
                  required
                  onValueChange={(value: string) => setValue('originCity', value)}
                  value={originCity}
                >
                  <SelectTrigger
                    className={`w-full ${errors.originCity ? 'border-red-300' : ''}`}
                  >
                    <SelectValue
                      placeholder={t('deliveryCostCalculator.stepOneForm.senderPlaceholder')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <Input
                      value={citySearch.origin}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCitySearch((prev) => ({ ...prev, origin: e.target.value }))
                      }
                      className="w-full"
                      placeholder="Поиск города..."
                    />
                    {filteredOriginCities.length > 0 ? (
                      filteredOriginCities.map((city) => (
                    <SelectTrigger className={`w-full ${!isOriginCityValid && 'border-red-300'}`}>
                      <SelectValue
                        placeholder={t('deliveryCostCalculator.stepOneForm.senderPlaceholder')}
                      />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" align="start" avoidCollisions={false}>
                      <Input
                        name="origin"
                        value={citySearch.origin}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCitySearch((prev) => ({ ...prev, origin: e.target.value }))
                        }
                        className="w-full"
                      />
                      {filteredOriginCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">Город не найден</div>
                    )}
                  </SelectContent>
                </Select>
                {errors.originCity && (
                  <p className="text-red-500 text-sm">{errors.originCity.message}</p>
                )}
              </FieldGroup>

              <FieldGroup className="gap-4 w-full">
                <div className="flex items-center justify-between">
                  <FieldLabel>
                    {t('deliveryCostCalculator.stepOneForm.recipient')}
                  </FieldLabel>
                  {renderCheck(!!destinationCity)}
                  <span className="w-[140] ml-auto">
                    <TruckIconB />
                  </span>
                </div>
                <Select
                  required
                  disabled={loadingCities || recipientCities.length === 0}
                  onValueChange={(value: string) => setValue('destinationCity', value)}
                  value={destinationCity}
                >
                  <SelectTrigger
                    className={`w-full ${errors.destinationCity ? 'border-red-300' : ''}`}
                  >
                    <SelectValue
                      placeholder={
                        loadingCities
                          ? t('deliveryCostCalculator.stepOneForm.loadingCities')
                          : t('deliveryCostCalculator.stepOneForm.recipientPlaceholder')
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <Input
                      value={citySearch.destination}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCitySearch((prev) => ({ ...prev, destination: e.target.value }))
                      }
                      className="w-full"
                      placeholder="Поиск города..."
                    />
                    {filteredDestinationCities.length > 0 ? (
                      filteredDestinationCities.map((city, index) => (
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>
                <FieldGroup className="gap-4">
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t('deliveryCostCalculator.stepOneForm.recipient')}</FieldLabel>
                    {isDestinationCityValid ? (
                      <CheckCircle className="ml-2 text-green-500" size={20} />
                    ) : (
                      <XCircle className="ml-2 text-gray-300" size={20} />
                    )}
                    <span className="w-[140] ml-auto">
                      <TruckIconB />
                    </span>
                  </div>
                  <Select
                    required
                    disabled={loadingCities || recipientCities.length === 0}
                    onValueChange={(value: string) =>
                      setOrder((prev) => ({ ...prev, destinationCity: value }))
                    }
                    value={order.destinationCity}
                  >
                    <SelectTrigger
                      className={`w-full ${!isDestinationCityValid && 'border-red-300'}`}
                    >
                      <SelectValue
                        placeholder={
                          loadingCities
                            ? t('deliveryCostCalculator.stepOneForm.loadingCities')
                            : t('deliveryCostCalculator.stepOneForm.recipientPlaceholder')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" align="start" avoidCollisions={false}>
                      <Input
                        value={citySearch.destination}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCitySearch((prev) => ({ ...prev, destination: e.target.value }))
                        }
                      />
                      {filteredDestinationCities.map((city, index) => (
                        <SelectItem key={`${city.city}-${index}`} value={city.city}>
                          {city.city}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        {loadingCities ? 'Загрузка...' : 'Город не найден'}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.destinationCity && (
                  <p className="text-red-500 text-sm">
                    {errors.destinationCity.message}
                  </p>
                )}
              </FieldGroup>
            </div>

            <FieldGroup className="flex flex-col sm:flex-row justify-between mt-5 gap-5">
              <Field className="w-full">
                <div className="flex items-center">
                  <FieldLabel>
                    {t('deliveryCostCalculator.stepOneForm.parcelValue')}
                  </FieldLabel>
                  {renderCheck(!!parcelValue && parcelValue > 0)}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="1000"
                    min={0}
                    {...register('parcelValue', { valueAsNumber: true })}
                    className={`w-full pr-8 ${errors.parcelValue ? 'border-red-300' : ''}`}
                  />
                  <HandCoins
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                {errors.parcelValue && (
                  <div className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0" />
                    <p>{t(`${errors.parcelValue.message}`)}</p>
                  </div>
                )}
              </Field>

              <Field className="w-full">
                <div className="flex items-center">
                  <FieldLabel>
                    {t('deliveryCostCalculator.stepOneForm.parcelWeight')}
                  </FieldLabel>
                  {renderCheck(!!parcelWeight && parcelWeight > 0)}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="кг"
                    min={0.1}
                    step={0.1}
                    {...register('parcelWeight', { valueAsNumber: true })}
                    className={`w-full pr-8 transition-all ${
                      errors.parcelWeight
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : ''
                    }`}
                  />
                  <Weight
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                {errors.parcelWeight && (
                  <div className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0" />
                    <p>{t(`${errors.parcelWeight.message}`)}</p>
                  </div>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </div>

      <div className="shadow-lg border flex flex-col gap-4 p-5 rounded-lg w-full lg:w-1/2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-orange-500" />
            <p className="text-sm md:text-base font-medium">
              {t('deliveryCostCalculator.stepOneForm.sum')}
            </p>
          </div>
          <span className="text-2xl md:text-3xl text-orange-500 font-bold">
            {totalCost.toFixed(0)} сом
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-orange-500" />
            <p className="text-sm md:text-base font-medium">
              {t('deliveryCostCalculator.stepOneForm.time')}
            </p>
          </div>
          <p className="text-lg md:text-xl font-semibold">
            10 - {t('deliveryCostCalculator.stepOneForm.day')}
          </p>
        </div>

        <Button
          disabled={!isStep1Valid || loadingCities}
          className={`bg-orange-500 hover:bg-orange-600 text-white px-5 py-5 md:py-6 mt-2 text-sm md:text-base font-medium transition-colors
            ${!isStep1Valid || loadingCities ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={handleNextClick}
        >
          {t('deliveryCostCalculator.buttons.forward')}
        </Button>
      </div>
    </div>
  );
};

export default Step1Calculator;
