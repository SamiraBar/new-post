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

interface Props {
  form: UseFormReturn<OrderFormData>;
  handleNext: () => void;
}

const ORIGIN_CITY_VALUE = 'Bishkek';
const ORIGIN_CITY_LABEL_RU = 'Бишкек';
const ORIGIN_OFFICE_ID = 1;

const Step1Calculator: FC<Props> = ({ handleNext, form }) => {
  const { citiesPVZ, citiesHand, getCities, loadingCities } = useFileStore();
  const [citySearch, setCitySearch] = useState({ destination: '' });
  const { t } = useTranslation();

  const {
    register,
    watch,
    formState: { errors },
    setValue,
    trigger,
    clearErrors,
  } = form;

  const [originCity, destinationCity, parcelValue, parcelWeight, deliveryType] = useWatch({
    control: form.control,
    name: ['originCity', 'destinationCity', 'parcelValue', 'parcelWeight', 'deliveryType'],
  });

  const trError = (msg: unknown) => {
    const key = String(msg ?? '').trim();
    if (!key) return '';
    const translated = t(key);
    return translated === key ? key : translated;
  };

  const isParcelValueValid = Number(parcelValue) > 0 && Number(parcelValue) <= 50000;
  const isParcelWeightValid = Number(parcelWeight) > 0 && Number(parcelWeight) <= 15;

  useEffect(() => {
    setValue('originCity', ORIGIN_CITY_VALUE, { shouldDirty: true, shouldValidate: true });
    clearErrors('originCity');

    setValue('originOffice', ORIGIN_OFFICE_ID as any, { shouldDirty: true, shouldValidate: true });
    clearErrors('originOffice');
  }, [clearErrors, setValue]);

  useEffect(() => {
    const type: 'PVZ' | 'Hand' = deliveryType === 'courier' ? 'Hand' : 'PVZ';

    setValue('destinationCity', '', { shouldDirty: true, shouldValidate: true });
    clearErrors('destinationCity');
    setCitySearch({ destination: '' });

    void getCities(type);
  }, [deliveryType, clearErrors, getCities, setValue]);

  const recipientCities = deliveryType === 'courier' ? citiesHand : citiesPVZ;

  const filteredDestinationCities = useMemo(() => {
    const q = (citySearch.destination || '').toLowerCase();
    return recipientCities.filter((c) => c.city.toLowerCase().includes(q));
  }, [recipientCities, citySearch.destination]);

  const selectedPrice = watch('totalCost') || 0;

  const canProceed =
    ORIGIN_CITY_VALUE === originCity &&
    !!destinationCity &&
    Number(parcelValue) > 0 &&
    Number(parcelWeight) > 0 &&
    Object.keys(errors).length === 0;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'parcelWeight' || name === undefined) {
        const weight = value.parcelWeight || '';
        const weightNum = parseFloat(weight);
        const currentMax = deliveryType === 'courier' ? 15 : 12;
        const typeText = t(`delivery.${deliveryType}`);

        if (!isNaN(weightNum) && weightNum > 0) {
          if (weightNum > currentMax) {
            const errorMsg = t('deliveryCostCalculator.stepOneForm.maxWeightError', {
              weight: currentMax,
              type: typeText,
            });

            setTimeout(() => {
              form.setError(
                'parcelWeight',
                {
                  type: 'manual',
                  message: errorMsg,
                },
                {
                  shouldFocus: false,
                },
              );
            }, 50);
          } else {
            form.clearErrors('parcelWeight');
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, deliveryType, form, t]);

  useEffect(() => {
    const weight = watch('parcelWeight');
    const weightNum = parseFloat(weight);

    if (!isNaN(weightNum) && weightNum > 0) {
      const currentMax = deliveryType === 'courier' ? 15 : 12;
      const typeText = t(`delivery.${deliveryType}`);

      if (weightNum > currentMax) {
        const errorMsg = t('deliveryCostCalculator.stepOneForm.maxWeightError', {
          weight: currentMax,
          type: typeText,
        });

        setTimeout(() => {
          form.setError(
            'parcelWeight',
            {
              type: 'manual',
              message: errorMsg,
            },
            {
              shouldFocus: false,
            },
          );
        }, 50);
      } else {
        form.clearErrors('parcelWeight');
      }
    }
  }, [deliveryType, watch, form, t]);

  const handleNextClick = async () => {
    const valid = await trigger(['destinationCity', 'originCity', 'parcelWeight', 'parcelValue']);
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

                  <Select value={ORIGIN_CITY_VALUE} disabled>
                    <SelectTrigger className="w-full bg-gray-100 text-gray-600 cursor-not-allowed">
                      <SelectValue placeholder={ORIGIN_CITY_LABEL_RU} />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      avoidCollisions={false}
                    >
                      <SelectItem value={ORIGIN_CITY_VALUE}>{ORIGIN_CITY_LABEL_RU}</SelectItem>
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

              <FieldGroup className="flex flex-col sm:flex-row justify-between mt-5 min-w-0">
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

                  <div className="h-6 mt-1">
                    {errors.parcelValue && (
                      <div className="flex items-center gap-1.5 text-red-500 text-sm">
                        <AlertCircle size={14} className="shrink-0" />
                        <p>{trError(errors.parcelValue.message)}</p>
                      </div>
                    )}
                  </div>
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

                  <div className="h-6 mt-1">
                    {errors.parcelWeight && (
                      <div className="flex items-center gap-1.5 text-red-500 text-sm animate-in fade-in slide-in-from-top-1">
                        <AlertCircle size={14} className="shrink-0" />
                        <p>{trError(errors.parcelWeight.message)}</p>
                      </div>
                    )}
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
          className={`bg-orange-500 hover:bg-orange-600 text-white px-5 py-5 md:py-6 mt-2 text-sm md:text-base font-medium transition-colors ${
            !canProceed ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleNextClick}
        >
          {t('deliveryCostCalculator.buttons.forward')}
        </Button>
      </div>
    </div>
  );
};

export default Step1Calculator;
