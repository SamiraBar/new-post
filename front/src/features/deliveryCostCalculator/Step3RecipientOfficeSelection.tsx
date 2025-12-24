import { type Dispatch, type FC, type SetStateAction } from 'react';
import { MapPin } from 'lucide-react';
import type { Order, PvzData } from '@/types';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input.tsx';
import MeasoftMap from '@/features/deliveryCostCalculator/components/measoftMap.tsx';

interface Props {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  handleNext: () => void;
}

const normalizeCityName = (cityName: string): string => {
  if (!cityName) return '';

  return cityName
      .trim()
      .replace(/\s+(город|г\.?|city)$/i, '')
      .trim();
};

const Step3RecipientOfficeSelection: FC<Props> = ({ order, setOrder }) => {
  const { t } = useTranslation();

  const handlePvzSelect = (pvzData: PvzData) => {
    const normalizedCity = normalizeCityName(pvzData.town || '');

    setOrder((prev) => ({
      ...prev,
      pvzData: {
        ...pvzData,
        town: normalizedCity,
      },
      destinationOffice: parseInt(pvzData.code) || 0,
      destinationCity: normalizedCity || prev.destinationCity,
      receiver: {
        ...prev.receiver,
        city: normalizedCity || prev.receiver.city,
        address: pvzData.address || prev.receiver.address,
      },
    }));
  };

  if (!order.deliveryType) return null;

  return (
      <div className="w-full pt-5">
        {order.deliveryType === 'courier' ? (
            <>
              <h3 className="text-2xl font-bold text-center mb-8">
                {t('deliveryCostCalculator.courierFields.title')}
              </h3>

              <div className="flex flex-col gap-4 px-5 max-w-xl mx-auto">
                <Input
                    type="text"
                    placeholder={t('deliveryCostCalculator.courierFields.cityPlaceholder')}
                    value={order.receiver.city || order.destinationCity || ''}
                    onChange={(e) =>
                        setOrder((prev) => ({
                          ...prev,
                          receiver: { ...prev.receiver, city: e.target.value },
                        }))
                    }
                    className="h-11 md:h-10"
                />

                <Input
                    type="text"
                    placeholder={t('deliveryCostCalculator.courierFields.streetPlaceholder')}
                    value={order.receiver.street || ''}
                    onChange={(e) =>
                        setOrder((prev) => ({
                          ...prev,
                          receiver: { ...prev.receiver, street: e.target.value },
                        }))
                    }
                    className="h-11 md:h-10"
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                      type="text"
                      placeholder={t('deliveryCostCalculator.courierFields.housePlaceholder')}
                      value={order.receiver.house || ''}
                      onChange={(e) =>
                          setOrder((prev) => ({
                            ...prev,
                            receiver: { ...prev.receiver, house: e.target.value },
                          }))
                      }
                      className="h-11 md:h-10 sm:flex-1"
                  />

                  <Input
                      type="text"
                      placeholder={t('deliveryCostCalculator.courierFields.apartmentPlaceholder')}
                      value={order.receiver.apartment || ''}
                      onChange={(e) =>
                          setOrder((prev) => ({
                            ...prev,
                            receiver: { ...prev.receiver, apartment: e.target.value },
                          }))
                      }
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
                  <MapPin size={20} />
                  <span className="font-medium">{t('measoftMap.selectPvz')}</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  {t('measoftMap.selectPvzDescription')}
                </p>
              </div>

              <MeasoftMap
                  order={order}
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
