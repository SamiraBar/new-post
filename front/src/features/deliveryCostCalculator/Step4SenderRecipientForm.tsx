import { FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import type { Order } from '@/types';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateEmail, validateInnPassport, validatePhone } from '@/lib/validation';
import { CheckCircle, XCircle } from 'lucide-react';
import PhoneInput from '@/features/deliveryCostCalculator/components/phoneInput.tsx';

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
  doorDelivery,
}) => {
  const { t } = useTranslation();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string, type?: 'sender' | 'receiver') => {
    const errors = { ...fieldErrors };

    if (name === 'name') {
      if (!value || value.trim().length < 2) {
        errors[`${type}.name`] = 'Имя должно быть минимум 2 символа';
      } else {
        delete errors[`${type}.name`];
      }
    }

    if (name === 'email') {
      if (!validateEmail(value)) {
        errors[`${type}.email`] = 'Некорректный email';
      } else {
        delete errors[`${type}.email`];
      }
    }

    if (name === 'phone') {
      if (!validatePhone(value)) {
        errors[`${type}.phone`] = 'Некорректный номер телефона';
      } else {
        delete errors[`${type}.phone`];
      }
    }

    if (name === 'inn_passport') {
      if (!validateInnPassport(value)) {
        errors[`${type}.inn_passport`] = 'Некорректный ИНН отправителя';
      } else {
        delete errors[`${type}.inn_passport`];
      }
    }

    if (name === 'inParcel') {
      if (!value || value.trim().length < 3) {
        errors.inParcel = 'Опишите содержимое посылки';
      } else {
        delete errors.inParcel;
      }
    }

    if (name === 'address' && doorDelivery) {
      if (!value || value.trim().length < 5) {
        errors.address = 'Укажите полный адрес';
      } else {
        delete errors.address;
      }
    }

    setFieldErrors(errors);
  };

  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type?: 'sender' | 'receiver',
  ) => {
    const { name, value } = e.target;

    if (type) {
      handleChange(e, type);
    } else {
      onHandleChange(e);
    }

    validateField(name, value, type);
  };

  const handlePhoneChange = (phone: string, type: 'sender' | 'receiver') => {
    handleChange(
      {
        target: { name: 'phone', value: phone },
      } as ChangeEvent<HTMLInputElement>,
      type,
    );
    validateField('phone', phone, type);
  };

  const isSenderNameValid = order.sender.name?.trim().length >= 2;
  const isSenderEmailValid = validateEmail(order.sender.email);
  const isSenderPhoneValid = validatePhone(order.sender.phone);
  const isSenderInnPassportValid = validateInnPassport(order.sender.inn_passport);
  const isReceiverNameValid = order.receiver.name?.trim().length >= 2;
  const isReceiverEmailValid = validateEmail(order.receiver.email);
  const isReceiverPhoneValid = validatePhone(order.receiver.phone);
  const isInParcelValid = order.inParcel?.trim().length >= 3;
  const isAddressValid =
    !doorDelivery || (doorDelivery && (order.receiver.address || '').trim().length >= 5);

  return (
    <div className="w-full pt-5">
      <h3 className="text-2xl font-bold text-center mb-8">
        {t('deliveryCostCalculator.stepForForm.title')}
      </h3>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <CheckCircle size={20} />
          <span className="font-medium">Проверьте правильность данных</span>
        </div>
        <p className="text-blue-600 text-sm mt-1">
          Все поля обязательны для заполнения. Проверьте корректность email и номеров телефонов.
        </p>
      </div>

      <FieldGroup>
        <FieldSet>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FieldGroup className="gap-4">
              <div className="flex items-center justify-between">
                <FieldLabel className="text-lg font-semibold">
                  {t('deliveryCostCalculator.stepForForm.inputOneTitle')}
                </FieldLabel>
                <div className="flex items-center gap-1">
                  {isSenderNameValid &&
                  isSenderEmailValid &&
                  isSenderPhoneValid &&
                  isSenderInnPassportValid ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-gray-300" size={20} />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">ФИО</FieldLabel>
                  {isSenderNameValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16} />
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16} />
                  )}
                </div>
                <Input
                  placeholder={t('deliveryCostCalculator.stepForForm.inputName')}
                  className={`bg-gray-50 ${!isSenderNameValid && order.sender.name && 'border-red-300'}`}
                  name="name"
                  onChange={(e) => handleFieldChange(e, 'sender')}
                  value={order.sender.name}
                />
                {fieldErrors['sender.name'] && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors['sender.name']}</p>
                )}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Телефон</FieldLabel>
                  {isSenderPhoneValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16} />
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16} />
                  )}
                </div>
                <PhoneInput
                  value={order.sender.phone}
                  onChange={(phone) => handlePhoneChange(phone, 'sender')}
                  error={fieldErrors['sender.phone']}
                  placeholder="+996 XXX XXX XXX"
                />
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Email</FieldLabel>
                  {isSenderEmailValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16} />
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16} />
                  )}
                </div>
                <Input
                  placeholder="Email"
                  type="email"
                  className={`bg-gray-50 ${!isSenderEmailValid && order.sender.email && 'border-red-300'}`}
                  name="email"
                  onChange={(e) => handleFieldChange(e, 'sender')}
                  value={order.sender.email}
                />
                {fieldErrors['sender.email'] && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors['sender.email']}</p>
                )}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">ИНН/Паспорт</FieldLabel>
                  {isSenderInnPassportValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16} />
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16} />
                  )}
                </div>
                <Input
                  placeholder="ИНН/Паспорт"
                  type="string"
                  className={`bg-gray-50 ${!isSenderInnPassportValid && order.sender.inn_passport && 'border-red-300'}`}
                  name="inn_passport"
                  onChange={(e) => handleFieldChange(e, 'sender')}
                  value={order.sender.inn_passport}
                />
                {fieldErrors['sender.inn_passport'] && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors['sender.inn_passport']}</p>
                )}
              </div>
            </FieldGroup>

            <FieldGroup className="gap-4">
              <div className="flex items-center justify-between">
                <FieldLabel className="text-lg font-semibold">
                  {t('deliveryCostCalculator.stepForForm.inputTwoTitle')}
                </FieldLabel>
                <div className="flex items-center gap-1">
                  {isReceiverNameValid &&
                  isReceiverEmailValid &&
                  isReceiverPhoneValid &&
                  (!doorDelivery || isAddressValid) ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-gray-300" size={20} />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">ФИО</FieldLabel>
                  {isReceiverNameValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16} />
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16} />
                  )}
                </div>
                <Input
                  placeholder={t('deliveryCostCalculator.stepForForm.inputName')}
                  className={`bg-gray-50 ${!isReceiverNameValid && order.receiver.name && 'border-red-300'}`}
                  name="name"
                  onChange={(e) => handleFieldChange(e, 'receiver')}
                  value={order.receiver.name}
                />
                {fieldErrors['receiver.name'] && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors['receiver.name']}</p>
                )}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Телефон</FieldLabel>
                  {isReceiverPhoneValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16} />
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16} />
                  )}
                </div>
                <PhoneInput
                  value={order.receiver.phone}
                  onChange={(phone) => handlePhoneChange(phone, 'receiver')}
                  error={fieldErrors['receiver.phone']}
                  placeholder="+996 XXX XXX XXX"
                />
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Email</FieldLabel>
                  {isReceiverEmailValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16} />
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16} />
                  )}
                </div>
                <Input
                  placeholder="Email"
                  type="email"
                  className={`bg-gray-50 ${!isReceiverEmailValid && order.receiver.email && 'border-red-300'}`}
                  name="email"
                  onChange={(e) => handleFieldChange(e, 'receiver')}
                  value={order.receiver.email}
                />
                {fieldErrors['receiver.email'] && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors['receiver.email']}</p>
                )}
              </div>
            </FieldGroup>
          </div>

          {doorDelivery ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Адрес доставки</FieldLabel>
                  {isAddressValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16} />
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16} />
                  )}
                </div>
                <Textarea
                  placeholder={t('deliveryCostCalculator.stepForForm.inputTwoText')}
                  className={`bg-gray-50 ${!isAddressValid && order.receiver.address && 'border-red-300'}`}
                  name="address"
                  onChange={(e) => handleFieldChange(e, 'receiver')}
                  value={order.receiver.address}
                  rows={3}
                />
                {fieldErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>
                )}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Содержимое посылки</FieldLabel>
                  {isInParcelValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16} />
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16} />
                  )}
                </div>
                <Textarea
                  className={`w-full bg-gray-50 ${!isInParcelValid && order.inParcel && 'border-red-300'}`}
                  placeholder={t('deliveryCostCalculator.stepForForm.inputOneParcelContent')}
                  name="inParcel"
                  onChange={handleFieldChange}
                  value={order.inParcel}
                  rows={3}
                />
                {fieldErrors.inParcel && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.inParcel}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Опишите что находится в посылке (минимум 3 символа)
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center mb-1">
                <FieldLabel className="text-lg font-semibold">Содержимое посылки</FieldLabel>
                {isInParcelValid ? (
                  <CheckCircle className="ml-2 text-green-500" size={20} />
                ) : (
                  <XCircle className="ml-2 text-gray-300" size={20} />
                )}
              </div>
              <Textarea
                className={`w-full bg-gray-50 ${!isInParcelValid && order.inParcel && 'border-red-300'}`}
                placeholder={t('deliveryCostCalculator.stepForForm.inputOneParcelContent')}
                name="inParcel"
                onChange={handleFieldChange}
                value={order.inParcel}
                rows={3}
              />
              {fieldErrors.inParcel && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.inParcel}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Опишите что находится в посылке (минимум 3 символа)
              </p>
            </div>
          )}
        </FieldSet>
      </FieldGroup>
    </div>
  );
};

export default Step4SenderRecipientForm;
