import { type ChangeEvent, type FC, useEffect, useState, } from 'react';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import TruckIconA from '@/features/deliveryCostCalculator/components/icons/TruckIconA.tsx';
import TruckIconB from '@/features/deliveryCostCalculator/components/icons/TruckIconB.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select.tsx';
import { Input } from '@/components/ui/input.tsx';
import { AlertCircle, CheckCircle, Clock, HandCoins, Weight, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { cities as senderCities } from '@/constants.ts';
import useFileStore from '@/stores/fileStore/fileStore.ts';
import { useTranslation } from 'react-i18next';
import { type UseFormReturn } from 'react-hook-form';
import type { OrderFormData } from '@/lib/order.schema.ts';

interface Props {
  form: UseFormReturn<OrderFormData>;
  handleNext: () => void;
}

const Step1Calculator: FC<Props> = ({
                                      handleNext,
                                      form
                                    }) => {
  const {
    citiesPVZ,
    citiesHand,
    getCities,
    loadingCities
  } = useFileStore();
  const [citySearch, setCitySearch] = useState({
    origin: '',
    destination: ''
  });
  const {t} = useTranslation();

  const {
    register,
    watch,
    formState: {errors},
    setValue,
    trigger,
    clearErrors
  } = form;


  const {
    originCity,
    destinationCity,
    parcelValue,
    parcelWeight,
    deliveryType
  } = watch();

  const selectedPrice = watch('totalCost') || 0;
  const isOriginCityValid = !!originCity;
  const isDestinationCityValid = !!destinationCity;
  const isParcelValueValid = Number(parcelValue) > 0 && Number(parcelValue) <= 50000;
  const isParcelWeightValid = Number(parcelWeight) > 0 && Number(parcelWeight) <= 15;

  useEffect(() => {
    const type: 'PVZ' | 'Hand' = deliveryType === 'courier' ? 'Hand' : 'PVZ';
    setValue('destinationCity', '');
    void getCities(type);
  }, [deliveryType, getCities, setValue]);

  const filteredOriginCities = senderCities.filter((c) =>
    c.toLowerCase().includes(citySearch.origin.toLowerCase()),
  );

  const parcelValueNum = Number(parcelValue || 0);
  const parcelWeightNum = Number(parcelWeight || 0);
  const isNextDisabled = !!originCity && !!destinationCity && !!parcelValue && parcelValueNum > 0 && !!parcelWeight && parcelWeightNum > 0 && !(Object.keys(errors).length > 0);

  const recipientCities = deliveryType === 'courier' ? citiesHand : citiesPVZ;

  const filteredDestinationCities = recipientCities.filter((c) =>
    c.city.toLowerCase().includes(citySearch.destination.toLowerCase()),
  );

  const handleNextClick = async () => {
    if (!isNextDisabled) {
      return;
    }
    const valid = await trigger(['destinationCity', 'originCity', 'parcelWeight', 'parcelValue']);
    if (valid) {
      handleNext();
    }
  };

  return (
    <div className="w-full lg:flex pt-5">
      <div className="border p-5 rounded-lg w-full shadow-lg">
        <FieldGroup>
          <FieldSet>
            <div>
              <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                <FieldGroup className="gap-4">
                  <div className="flex items-center">
                    <FieldLabel>{t('deliveryCostCalculator.stepOneForm.sender')}</FieldLabel>
                    {isOriginCityValid ? (
                      <CheckCircle className="ml-2 text-green-500" size={20}/>
                    ) : (
                      <XCircle className="ml-2 text-gray-300" size={20}/>
                    )}
                    <span className="w-[140] ml-auto">
                      <TruckIconA/>
                    </span>
                  </div>
                  <Select
                    required
                    onValueChange={(value: string) => {
                      setValue('originCity', value);
                      clearErrors('originCity');
                    }}
                    value={originCity}
                  >
                    <SelectTrigger className={`w-full`}>
                      <SelectValue
                        placeholder={t('deliveryCostCalculator.stepOneForm.senderPlaceholder')}
                      />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" align="start" avoidCollisions={false}>
                      <Input
                        name="origin"
                        value={citySearch.origin}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCitySearch((prev) => ({
                            ...prev,
                            origin: e.target.value
                          }))
                        }
                        className="w-full"
                      />
                      {filteredOriginCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.originCity && (
                    <div
                      className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                      <AlertCircle size={14} className="shrink-0"/>
                      <p>{errors.originCity.message}</p>
                    </div>
                  )}
                </FieldGroup>
                <FieldGroup className="gap-4">
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t('deliveryCostCalculator.stepOneForm.recipient')}</FieldLabel>
                    {isDestinationCityValid ? (
                      <CheckCircle className="ml-2 text-green-500" size={20}/>
                    ) : (
                      <XCircle className="ml-2 text-gray-300" size={20}/>
                    )}
                    <span className="w-[140] ml-auto">
                      <TruckIconB/>
                    </span>
                  </div>
                  <Select
                    required
                    disabled={loadingCities || recipientCities.length === 0}
                    onValueChange={(value: string) => {
                      setValue('destinationCity', value);
                      clearErrors('destinationCity');
                    }}
                    value={destinationCity}
                  >
                    <SelectTrigger
                      className={`w-full`}
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
                          setCitySearch((prev) => ({
                            ...prev,
                            destination: e.target.value
                          }))
                        }
                      />
                      {filteredDestinationCities.map((city, index) => (
                        <SelectItem key={`${city.city}-${index}`} value={city.city}>
                          {city.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.destinationCity && (
                    <div
                      className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                      <AlertCircle size={14} className="shrink-0"/>
                      <p>{errors.destinationCity.message}</p>
                    </div>
                  )}
                </FieldGroup>
              </div>

              <FieldGroup className="flex flex-col sm:flex-row justify-between mt-5 min-w-0">
                <Field>
                  <div className="flex items-center">
                    <FieldLabel>{t('deliveryCostCalculator.stepOneForm.parcelValue')}</FieldLabel>
                    {isParcelValueValid ? (
                      <CheckCircle className="ml-2 text-green-500" size={20}/>
                    ) : (
                      <XCircle className="ml-2 text-gray-300" size={20}/>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="1000"
                      type="number"
                      min={0}
                      className={`w-full pr-8 ${!isParcelValueValid && Number(parcelValue) > 0 && 'border-red-300'}`}
                      {...register('parcelValue')}
                    />
                    <HandCoins
                      size={20}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {errors.parcelValue && (
                    <div
                      className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                      <AlertCircle size={14} className="shrink-0"/>
                      <p>{errors.parcelValue.message}</p>
                    </div>
                  )}
                  <div className="mt-1 text-red-500 text-xs sm:text-sm italic">
                    {t('deliveryCostCalculator.stepOneForm.maxPrice')} - 50000 сом
                  </div>
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel>{t('deliveryCostCalculator.stepOneForm.parcelWeight')}</FieldLabel>
                    {isParcelWeightValid ? (
                      <CheckCircle className="ml-2 text-green-500" size={20}/>
                    ) : (
                      <XCircle className="ml-2 text-gray-300" size={20}/>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="кг"
                      type="number"
                      min={1}
                      step={0.1}
                      className={`w-full pr-8 ${!isParcelWeightValid && Number(parcelWeight) > 0 && 'border-red-300'}`}
                      {...register('parcelWeight')}
                    />
                    <Weight
                      size={20}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {errors.parcelWeight && (
                    <div
                      className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                      <AlertCircle size={14} className="shrink-0"/>
                      <p>{errors.parcelWeight.message}</p>
                    </div>
                  )}
                  <div className="mt-1 text-red-500 text-xs sm:text-sm italic">
                    {t('deliveryCostCalculator.stepOneForm.maxWeight')} - 15кг
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
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-orange-500"/>
            <div>
              <p className="text-sm md:text-base font-medium">
                {t('deliveryCostCalculator.stepOneForm.sum')}
              </p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-orange-500 font-bold">
            {selectedPrice.toFixed(0)} сом
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-orange-500"/>
            <div>
              <p className="text-sm md:text-base font-medium">
                {t('deliveryCostCalculator.stepOneForm.time')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg md:text-xl font-semibold">
              10 - {t('deliveryCostCalculator.stepOneForm.day')}
            </p>
          </div>
        </div>

        <Button
          disabled={!isNextDisabled}
          className={`bg-orange-500 hover:bg-orange-600 text-white px-5 py-5 md:py-6 mt-2 text-sm md:text-base font-medium transition-colors
            ${!isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}
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