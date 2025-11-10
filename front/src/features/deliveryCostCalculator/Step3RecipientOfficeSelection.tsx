import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';
import { type ChangeEvent, type Dispatch, type FC, type SetStateAction, useState } from 'react';
import { MapPin, SearchIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import { Label } from '@/components/ui/label.tsx';
import { offices } from '@/constants.ts';
import type { Order } from '@/types';

interface Props {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
}

const Step3RecipientOfficeSelection: FC<Props> = ({ order, setOrder }) => {
  const [destinationOfficeSearch, setDestinationOfficeSearch] = useState('');
  const filteredDestinationOffices = offices.filter((c) =>
    c.name.toLowerCase().includes(destinationOfficeSearch.toLowerCase()),
  );

  return (
    <div className="w-full pt-5">
      <h3 className="text-2xl font-bold text-center mb-8">
        Алуучунун офисин тандоо / Выбрать офис получателя
      </h3>

      <InputGroup className="bg-white">
        <InputGroupInput
          placeholder="Поиск отделения"
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
            <p>Офис не найден</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Step3RecipientOfficeSelection;
