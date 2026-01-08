import { type FormEvent, type JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [agreementError, setAgreementError] = useState(false);
  const agreementRef = useRef<HTMLDivElement | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTrackingNumber, setCreatedTrackingNumber] = useState('');
  const { t } = useTranslation();

  const {
    openOrCloseCalcModal,
    isDoorDelivery,
    isPickup,
    selectPickup,
    selectDoorDelivery,
    clearActions,
    fetchDeliveryCost,
  } = useDeliveryStore();

  const { createParcel, createParcelLoading, createParcelError } = useParcelsStore();

  const schema = useMemo(
    () => orderSchema(t),
    [t]
  );

  const form = useForm<OrderFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      originCity: '',
      destinationCity: '',
      serviceCode: undefined,
      serviceCity: undefined,
      originOffice: '',
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
        inn_passport: '',
      },
      receiver: {
        name: '',
        email: '',
        phone: '',
        address: '',
      },
      deliveryType: 'pickup',
      partnerType: 'E-Kit',
    },
  });

  const {
    setValue,
    reset,
    formState: { errors },
  } = form;

  const [destinationCity, pvzData, parcelWeight, parcelValue] = useWatch({
    control: form.control,
    name: ['destinationCity', 'pvzData', 'parcelWeight', 'parcelValue'],
  });

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
      if (!destinationCity || Number(parcelWeight) <= 0) {
        return;
      }
      const cityForCalculation = pvzData?.town || destinationCity;

      const delivery = await fetchDeliveryCost(cityForCalculation, Number(parcelWeight));
      const insurance = calculateInsuranceCost(Number(parcelValue));

      setValue('deliveryCost', delivery.totalCost, { shouldDirty: false });
      setValue('insuranceCost', insurance, { shouldDirty: false });
      setValue('totalCost', delivery.totalCost + insurance, { shouldDirty: false });
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
    isPickup,
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const values = form.getValues();

    const orderPayload: Order = {
      ...values,
      parcelValue: Number(values.parcelValue),
      parcelWeight: Number(values.parcelWeight),
      deliveryCost: Number(values.deliveryCost),
      insuranceCost: Number(values.insuranceCost),
      totalCost: Number(values.totalCost),
      parcelDescription: values.inParcel || '',
    };

    const trackingNumber = await createParcel(orderPayload);

    if (trackingNumber) {
      setCreatedTrackingNumber(trackingNumber);
      setShowSuccessModal(true);
      reset();
      setCurrentStep(1);
      setIsAgreed(false);
      setAgreementError(false);
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

  const step2 = useWatch({
    control: form.control,
    name: 'originOffice',
    disabled: currentStep !== 2,
  });

  const step3Door = useWatch({
    control: form.control,
    name: ['receiver.city', 'destinationCity', 'receiver.street', 'receiver.house'],
    disabled: currentStep !== 3 || !isDoorDelivery,
  });

  const step3Office = useWatch({
    control: form.control,
    name: 'destinationOffice',
    disabled: currentStep !== 3 || isDoorDelivery,
  });

  const step4 = useWatch({
    control: form.control,
    name: [
      'sender.name',
      'sender.email',
      'sender.phone',
      'sender.inn_passport',
      'receiver.name',
      'receiver.email',
      'receiver.phone',
      'receiver.address',
      'inParcel',
    ],
    disabled: currentStep !== 4,
  });

  const isNextDisabled = useMemo(() => {
    switch (currentStep) {
      case 2:
        return !step2 || !!errors.originOffice;
      case 3:
        if (isDoorDelivery) {
          const [city, dest, street, house] = step3Door;
          return !city || !dest || !street || !house;
        }
        return !step3Office || !!errors.destinationOffice;

      case 4: {
        const [sName, sEmail, sPhone, sInn, rName, rEmail, rPhone, rAddr, inParcel] = step4;

        if (
          !sName ||
          !sEmail ||
          !sPhone ||
          !sInn ||
          !rName ||
          !rEmail ||
          !rPhone ||
          !inParcel ||
          !isAgreed
        ) {
          return true;
        }

        if (isDoorDelivery && !rAddr) return true;

        return !!(errors.sender || errors.receiver || errors.inParcel);
      }

      default:
        return false;
    }
  }, [currentStep, step2, step3Door, step3Office, step4, isDoorDelivery, errors, isAgreed]);


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
        const valid = await form.trigger([
          'receiver.city',
          'destinationCity',
          'receiver.street',
          'receiver.house',
        ]);
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
      if (!isAgreed) {
        setAgreementError(true);
        toast.error(t('deliveryCostCalculator.validateError.agreement'));
        agreementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      setAgreementError(false);
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
      steps = <Step1Calculator form={form} handleNext={handleNext} />;
      break;
    case 2:
      steps = <Step2SenderOfficeSelection form={form} />;
      break;
    case 3:
      steps = <Step3RecipientOfficeSelection form={form} />;
      break;
    case 4:
      steps = <Step4SenderRecipientForm form={form} doorDelivery={isDoorDelivery} />;
      break;
    case 5:
      steps = <Step5Review doorDelivery={isDoorDelivery} form={form} />;
      break;
  }

  return (
    <div className="container" id="calculator">
      <Toaster />
      <DeliveryModal />

      <ParcelSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        trackingNumber={createdTrackingNumber}
      />

      <h3 className="text-xl font-medium text-center mb-4">{t('deliveryCostCalculator.title')}</h3>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <p className="text-lg font-medium text-gray-700 text-center">{t('delivery.chooseType')}</p>
        <div className="flex gap-4 flex-nowrap">
          <Button
            onClick={selectPickup}
            className={`
        px-6 py-2 rounded-xl border-2 transition-all duration-200 shadow-md
        active:scale-95 active:shadow-lg
        ${
          isPickup
            ? 'bg-orange-500 text-white border-orange-500'
            : 'bg-white text-orange-500 border-gray-300'
        }
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
        ${
          isDoorDelivery
            ? 'bg-orange-500 text-white border-orange-500'
            : 'bg-white text-orange-500 border-gray-300'
        }
        hover:bg-white hover:text-orange-500
      `}
            disabled={currentStep > 1}
          >
            {t('delivery.courier')}
          </Button>
        </div>
      </div>

      <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg">
        <StepIndicator currentStep={currentStep} doorDelivery={isDoorDelivery} />

        <div>
          {steps}

          {currentStep > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-5">
              <Button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 w-full sm:w-auto justify-center bg-gray-500 hover:bg-gray-600 text-white px-6 py-3"
              >
                <ArrowLeft size={20} />
                <span>{t('deliveryCostCalculator.buttons.back')}</span>
              </Button>

              {currentStep === 4 && (
                <div
                  ref={agreementRef}
                  className={[
                    'w-full sm:min-w-[420px] -order-1 sm:order-0',
                    'rounded-2xl border-2 p-4 shadow-sm',
                    'flex items-center gap-4',
                    agreementError && !isAgreed
                      ? 'border-red-500 bg-red-50'
                      : 'border-orange-300 bg-orange-50',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={isAgreed}
                      className={[
                        'size-6 rounded-md border-2 shadow-sm',
                        agreementError && !isAgreed
                          ? 'border-red-500 ring-4 ring-red-200'
                          : 'border-orange-500',
                        isAgreed
                          ? 'data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500'
                          : '',
                      ].join(' ')}
                      onCheckedChange={(checked) => {
                        setIsAgreed(checked === true);
                        setAgreementError(false);
                      }}
                    />
                  </div>

                  <div className="text-left">
                    <Label
                      className={[
                        'block text-sm leading-snug mt-1',
                        agreementError && !isAgreed ? 'text-red-700' : 'text-gray-700',
                      ].join(' ')}
                    >
                      {t('deliveryCostCalculator.buttons.agreement')}
                    </Label>

                    <p className="text-xs text-gray-600 mt-1">
                      {t('deliveryCostCalculator.buttons.agreementHint')}
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 5 ? (
                <Button
                  type="button"
                  disabled={createParcelLoading}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                >
                  <span>{t('deliveryCostCalculator.buttons.pay')}</span>
                  <ArrowRight size={20} />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <span>{t('deliveryCostCalculator.buttons.forward')}</span>
                  <ArrowRight size={20} />
                </Button>
              )}
            </div>
          )}

          {currentStep === 1 && <WarningNotices />}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCostCalculator;
