import { type ChangeEvent, type FC, useEffect, useMemo, useState } from 'react';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import TruckIconA from '@/features/deliveryCostCalculator/components/icons/TruckIconA.tsx';
import TruckIconB from '@/features/deliveryCostCalculator/components/icons/TruckIconB.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Input } from '@/components/ui/input.tsx';
import { AlertCircle, Clock, HandCoins, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import useFileStore from '@/stores/fileStore/fileStore.ts';
import { useTranslation } from 'react-i18next';
import { type UseFormReturn, useWatch } from 'react-hook-form';
import type { OrderFormData } from '@/lib/order.schema.ts';
import useOfficesStore from '@/stores/officesStore/officesStore.ts';
import { useCalculatorLimits } from '@/hooks/useCalculatorLimits';

interface Props {
  form: UseFormReturn<OrderFormData>;
  handleNext: () => void;
}

const Step1Calculator: FC<Props> = ({ handleNext, form }) => {
  const { citiesPVZ, citiesHand, getCities, loadingCities } = useFileStore();
  const [citySearch, setCitySearch] = useState({ destination: '' });
  const { t } = useTranslation();
  const { originCities, getOriginCities } = useOfficesStore();

  const { limits } = useCalculatorLimits();

  const {
    register,
    watch,
    formState: { errors },
    setValue,
    trigger,
    clearErrors,
  } = form;

  const [originCity, destinationCity, parcelValue, parcelWeight, deliveryType, length, width, height] = useWatch({
    control: form.control,
    name: ['originCity', 'destinationCity', 'parcelValue', 'parcelWeight', 'deliveryType', 'length', 'width', 'height'],
  });

  // const maxWeightCourier = Number(
  //   t('deliveryCostCalculator.limits.maxWeightCourier', { defaultValue: '15' }),
  // );
  // const maxWeightPVZ = Number(
  //   t('deliveryCostCalculator.limits.maxWeightPVZ', { defaultValue: '12' }),
  // );
  // const maxParcelValue = Number(
  //   t('deliveryCostCalculator.limits.maxParcelValue', { defaultValue: '50000' }),
  // );

  const currentMaxWeight =
    deliveryType === 'courier' ? limits.maxWeightCourier : limits.maxWeightPVZ;

  const trError = (msg: unknown) => {
    const key = String(msg ?? '').trim();
    if (!key) return '';
    const translated = t(key);
    return translated === key ? key : translated;
  };

  const isParcelValueValid =
    Number(parcelValue) > 0 && Number(parcelValue) <= limits.maxParcelValue;
  const isParcelWeightValid = Number(parcelWeight) > 0 && Number(parcelWeight) <= currentMaxWeight;

  useEffect(() => {
    const type: 'PVZ' | 'Hand' = deliveryType === 'courier' ? 'Hand' : 'PVZ';
    void getCities(type);
  }, [deliveryType, clearErrors, getCities, setValue]);

  const recipientCities = deliveryType === 'courier' ? citiesHand : citiesPVZ;

  const filteredDestinationCities = useMemo(() => {
    const q = (citySearch.destination || '').toLowerCase();
    return recipientCities.filter((c) => c.city.toLowerCase().includes(q));
  }, [recipientCities, citySearch.destination]);

  const selectedPrice = watch('totalCost') || 0;

  const canProceed =
    originCity &&
    destinationCity &&
    Number(parcelValue) > 0 &&
    Number(parcelWeight) > 0 &&
    Number(length) > 0 &&
    Number(width) > 0 &&
    Number(height) > 0 &&
    Object.keys(errors).length === 0;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'parcelWeight' || name === undefined) {
        const weight = value.parcelWeight || '';
        const weightNum = parseFloat(weight);
        const typeText = t(`delivery.${deliveryType}`);

        if (!isNaN(weightNum) && weightNum > 0) {
          if (weightNum > currentMaxWeight) {
            const errorMsg = t('deliveryCostCalculator.stepOneForm.maxWeightError', {
              weight: currentMaxWeight,
              type: typeText,
              defaultValue: `Максимальный вес для "${typeText}" — ${currentMaxWeight} кг`,
            });

            setTimeout(() => {
              form.setError(
                'parcelWeight',
                { type: 'manual', message: errorMsg },
                { shouldFocus: false },
              );
            }, 50);
          } else {
            form.clearErrors('parcelWeight');
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, deliveryType, currentMaxWeight, form, t]);

  useEffect(() => {
    const weight = watch('parcelWeight');
    const weightNum = parseFloat(weight);

    if (!isNaN(weightNum) && weightNum > 0) {
      const typeText = t(`delivery.${deliveryType}`);

      if (weightNum > currentMaxWeight) {
        const errorMsg = t('deliveryCostCalculator.stepOneForm.maxWeightError', {
          weight: currentMaxWeight,
          type: typeText,
          defaultValue: `Максимальный вес для "${typeText}" — ${currentMaxWeight} кг`,
        });

        setTimeout(() => {
          form.setError(
            'parcelWeight',
            { type: 'manual', message: errorMsg },
            { shouldFocus: false },
          );
        }, 50);
      } else {
        form.clearErrors('parcelWeight');
      }
    }
  }, [deliveryType, currentMaxWeight, watch, form, t]);

  useEffect(() => {
    void getOriginCities();
  }, [getOriginCities]);

  const handleNextClick = async () => {
    const valid = await trigger([
      'destinationCity', 'originCity', 'parcelWeight', 'parcelValue', 'length', 'width', 'height',
    ]);
    if (valid) handleNext();
  };

  return (
    <div className="w-full lg:flex pt-5">
      <div className="border p-5 rounded-lg w-full shadow-lg">
        <FieldGroup>
          <FieldSet>
            <div>
              <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                <FieldGroup className="gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FieldLabel>{t('deliveryCostCalculator.stepOneForm.sender')}</FieldLabel>
                    </div>

                    <span className="w-[140px] flex justify-end">
                      <TruckIconA />
                    </span>
                  </div>

                  <Select
                    onValueChange={(value: string) => {
                      setValue('originCity', value, { shouldDirty: true, shouldValidate: true });
                      clearErrors('originCity');
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t('deliveryCostCalculator.stepOneForm.senderPlaceholder')}
                      />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      avoidCollisions={false}
                    >
                      {originCities.length > 0 ? (
                        originCities.map((o) => (
                          <SelectItem value={o.city.toString()} key={o._id}>
                            {o.label}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0">Офисы не найдены</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FieldGroup>

                <FieldGroup className="gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FieldLabel>{t('deliveryCostCalculator.stepOneForm.recipient')}</FieldLabel>
                    </div>

                    <span className="w-[140px] flex justify-end">
                      <TruckIconB />
                    </span>
                  </div>

                  <Select
                    required
                    disabled={loadingCities || recipientCities.length === 0}
                    onValueChange={(value: string) => {
                      setValue('destinationCity', value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      clearErrors('destinationCity');
                    }}
                    value={destinationCity || ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          loadingCities
                            ? t('deliveryCostCalculator.stepOneForm.loadingCities')
                            : t('deliveryCostCalculator.stepOneForm.recipientPlaceholder')
                        }
                      />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      avoidCollisions={false}
                    >
                      <Input
                        value={citySearch.destination}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCitySearch({ destination: e.target.value })
                        }
                      />

                      {filteredDestinationCities.map((city, index) => (
                        <SelectItem key={`${city.city}-${index}`} value={city.city}>
                          {city.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>

              <FieldGroup className="flex flex-col sm:flex-row justify-between mt-5 mb-1 min-w-0">
                <Field>
                  <div className="flex items-center gap-2">
                    <FieldLabel>{t('deliveryCostCalculator.stepOneForm.parcelValue')}</FieldLabel>
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="1000"
                      type="number"
                      className={`w-full pr-8 ${
                        !isParcelValueValid && Number(parcelValue) > 0 ? 'border-red-300' : ''
                      }`}
                      {...register('parcelValue')}
                    />
                    <HandCoins
                      size={20}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  {errors.parcelValue && (
                    <div className="mt-1 flex items-center gap-1.5 text-red-500 text-sm">
                      <AlertCircle size={14} className="shrink-0" />
                      <p>{trError(errors.parcelValue.message)}</p>
                    </div>
                  )}
                </Field>

                <Field>
                  <div className="flex items-center gap-2">
                    <FieldLabel>{t('deliveryCostCalculator.stepOneForm.parcelWeight')}</FieldLabel>
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="кг"
                      type="number"
                      min={1}
                      step={0.1}
                      className={`w-full pr-8 ${
                        !isParcelWeightValid && Number(parcelWeight) > 0 ? 'border-red-300' : ''
                      }`}
                      {...register('parcelWeight', {
                        onBlur: (e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            const rounded = Math.ceil(value);
                            setValue('parcelWeight', String(rounded), {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }
                        },
                      })}
                    />
                    <Weight
                      size={20}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  {errors.parcelWeight && (
                    <div className="mt-1 flex items-center gap-1.5 text-red-500 text-sm">
                      <AlertCircle size={14} className="shrink-0" />
                      <p>{trError(errors.parcelWeight.message)}</p>
                    </div>
                  )}
                </Field>
              </FieldGroup>

              <FieldGroup className="flex flex-col sm:flex-row justify-between min-w-0 gap-4">
                <Field>
                  <FieldLabel>{t('deliveryCostCalculator.stepOneForm.length')}</FieldLabel>
                  <Input
                    placeholder={t('deliveryCostCalculator.stepOneForm.cm')}
                    type="number"
                    min={1}
                    step={0.1}
                    className="w-full"
                    {...register('length')}
                  />
                  {errors.length && (
                    <div className="mt-1 flex items-center gap-1.5 text-red-500 text-sm">
                      <AlertCircle size={14} className="shrink-0" />
                      <p>{trError(errors.length.message)}</p>
                    </div>
                  )}
                </Field>

                <Field>
                  <FieldLabel>{t('deliveryCostCalculator.stepOneForm.width')}</FieldLabel>
                  <Input
                    placeholder={t('deliveryCostCalculator.stepOneForm.cm')}
                    type="number"
                    min={1}
                    step={0.1}
                    className="w-full"
                    {...register('width')}
                  />
                  {errors.width && (
                    <div className="mt-1 flex items-center gap-1.5 text-red-500 text-sm">
                      <AlertCircle size={14} className="shrink-0" />
                      <p>{trError(errors.width.message)}</p>
                    </div>
                  )}
                </Field>

                <Field>
                  <FieldLabel>{t('deliveryCostCalculator.stepOneForm.height')}</FieldLabel>
                  <Input
                    placeholder={t('deliveryCostCalculator.stepOneForm.cm')}
                    type="number"
                    min={1}
                    step={0.1}
                    className="w-full"
                    {...register('height')}
                  />
                  {errors.height && (
                    <div className="mt-1 flex items-center gap-1.5 text-red-500 text-sm">
                      <AlertCircle size={14} className="shrink-0" />
                      <p>{trError(errors.height.message)}</p>
                    </div>
                  )}
                </Field>
              </FieldGroup>
            </div>
          </FieldSet>
        </FieldGroup>
      </div>

      <div className="shadow-lg border flex flex-col gap-4 p-5 rounded-lg w-full mt-5 lg:mt-0 lg:ml-5 lg:w-1/2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HandCoins className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-orange-500" />
            <div>
              <p className="text-sm md:text-base font-medium">
                {t('deliveryCostCalculator.stepOneForm.sum')}
              </p>
            </div>
          </div>
          <span className="text-2xl md:text-3xl text-orange-500 font-bold">
            {Number(selectedPrice).toFixed(0)} сом
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-orange-500" />
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
          disabled={!canProceed}
          onClick={handleNextClick}
          className="mt-2 w-full bg-orange-500 px-5 py-5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 md:py-6 md:text-base"
        >
          {t('deliveryCostCalculator.buttons.forward')}
        </Button>
      </div>
    </div>
  );
};

export default Step1Calculator;
