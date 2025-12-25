import { type FC } from 'react';
import { AlertCircle, MapPin } from 'lucide-react';
import type { PvzData } from '@/types';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input.tsx';
import MeasoftMap from '@/features/deliveryCostCalculator/components/measoftMap.tsx';
import type { UseFormReturn } from 'react-hook-form';
import type { OrderFormData } from '@/lib/order.schema.ts';

interface Props {
  form: UseFormReturn<OrderFormData>;
}

const normalizeCityName = (cityName: string): string => {
  if (!cityName) return '';

  return cityName
    .trim()
    .replace(/\s+(город|г\.?|city)$/i, '')
    .trim();
};

const Step3RecipientOfficeSelection: FC<Props> = ({form}) => {
  const {t} = useTranslation();
  const {
    register,
    formState: {errors},
    setValue,
    getValues,
    watch
  } = form;
  const deliveryType = watch('deliveryType');
  const handlePvzSelect = (pvzData: PvzData) => {
    const normalizedCity = normalizeCityName(pvzData.town || '');

    console.log('🗺️ Selected PVZ:', {
      original: pvzData.town,
      normalized: normalizedCity,
      code: pvzData.code,
    });

    setValue('pvzData', {
      ...pvzData,
      town: normalizedCity
    });
    setValue('destinationOffice', parseInt(pvzData.code) || 0);
    setValue('destinationCity', normalizedCity || getValues('destinationCity'));
    setValue('receiver', {
      ...getValues('receiver'),
      city: normalizedCity || getValues('receiver.city'),
      address: pvzData.address || getValues('receiver.address'),
    });
  };

  if (!deliveryType) return null;

  return (
    <div className="w-full pt-5">
      {deliveryType === 'courier' ? (
        <>
          <h3 className="text-2xl font-bold text-center mb-8">
            {t('deliveryCostCalculator.courierFields.title')}
          </h3>

          <div className="flex flex-col gap-4 px-5 max-w-xl mx-auto">
            <div>
              <Input
                type="text"
                placeholder={t('deliveryCostCalculator.courierFields.cityPlaceholder')}
                {...register('receiver.city')}
                className="h-11 md:h-10"
              />
              {errors.receiver?.city && (
                <div
                  className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle size={14} className="shrink-0"/>
                  <p>{errors.receiver.city.message}</p>
                </div>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder={t('deliveryCostCalculator.courierFields.streetPlaceholder')}
                {...register('receiver.street')}
                className="h-11 md:h-10"
              />
              {errors.receiver?.street && (
                <div
                  className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle size={14} className="shrink-0"/>
                  <p>{errors.receiver.street.message}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <Input
                  type="text"
                  placeholder={t('deliveryCostCalculator.courierFields.housePlaceholder')}
                  {...register('receiver.house')}
                  className="h-11 md:h-10 sm:flex-1"
                />
                {errors.receiver?.house && (
                  <div
                    className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0"/>
                    <p>{errors.receiver.house.message}</p>
                  </div>
                )}
              </div>

              <Input
                type="text"
                placeholder={t('deliveryCostCalculator.courierFields.apartmentPlaceholder')}
                {...register('receiver.apartment')}
                className="h-11 md:h-10 sm:flex-1"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-center mb-8">
            {t('deliveryCostCalculator.stepThreeForm.title')}
          </h3>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <MapPin size={20}/>
              <span className="font-medium">{t('measoftMap.selectPvz')}</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              {t('measoftMap.selectPvzDescription')}
            </p>
          </div>

          <MeasoftMap
            form={form}
            onPvzSelect={handlePvzSelect}
            clientId="217"
            clientCode=""
          />
        </>
      )}
    </div>
  );
};

export default Step3RecipientOfficeSelection;
