import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';
import { type ChangeEvent, type Dispatch, type FC, type SetStateAction, useState } from 'react';
import { MapPin, SearchIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import { Label } from '@/components/ui/label.tsx';
import { offices } from '@/constants.ts';
import type { Order } from '@/types';
import { useTranslation } from 'react-i18next';

interface Props {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  handleNext: () => void;
}

const Step3RecipientOfficeSelection: FC<Props> = ({ order, setOrder }) => {
  const [destinationOfficeSearch, setDestinationOfficeSearch] = useState('');
  const { t } = useTranslation();

  const filteredDestinationOffices = offices.filter((c) =>
    c.name.toLowerCase().includes(destinationOfficeSearch.toLowerCase()),
  );

  if (!order.deliveryType) return null;

  return (
    <div className="w-full pt-5">
      {order.deliveryType === 'courier' ? (
        <>
          <h3 className="text-2xl font-bold text-center mb-8">
            {t('deliveryCostCalculator.courierFields.title')}
          </h3>

          <div className="flex flex-col gap-4 px-5">
            <input
              type="text"
              placeholder={t('deliveryCostCalculator.courierFields.cityPlaceholder')}
              value={order.receiver.city || order.destinationCity || ''}
              onChange={(e) =>
                setOrder((prev) => ({
                  ...prev,
                  receiver: { ...prev.receiver, city: e.target.value },
                }))
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              placeholder={t('deliveryCostCalculator.courierFields.streetPlaceholder')}
              value={order.receiver.street || ''}
              onChange={(e) =>
                setOrder((prev) => ({
                  ...prev,
                  receiver: { ...prev.receiver, street: e.target.value },
                }))
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              placeholder={t('deliveryCostCalculator.courierFields.housePlaceholder')}
              value={order.receiver.house || ''}
              onChange={(e) =>
                setOrder((prev) => ({
                  ...prev,
                  receiver: { ...prev.receiver, house: e.target.value },
                }))
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              placeholder={t('deliveryCostCalculator.courierFields.apartmentPlaceholder')}
              value={order.receiver.apartment || ''}
              onChange={(e) =>
                setOrder((prev) => ({
                  ...prev,
                  receiver: { ...prev.receiver, apartment: e.target.value },
                }))
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-center mb-8">
            {t('deliveryCostCalculator.stepThreeForm.title')}
          </h3>

          <InputGroup className="bg-white">
            <InputGroupInput
              placeholder={t('deliveryCostCalculator.stepThreeForm.placeholder')}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDestinationOfficeSearch(e.target.value)
              }
              value={destinationOfficeSearch}
            />
            <InputGroupAddon align="inline-end">
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <ScrollArea className="mt-4 h-[35vh] pr-5">
            {filteredDestinationOffices.length > 0 ? (
              <RadioGroup
                value={order.destinationOffice?.toString()}
                onValueChange={(value: string) =>
                  setOrder((prev) => ({ ...prev, destinationOffice: Number(value) }))
                }
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
                        <MapPin className="size-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-800">{office.name}</span>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <MapPin className="size-12 mx-auto mb-2 opacity-30" />
                <p>{t('deliveryCostCalculator.stepThreeForm.notFound')}</p>
              </div>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default Step3RecipientOfficeSelection;
