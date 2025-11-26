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
import Step1Calculator from '@/features/deliveryCostCalculator/Step1Calculator.tsx';
import Step2SenderOfficeSelection from './Step2OfficeSelection';
import Step3RecipientOfficeSelection from '@/features/deliveryCostCalculator/Step3RecipientOfficeSelection.tsx';
import Step4SenderRecipientForm from '@/features/deliveryCostCalculator/Step4SenderRecipientForm.tsx';
import Step5Review from '@/features/deliveryCostCalculator/Step5Review.tsx';
import { useDeliveryStore } from '@/stores/deliveryStore/deliveryStore.ts';
import DeliveryModal from '@/features/deliveryCostCalculator/components/modal/DeliveryModal.tsx';
import { useTranslation } from 'react-i18next';
import useParcelsStore from "@/stores/parcelsStore/parcelsStore.ts";
import ParcelSuccessModal from './components/modal/ParcelSuccessModal';
import { validateStep1, validateStep2, validateStep3, validateStep4 } from '@/lib/validation';
import {StepIndicator} from "@/features/deliveryCostCalculator/StepIndicator.tsx";

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
    selectedPrice,
    fetchPricing,
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
    sender: { name: '', email: '', phone: '' },
    receiver: { name: '', email: '', phone: '', address: '' },
    deliveryType: 'pickup',
  });

  const canProceedToStep2 = () => {
    return !validateStep1(order);
  };

  const canProceedToStep3 = () => {
    return !validateStep2(order);
  };

  const canProceedToStep4 = () => {
    return !validateStep3(order, isDoorDelivery);
  };

  const canProceedToStep5 = () => {
    return !validateStep4(order, isDoorDelivery);
  };

  const getNextButtonDisabled = () => {
    switch (currentStep) {
      case 1:
        return !canProceedToStep2();
      case 2:
        return !canProceedToStep3();
      case 3:
        return !canProceedToStep4();
      case 4:
        return !canProceedToStep5();
      default:
        return false;
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  useEffect(() => {
    setOrder((prev) => ({
      ...prev,
      deliveryType: isPickup ? 'pickup' : 'courier',
    }));
  }, [isPickup, isDoorDelivery]);

  const calculateDeliveryCost = useCallback(
      (weight: number) => {
        if (weight <= 0) return 0;
        return weight * selectedPrice;
      },
      [selectedPrice]
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAgreed) {
      toast.error(t('deliveryCostCalculator.validateError.agreement'));
      return;
    }

    const step4Error = validateStep4(order, isDoorDelivery);
    if (step4Error) {
      toast.error(step4Error);
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
        sender: { name: '', email: '', phone: '' },
        receiver: { name: '', email: '', phone: '', address: '' },
        deliveryType: 'pickup',
      });

      setCurrentStep(1);
      setIsAgreed(false);
      clearActions();
    } else {
      toast.error(createParcelError?.error || t('deliveryCostCalculator.error.failedToCreate') || 'Не удалось создать посылку');
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
    let error: string | null = null;

    switch (currentStep) {
      case 1:
        error = validateStep1(order);
        if (error) {
          toast.error(error);
          return;
        }
        if (!isDoorDelivery && !isPickup) {
          openOrCloseCalcModal();
        } else {
          setCurrentStep(2);
        }
        break;

      case 2:
        error = validateStep2(order);
        if (error) {
          toast.error(error);
          return;
        }
        setCurrentStep(3);
        break;

      case 3:
        error = validateStep3(order, isDoorDelivery);
        if (error) {
          toast.error(error);
          return;
        }
        setCurrentStep(4);
        break;

      case 4:
        error = validateStep4(order, isDoorDelivery);
        if (error) {
          toast.error(error);
          return;
        }
        setCurrentStep(5);
        break;

      default:
        setCurrentStep(currentStep + 1);
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
      steps = <Step1Calculator
          order={order}
          setOrder={setOrder}
          onHandleChange={onHandleChange}
          handleNext={handleNext}
      />;
      break;
    case 2:
      steps = <Step2SenderOfficeSelection
          order={order}
          setOrder={setOrder}
          handleNext={() => setCurrentStep(3)}
      />;
      break;
    case 3:
      steps = <Step3RecipientOfficeSelection
          order={order}
          setOrder={setOrder}
      />;
      break;
    case 4:
      steps = <Step4SenderRecipientForm
          order={order}
          onHandleChange={onHandleChange}
          handleChange={handleChange}
          doorDelivery={isDoorDelivery}
      />;
      break;
    case 5:
      steps = <Step5Review
          order={order}
          doorDelivery={isDoorDelivery}
      />;
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
          <p className="text-lg font-medium text-gray-700">{t("delivery.chooseType")}</p>

          <Button
              onClick={selectPickup}
              className={`
            px-6 py-2 rounded-xl border-2 transition-all duration-200 shadow-md
            active:scale-95 active:shadow-lg
            ${isPickup ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-500 border-gray-300'}
            hover:bg-white hover:text-orange-500
          `}
          >
            {t("delivery.pickup")}
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
            {t("delivery.courier")}
          </Button>
        </div>

        <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg">
          <StepIndicator currentStep={currentStep}/>
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
                        <Checkbox
                            checked={isAgreed}
                            onCheckedChange={() => setIsAgreed(!isAgreed)}
                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label className="text-sm text-gray-600 leading-tight cursor-pointer">
                          {t('deliveryCostCalculator.buttons.agreement')}
                        </Label>
                      </div>
                  )}

                  {currentStep === 5 ? (
                      <Button
                          type="button"
                          disabled={createParcelLoading || !isAgreed}
                          className="flex items-center gap-2 w-full sm:w-auto justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          onClick={handleSubmit}
                      >
                  <span>
                    {createParcelLoading
                        ? t('deliveryCostCalculator.buttons.creating')
                        : t('deliveryCostCalculator.buttons.pay')
                    }
                  </span>
                        <ArrowRight size={20} />
                      </Button>
                  ) : (
                      <Button
                          type="button"
                          onClick={handleNext}
                          disabled={getNextButtonDisabled()}
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