import {
  type ChangeEvent,
  type FormEvent,
  type JSX,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import { validateStep2, validateStep3, validateStep4 } from '@/lib/validation.ts';


const DeliveryCostCalculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);
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

  const [order, setOrder] = useState<Order>({
    originCity: '',
    destinationCity: '',
    originOffice: 0,
    destinationOffice: 0,
    parcelValue: 0,
    parcelWeight: 0,
    deliveryCost: 0,
    insuranceCost: 0,
    totalCost: 0,
    deliveryDate: '',
    inParcel: '',
    sender: { name: '', email: '', phone: '', inn_passport: '' },
    receiver: { name: '', email: '', phone: '', address: '' },
    deliveryType: 'pickup',
    partnerType: 'E-Kit',
  });

  useEffect(() => {
    setOrder((prev) => ({
      ...prev,
      deliveryType: isPickup ? 'pickup' : 'courier',
      partnerType: isPickup ? 'E-Kit' : 'KCE',
    }));
  }, [isPickup, isDoorDelivery]);

  const calculateInsuranceCost = useCallback((parcelValue: number) => {
    if (parcelValue <= 0) return 0;
    if (parcelValue <= 10000) return parcelValue * 0.01;
    if (parcelValue <= 50000) return parcelValue * 0.015;
    return parcelValue * 0.02;
  }, []);

  useEffect(() => {
    const { destinationCity, parcelWeight, parcelValue } = order;

    const calc = async () => {
      let delivery = 0;

      if (destinationCity && parcelWeight > 0 && parcelWeight <= 15) {
        delivery = await fetchDeliveryCost(destinationCity, parcelWeight);
      }

      const insurance = calculateInsuranceCost(parcelValue);

      setOrder((prev) => ({
        ...prev,
        deliveryCost: delivery,
        insuranceCost: insurance,
        totalCost: delivery + insurance,
      }));
    };

    calc();
  }, [
    order.destinationCity,
    order.parcelWeight,
    order.parcelValue,
    fetchDeliveryCost,
    calculateInsuranceCost,
  ]);

  const validateOrder = () => {
    const validations = [
      { field: order.originCity, message: t('deliveryCostCalculator.validateError.cityOfSender') },
      {
        field: order.destinationCity,
        message: t('deliveryCostCalculator.validateError.cityOfReceiver'),
      },
      { field: order.parcelValue, message: t('deliveryCostCalculator.validateError.parcelValue') },
      {
        field: order.parcelWeight,
        message: t('deliveryCostCalculator.validateError.parcelWeight'),
      },
    ];

    for (const { field, message } of validations) {
      if (!field) {
        toast.error(message);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAgreed) {
      toast.error(t('deliveryCostCalculator.validateError.agreement'));
      return;
    }

    if (
      !order.sender.name ||
      !order.sender.email ||
      !order.sender.phone ||
      !order.sender.inn_passport
    ) {
      toast.error(t('deliveryCostCalculator.validateError.senderData'));
      return;
    }

    if (!order.receiver.name || !order.receiver.email || !order.receiver.phone) {
      toast.error(t('deliveryCostCalculator.validateError.receiverData'));
      return;
    }

    if (isDoorDelivery && !order.receiver.address) {
      toast.error(t('deliveryCostCalculator.validateError.receiverAddress'));
      return;
    }

    const trackingNumber = await createParcel(order);

    if (trackingNumber) {
      setCreatedTrackingNumber(trackingNumber);
      setShowSuccessModal(true);

      setOrder({
        originCity: '',
        destinationCity: '',
        originOffice: 0,
        destinationOffice: 0,
        parcelValue: 0,
        parcelWeight: 0,
        deliveryCost: 0,
        insuranceCost: 0,
        totalCost: 0,
        deliveryDate: '',
        inParcel: '',
        sender: { name: '', email: '', phone: '', inn_passport: '' },
        receiver: { name: '', email: '', phone: '', address: '' },
        deliveryType: 'pickup',
        partnerType: 'E-Kit',
      });

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

  const onHandleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    userType?: 'sender' | 'receiver',
  ) => {
    const { name, value } = e.target;
    if (userType) {
      setOrder((prev) => ({
        ...prev,
        [userType]: { ...prev[userType], [name]: value },
      }));
    } else {
      setOrder((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 2) {
      return !!validateStep2(order);
    }

    if (currentStep === 3) {
      return !!validateStep3(order, isDoorDelivery);
    }

    if (currentStep === 4) return !isAgreed;

    return false;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateOrder()) return;
      if (!isDoorDelivery && !isPickup) openOrCloseCalcModal();
      else setCurrentStep(2);
    } else if (currentStep === 2) {
      const error = validateStep2(order);
      if (error) {
        return toast.error(error);
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const error = validateStep3(order, isDoorDelivery);
      if (error) {
        return toast.error(error);
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      const error = validateStep4(order, isDoorDelivery);
      if (error) {
        return toast.error(error);
      }
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
          order={order}
          setOrder={setOrder}
          onHandleChange={onHandleChange}
          handleNext={handleNext}
        />
      );
      break;
    case 2:
      steps = (
        <Step2SenderOfficeSelection
          order={order}
          setOrder={setOrder}
          handleNext={() => setCurrentStep(3)}
        />
      );
      break;
    case 3:
      steps = (
        <Step3RecipientOfficeSelection
          order={order}
          setOrder={setOrder}
          handleNext={() => setCurrentStep(4)}
        />
      );
      break;
    case 4:
      steps = (
        <Step4SenderRecipientForm
          order={order}
          onHandleChange={onHandleChange}
          handleChange={handleChange}
          doorDelivery={isDoorDelivery}
        />
      );
      break;
    case 5:
      steps = <Step5Review order={order} doorDelivery={isDoorDelivery} />;
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
        >
          {t('delivery.courier')}
        </Button>
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
                <div className="flex items-start sm:items-center gap-2 w-full sm:w-auto text-center sm:text-left -order-1 sm:order-0">
                  <Checkbox checked={isAgreed} onCheckedChange={() => setIsAgreed(!isAgreed)} />
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
                  <span>{t('deliveryCostCalculator.buttons.pay')}</span>
                  <ArrowRight size={20} />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isNextDisabled()}
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
