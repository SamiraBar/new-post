import { FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import type { Order } from '@/types';
import type { ChangeEvent, FC } from 'react';

interface Props {
  order: Order;
  onHandleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: 'sender' | 'receiver',
  ) => void;
  doorDelivery: boolean;
}

const Step4SenderRecipientForm: FC<Props> = ({
                                               order,
                                               onHandleChange,
                                               handleChange,
                                               doorDelivery
                                             }) => {
  return (
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
                <Input
                  placeholder="Аты-жөнү / ФИО"
                  className="bg-gray-100"
                  name="name"
                  onChange={(e) => handleChange(e, 'sender')}
                  value={order.sender.name}
                />
                <Input
                  placeholder="Телфон +996"
                  type="number"
                  className="bg-gray-100"
                  name="phone"
                  onChange={(e) => handleChange(e, 'sender')}
                  value={order.sender.phone}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  className="bg-gray-100"
                  name="email"
                  onChange={(e) => handleChange(e, 'sender')}
                  value={order.sender.email}
                />
                {
                  doorDelivery && (
                    <Textarea
                      className="col-span-1 sm:col-span-2 w-full bg-gray-100"
                      placeholder="Посылканын ичиндеги тизмеси / Содержимое посылки"
                      name="inParcel"
                      onChange={onHandleChange}
                      value={order.inParcel}
                    />
                  )
                }
              </FieldGroup>

              <FieldGroup className="gap-3">
                <FieldLabel>Алуучу / Получатель</FieldLabel>
                <Input
                  placeholder="Аты-жөнү / ФИО"
                  className="bg-gray-100"
                  name="name"
                  onChange={(e) => handleChange(e, 'receiver')}
                  value={order.receiver.name}
                />
                <Input
                  placeholder="Телфон +996"
                  type="number"
                  className="bg-gray-100"
                  name="phone"
                  onChange={(e) => handleChange(e, 'receiver')}
                  value={order.receiver.phone}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  className="bg-gray-100"
                  name="email"
                  onChange={(e) => handleChange(e, 'receiver')}
                  value={order.receiver.email}
                />
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

              {
                !doorDelivery && (
                  <Textarea
                  className="col-span-1 sm:col-span-2 w-full bg-gray-100"
                  placeholder="Посылканын ичиндеги тизмеси / Содержимое посылки"
                  name="inParcel"
                  onChange={onHandleChange}
                  value={order.inParcel}
                />)
              }
            </div>
          </FieldSet>
        </FieldGroup>
      </div>
    </div>
  );
};

export default Step4SenderRecipientForm;
