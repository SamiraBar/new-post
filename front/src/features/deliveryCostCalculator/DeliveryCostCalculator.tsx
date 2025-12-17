import { type FormEvent, type JSX, useCallback, useEffect, useMemo, useState, } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { Label } from '@/components/ui/label.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import type { Order } from '@/types';
import { WarningNotices } from './WarningNotices';
import { StepIndicator } from '@/features/deliveryCostCalculator/StepIndicator.tsx';
import Step1Calculator from '@/features/deliveryCostCalculator/Step1Calculator.tsx';
import Step2SenderOfficeSelection from './Step2OfficeSelection';
import Step3RecipientOfficeSelection from '@/features/deliveryCostCalculator/Step3RecipientOfficeSelection.tsx';
import Step4SenderRecipientForm from '@/features/deliveryCostCalculator/Step4SenderRecipientForm.tsx';
import Step5Review from '@/features/deliveryCostCalculator/Step5Review.tsx';
import { useDeliveryStore } from '@/stores/deliveryStore/deliveryStore.ts';
import DeliveryModal from '@/features/deliveryCostCalculator/components/modal/DeliveryModal.tsx';
import { useTranslation } from 'react-i18next';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore.ts';
import ParcelSuccessModal from './components/modal/ParcelSuccessModal';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type OrderFormData, orderSchema } from '@/lib/order.schema.ts';

const DeliveryCostCalculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTrackingNumber, setCreatedTrackingNumber] = useState('');
  const {t} = useTranslation();

  const {
    openOrCloseCalcModal,
    isDoorDelivery,
    isPickup,
    selectPickup,
    selectDoorDelivery,
    clearActions,
    fetchDeliveryCost,
  } = useDeliveryStore();

  const {
    createParcel,
    createParcelLoading,
    createParcelError
  } = useParcelsStore();

  const schema = useMemo(
    () => orderSchema(t),
    [t]
  );

  const form = useForm<OrderFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      originCity: '',
      destinationCity: '',
      originOffice: 0,
      destinationOffice: 0,
      parcelValue: '',
      parcelWeight: '',
      deliveryCost: 0,
      insuranceCost: 0,
      totalCost: 0,
      deliveryDate: '',
      inParcel: '',
      sender: {
        name: '',
        email: '',
        phone: '',
        inn_passport: ''
      },
      receiver: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      deliveryType: 'pickup',
      partnerType: 'E-Kit',
    },
  });

  const {
    setValue,
    getValues,
    reset,
    watch,
    formState: {errors},
  } = form;

  const destinationCity = watch('destinationCity');
  const pvzData = watch('pvzData');
  const parcelWeight = Number(watch('parcelWeight') || 0);
  const parcelValue = Number(watch('parcelValue') || 0);

  useEffect(() => {
    setValue('deliveryType', isPickup ? 'pickup' : 'courier');
    setValue('partnerType', isPickup ? 'E-Kit' : 'KCE');
  }, [isPickup, setValue]);


  const calculateInsuranceCost = useCallback((parcelValue: number) => {
    if (parcelValue <= 0) return 0;
    if (parcelValue <= 10000) return parcelValue * 0.01;
    if (parcelValue <= 50000) return parcelValue * 0.015;
    return parcelValue * 0.02;
  }, []);

  useEffect(() => {
    const calculatePrices = async () => {

      if (!destinationCity || parcelWeight <= 0) {
        return;
      }
      const cityForCalculation = pvzData?.town || destinationCity;

      const delivery = await fetchDeliveryCost(cityForCalculation, parcelWeight);
      const insurance = calculateInsuranceCost(parcelValue);

      setValue('deliveryCost', delivery, { shouldDirty: false });
      setValue('insuranceCost', insurance, { shouldDirty: false });
      setValue('totalCost', delivery + insurance, { shouldDirty: false });
    };

    void calculatePrices();
  }, [
    destinationCity,
    parcelWeight,
    parcelValue,
    pvzData,
    fetchDeliveryCost,
    calculateInsuranceCost,
    setValue,
  ]);

  const {
    sender,
    receiver
  } = getValues();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAgreed) {
      toast.error(t('deliveryCostCalculator.validateError.agreement'));
      return;
    }

    if (
      !sender.name ||
      !sender.email ||
      !sender.phone ||
      !sender.inn_passport
    ) {
      toast.error(t('deliveryCostCalculator.validateError.senderData'));
      return;
    }

    if (!receiver.name || !receiver.email || !receiver.phone) {
      toast.error(t('deliveryCostCalculator.validateError.receiverData'));
      return;
    }

    if (isDoorDelivery && !receiver.address) {
      toast.error(t('deliveryCostCalculator.validateError.receiverAddress'));
      return;
    }

    const values = form.getValues();

    const orderPayload: Order = {
      ...values,
      parcelValue: Number(values.parcelValue),
      parcelWeight: Number(values.parcelWeight),
      deliveryCost: Number(values.deliveryCost),
      insuranceCost: Number(values.insuranceCost),
      totalCost: Number(values.totalCost),
    };

    const trackingNumber = await createParcel(orderPayload);

    if (trackingNumber) {
      setCreatedTrackingNumber(trackingNumber);
      setShowSuccessModal(true);
      reset();
      setCurrentStep(1);
      setIsAgreed(false);
      clearActions();
    } else {
      toast.error(
        createParcelError?.error ||
        t('deliveryCostCalculator.error.failedToCreate') ||
        'Не удалось создать посылку',
      );
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setCreatedTrackingNumber('');
  };

  const fields = useWatch({control: form.control});

  const isNextDisabled = () => {

    if (currentStep === 2) {
      return !fields.originOffice;
    }

    if (currentStep === 3) {
      if (isDoorDelivery) {
        return !(
          fields.receiver?.city &&
          fields.destinationCity &&
          fields.receiver?.street &&
          fields.receiver?.house
        );
      }
      return !fields.destinationOffice;
    }

    if (currentStep === 4) {
      const baseValid =
        fields.sender?.name &&
        fields.sender?.email &&
        fields.sender?.phone &&
        fields.sender?.inn_passport &&
        fields.receiver?.name &&
        fields.receiver?.email &&
        fields.receiver?.phone &&
        fields.inParcel &&
        Object.keys(errors).length === 0 &&
        isAgreed

      const doorExtraValid = !isDoorDelivery || fields.receiver?.address

      return !(baseValid && doorExtraValid)
    }
    return false;
  };


  const handleNext = async () => {
    if (currentStep === 1) {
      if (!isDoorDelivery && !isPickup) openOrCloseCalcModal();
      else setCurrentStep(2);
    } else if (currentStep === 2) {
      const valid = await form.trigger(['originOffice']);
      if (!valid) {
        return toast.error(form.formState.errors.originOffice?.message);
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (isDoorDelivery) {
        const valid = await form.trigger(['receiver.city', 'destinationCity', 'receiver.street', 'receiver.house']);
        if (!valid) {
          return;
        }
      } else {
        const valid = await form.trigger(['destinationOffice']);
        if (!valid) {
          return toast.error(form.formState.errors.destinationOffice?.message);
        }
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 2) clearActions();
      setCurrentStep(currentStep - 1);
    }
  };

  let steps: JSX.Element | null = null;
  switch (currentStep) {
    case 1:
      steps = (
        <Step1Calculator
          form={form}
          handleNext={handleNext}
        />
      );
      break;
    case 2:
      steps = (
        <Step2SenderOfficeSelection
          form={form}
        />
      );
      break;
    case 3:
      steps = (
        <Step3RecipientOfficeSelection
          form={form}
        />
      );
      break;
    case 4:
      steps = (
        <Step4SenderRecipientForm
          form={form}
          doorDelivery={isDoorDelivery}
        />
      );
      break;
    case 5:
      steps = <Step5Review doorDelivery={isDoorDelivery} form={form}/>;
      break;
  }

  return (
    <div className="container" id="calculator">
      <Toaster/>
      <DeliveryModal/>

      <ParcelSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        trackingNumber={createdTrackingNumber}
      />

      <h3 className="text-xl font-medium text-center mb-4">{t('deliveryCostCalculator.title')}</h3>

      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        <p className="text-lg font-medium text-gray-700">{t('delivery.chooseType')}</p>

        <Button
          onClick={selectPickup}
          className={`
            px-6 py-2 rounded-xl border-2 transition-all duration-200 shadow-md
            active:scale-95 active:shadow-lg
            ${isPickup ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-500 border-gray-300'}
            hover:bg-white hover:text-orange-500
          `}
          disabled={currentStep > 1}
        >
          {t('delivery.pickup')}
        </Button>

        <Button
          onClick={selectDoorDelivery}
          className={`
            px-6 py-2 rounded-xl border-2 transition-all duration-200 shadow-md
            active:scale-95 active:shadow-lg
            ${isDoorDelivery ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-500 border-gray-300'}
            hover:bg-white hover:text-orange-500
          `}
          disabled={currentStep > 1}
        >
          {t('delivery.courier')}
        </Button>
      </div>

      <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg">
        <StepIndicator currentStep={currentStep} doorDelivery={isDoorDelivery}/>
        <div>
          {steps}

          {currentStep > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-5">
              <Button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 w-full sm:w-auto justify-center bg-gray-500 hover:bg-gray-600 text-white px-6 py-3"
              >
                <ArrowLeft size={20}/>
                <span>{t('deliveryCostCalculator.buttons.back')}</span>
              </Button>

              {currentStep === 4 && (
                <div
                  className="flex items-start sm:items-center gap-2 w-full sm:w-auto text-center sm:text-left -order-1 sm:order-0">
                  <Checkbox checked={isAgreed} onCheckedChange={() => setIsAgreed(!isAgreed)}/>
                  <Label className="text-sm text-gray-600 leading-tight">
                    {t('deliveryCostCalculator.buttons.agreement')}
                  </Label>
                </div>
              )}

              {currentStep === 5 ? (
                <Button
                  type="button"
                  disabled={createParcelLoading}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                >
                  <span>{t('deliveryCostCalculator.buttons.design')}</span>
                  <ArrowRight size={20}/>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <span>{t('deliveryCostCalculator.buttons.forward')}</span>
                  <ArrowRight size={20}/>
                </Button>
              )}
            </div>
          )}

          {currentStep === 1 && <WarningNotices/>}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCostCalculator;