import { FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import PhoneInput from '@/features/deliveryCostCalculator/components/phoneInput.tsx';
import { type UseFormReturn, useWatch } from 'react-hook-form';
import type { OrderFormData } from '@/lib/order.schema.ts';

interface Props {
  form: UseFormReturn<OrderFormData>;
  doorDelivery: boolean;
}

const Step4SenderRecipientForm: FC<Props> = ({doorDelivery, form}) => {
  const {t} = useTranslation();
  const {
    register,
    setValue,
    trigger,
    formState: {errors}
  } = form;
  const [sender, receiver, inParcel] = useWatch({
    control: form.control,
    name: ['sender', 'receiver', 'inParcel']
  });

  const isSenderNameValid = !errors.sender?.name && sender?.name && sender.name
  const isSenderEmailValid = !errors.sender?.email && sender?.email && sender.email
  const isSenderPhoneValid = !errors.sender?.phone && sender?.phone && sender.phone
  const isSenderInnPassportValid = !errors.sender?.inn_passport && sender?.inn_passport && sender.inn_passport

  const isReceiverNameValid = !errors.receiver?.name && receiver?.name && receiver.name
  const isReceiverEmailValid = !errors.receiver?.email && receiver?.email && receiver.email
  const isReceiverPhoneValid = !errors.receiver?.phone && receiver?.phone && receiver.phone

  const isInParcelValid = !errors.inParcel && inParcel && inParcel
  const isAddressValid = !doorDelivery || (!errors.receiver?.address && receiver?.address);

  return (
    <div className="w-full pt-5">
      <h3 className="text-2xl font-bold text-center mb-8">
        {t('deliveryCostCalculator.stepForForm.title')}
      </h3>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <CheckCircle size={20}/>
          <span className="font-medium"> {t('deliveryCostCalculator.stepForForm.span')}</span>
        </div>
        <p className="text-blue-600 text-sm mt-1">
          {t('deliveryCostCalculator.stepForForm.warning')}
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
                    <CheckCircle className="text-green-500" size={20}/>
                  ) : (
                    <XCircle className="text-gray-300" size={20}/>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">
                    {t('deliveryCostCalculator.stepForForm.inputName')}
                  </FieldLabel>
                  {isSenderNameValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16}/>
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16}/>
                  )}
                </div>
                <Input
                  placeholder={t('deliveryCostCalculator.stepForForm.inputName')}
                  className={`bg-gray-50 ${!isSenderNameValid && sender.name && 'border-red-300'}`}
                  {...register('sender.name')}
                />
                {errors.sender?.name && (
                  <div
                    className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0"/>
                    <p>{errors.sender.name.message}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Телефон</FieldLabel>
                  {isSenderPhoneValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16}/>
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16}/>
                  )}
                </div>
                <PhoneInput
                  value={sender.phone}
                  onChange={async (phone) => {
                    setValue('sender.phone', phone);
                    await trigger('sender.phone');
                  }}
                  error={errors.sender?.phone?.message}
                  defaultCountry="KG"
                />
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Email</FieldLabel>
                  {isSenderEmailValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16}/>
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16}/>
                  )}
                </div>
                <Input
                  placeholder="Email"
                  type="email"
                  className={`bg-gray-50 ${errors.sender?.email && sender.email && 'border-red-300'}`}
                  {...register('sender.email')}
                />
                {errors.sender?.email && (
                  <div
                    className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0"/>
                    <p>{errors.sender.email.message}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">ИНН/Паспорт</FieldLabel>
                  {isSenderInnPassportValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16}/>
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16}/>
                  )}
                </div>
                <Input
                  placeholder="ИНН/Паспорт"
                  type="text"
                  className={`bg-gray-50 ${!isSenderInnPassportValid && sender.inn_passport && 'border-red-300'}`}
                  {...register('sender.inn_passport')}
                />
                {errors.sender?.inn_passport && (
                  <div
                    className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0"/>
                    <p>{errors.sender.inn_passport.message}</p>
                  </div>
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
                    <CheckCircle className="text-green-500" size={20}/>
                  ) : (
                    <XCircle className="text-gray-300" size={20}/>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">
                    {t('deliveryCostCalculator.stepForForm.inputName')}
                  </FieldLabel>
                  {isReceiverNameValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16}/>
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16}/>
                  )}
                </div>
                <Input
                  placeholder={t('deliveryCostCalculator.stepForForm.inputName')}
                  className={`bg-gray-50 ${!isReceiverNameValid && receiver.name && 'border-red-300'}`}
                  {...register('receiver.name')}
                />
                {errors.receiver?.name && (
                  <div
                    className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0"/>
                    <p>{errors.receiver.name.message}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Телефон</FieldLabel>
                  {isReceiverPhoneValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16}/>
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16}/>
                  )}
                </div>
                <PhoneInput
                  value={receiver.phone}
                  onChange={async (phone) => {
                    setValue('receiver.phone', phone);
                    await trigger(['receiver.phone']);
                  }}
                  error={errors.receiver?.phone?.message}
                />
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">Email</FieldLabel>
                  {isReceiverEmailValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16}/>
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16}/>
                  )}
                </div>
                <Input
                  placeholder="Email"
                  type="email"
                  className={`bg-gray-50 ${!isReceiverEmailValid && receiver.email && 'border-red-300'}`}
                  {...register('receiver.email')}
                />
                {errors.receiver?.email && (
                  <div
                    className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0"/>
                    <p>{errors.receiver.email.message}</p>
                  </div>
                )}
              </div>
            </FieldGroup>
          </div>

          {doorDelivery ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">
                    {t('deliveryCostCalculator.stepForForm.address')}
                  </FieldLabel>
                  {isAddressValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16}/>
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16}/>
                  )}
                </div>
                <Textarea
                  placeholder={t('deliveryCostCalculator.stepForForm.inputTwoText')}
                  className={`bg-gray-50 ${!isAddressValid && receiver.address && 'border-red-300'}`}
                  {...register('receiver.address')}
                  rows={3}
                />
                {errors.receiver?.address && (
                  <div
                    className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0"/>
                    <p>{errors.receiver.address.message}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FieldLabel className="text-sm">
                    {t('deliveryCostCalculator.stepForForm.inputOneParcelContent')}
                  </FieldLabel>
                  {isInParcelValid ? (
                    <CheckCircle className="ml-2 text-green-500" size={16}/>
                  ) : (
                    <XCircle className="ml-2 text-gray-300" size={16}/>
                  )}
                </div>
                <Textarea
                  className={`w-full bg-gray-50 ${!isInParcelValid && inParcel && 'border-red-300'}`}
                  placeholder={t('deliveryCostCalculator.stepForForm.inputOneParcelContent')}
                  {...register('inParcel')}
                  rows={3}
                />
                {errors.inParcel && (
                  <div
                    className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0"/>
                    <p>{errors.inParcel.message}</p>
                  </div>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  {t('deliveryCostCalculator.stepForForm.inputOneParcelContentText')}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center mb-1">
                <FieldLabel className="text-lg font-semibold">
                  {t('deliveryCostCalculator.stepForForm.inputOneParcelContent')}
                </FieldLabel>
                {isInParcelValid ? (
                  <CheckCircle className="ml-2 text-green-500" size={20}/>
                ) : (
                  <XCircle className="ml-2 text-gray-300" size={20}/>
                )}
              </div>
              <Textarea
                className={`w-full bg-gray-50 ${!isInParcelValid && inParcel && 'border-red-300'}`}
                placeholder={t('deliveryCostCalculator.stepForForm.inputOneParcelContent')}
                {...register('inParcel')}
                rows={3}
              />
              {errors.inParcel && (
                <div
                  className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle size={14} className="shrink-0"/>
                  <p>{errors.inParcel.message}</p>
                </div>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {t('deliveryCostCalculator.stepForForm.inputOneParcelContentText')}
              </p>
            </div>
          )}
        </FieldSet>
      </FieldGroup>
    </div>
  );
};

export default Step4SenderRecipientForm;
