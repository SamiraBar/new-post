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
import type { Order, DeliveryType } from '@/types';
import { WarningNotices } from './WarningNotices';
import { StepIndicator } from '@/features/deliveryCostCalculator/StepIndicator.tsx';
import Step1Calculator from '@/features/deliveryCostCalculator/Step1Calculator.tsx';
import Step2OfficeSelection from '@/features/deliveryCostCalculator/Step2OfficeSelection.tsx';
import Step3RecipientOfficeSelection from '@/features/deliveryCostCalculator/Step3RecipientOfficeSelection.tsx';
import Step4SenderRecipientForm from '@/features/deliveryCostCalculator/Step4SenderRecipientForm.tsx';
import Step5Review from '@/features/deliveryCostCalculator/Step5Review.tsx';
import { useDeliveryStore } from '@/stores/deliveryStore/deliveryStore.ts';
import DeliveryModal from '@/features/deliveryCostCalculator/components/modal/DeliveryModal.tsx';
import { useTranslation } from 'react-i18next';

const BASE_PRICE = 600;
const tariffs = [
  { maxWeight: 3, pricePerKg: 125 },
  { maxWeight: 6, pricePerKg: 135 },
  { maxWeight: 12, pricePerKg: 140 },
  { maxWeight: 15, pricePerKg: 145 },
];

const DeliveryCostCalculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);
  const { openOrCloseCalcModal, isDoorDelivery, isPickup, clearActions } = useDeliveryStore();
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
    sender: { name: '', email: '', phone: '' },
    receiver: { name: '', email: '', phone: '', address: '' },
    deliveryType: 'pickup',
  });

  const { t } = useTranslation();

  const calculateDeliveryCost = useCallback(
    (weight: number) => {
      if (weight <= 0) return 0;
      const tariff = tariffs.find((t) => weight <= t.maxWeight) || tariffs[tariffs.length - 1];
      return Math.max(BASE_PRICE + (weight - 1) * tariff.pricePerKg, BASE_PRICE);
    },
    []
  );

  const calculateInsuranceCost = useCallback((parcelValue: number) => {
    if (parcelValue <= 0) return 0;
    if (parcelValue <= 10000) return parcelValue * 0.01;
    if (parcelValue <= 50000) return parcelValue * 0.015;
    return parcelValue * 0.02;
  }, []);

  useEffect(() => {
    const delivery = calculateDeliveryCost(order.parcelWeight);
    const insurance = calculateInsuranceCost(order.parcelValue);
    setOrder((prev) => ({
      ...prev,
      deliveryCost: delivery,
      insuranceCost: insurance,
      totalCost: delivery + insurance,
    }));
  }, [order.parcelWeight, order.parcelValue, calculateDeliveryCost, calculateInsuranceCost]);

  const validateOrder = () => {
    const validations = [
      { field: order.originCity, message: t('deliveryCostCalculator.validateError.cityOfSender') },
      { field: order.destinationCity, message: t('deliveryCostCalculator.validateError.cityOfReceiver') },
      { field: order.parcelValue, message: t('deliveryCostCalculator.validateError.parcelValue') },
      { field: order.parcelWeight, message: t('deliveryCostCalculator.validateError.parcelWeight') },
    ];

    for (const { field, message } of validations) {
      if (!field) {
        toast.error(message);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success(String(order));
  };

  const onHandleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    userType?: 'sender' | 'receiver'
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

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateOrder()) return;
      if (!isDoorDelivery && !isPickup) openOrCloseCalcModal();
      else setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!order.originOffice) return toast.error(t('deliveryCostCalculator.validateError.senderOffice'));
      if (isDoorDelivery) return setCurrentStep(4);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!order.destinationOffice) return toast.error(t('deliveryCostCalculator.validateError.receiverOffice'));
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!order.sender.name) return toast.error(t('deliveryCostCalculator.validateError.senderName'));
      if (!order.sender.email) return toast.error(t('deliveryCostCalculator.validateError.senderEmail'));
      if (!order.sender.phone) return toast.error(t('deliveryCostCalculator.validateError.senderPhone'));
      if (!order.receiver.name) return toast.error(t('deliveryCostCalculator.validateError.receiverName'));
      if (!order.receiver.email) return toast.error(t('deliveryCostCalculator.validateError.receiverEmail'));
      if (!order.receiver.phone) return toast.error(t('deliveryCostCalculator.validateError.receiverPhone'));
      if (isDoorDelivery && !order.receiver.address) return toast.error(t('deliveryCostCalculator.validateError.receiverAddress'));
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (isDoorDelivery && currentStep === 4) return setCurrentStep(2);
      if (currentStep === 2) clearActions();
      setCurrentStep(currentStep - 1);
    }
  };

  let steps: JSX.Element | null = null;
  switch (currentStep) {
    case 1:
      steps = <Step1Calculator order={order} setOrder={setOrder} onHandleChange={onHandleChange} handleNext={handleNext} />;
      break;
    case 2:
      steps = <Step2OfficeSelection order={order} setOrder={setOrder} />;
      break;
    case 3:
      steps = <Step3RecipientOfficeSelection order={order} setOrder={setOrder} />;
      break;
    case 4:
      steps = <Step4SenderRecipientForm order={order} onHandleChange={onHandleChange} handleChange={handleChange} doorDelivery={isDoorDelivery} />;
      break;
    case 5:
      steps = <Step5Review order={order} doorDelivery={isDoorDelivery} />;
      break;
  }

  const toggleDeliveryType = (type: DeliveryType) => {
    setOrder((prev) => ({ ...prev, deliveryType: type }));
  };

  return (
    <div className="container" id="calculator">
      <Toaster />
      <DeliveryModal />

      <h3 className="text-xl font-medium text-center mb-4">{t('deliveryCostCalculator.title')}</h3>

      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        <p className="text-lg font-medium text-gray-700">
          Выберите тип доставки:
        </p>
        <Button
          variant={order.deliveryType === 'pickup' ? 'default' : 'outline'}
          onClick={() => toggleDeliveryType('pickup')}
          className="px-6 py-2"
        >
          ПВЗ
        </Button>
        <Button
          variant={order.deliveryType === 'courier' ? 'default' : 'outline'}
          onClick={() => toggleDeliveryType('courier')}
          className="px-6 py-2"
        >
          Курьер
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
                <div className="flex items-start sm:items-center gap-2 w-full sm:w-auto text-center sm:text-left -order-1 sm:order-none">
                  <Checkbox checked={isAgreed} onCheckedChange={() => setIsAgreed(!isAgreed)} />
                  <Label className="text-sm text-gray-600 leading-tight">
                    {t('deliveryCostCalculator.buttons.agreement')}
                  </Label>
                </div>
              )}

              {currentStep === 5 ? (
                <Button
                  type="button"
                  disabled={!isAgreed}
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
                  disabled={currentStep === 4 && !isAgreed}
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
