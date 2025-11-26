import { type FC } from "react";
import { CheckCircle, Truck, MapPin, User, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StepIndicatorProps {
  currentStep: number;
  doorDelivery: boolean;
}

const StepIndicator: FC<StepIndicatorProps> = ({ currentStep, doorDelivery }) => {
  const { t } = useTranslation();

  const steps = [
    { number: 1, label: t('deliveryCostCalculator.steps.calculator'), icon: Truck },
    { number: 2, label: t('deliveryCostCalculator.steps.senderOffice'), icon: MapPin },
    { number: 3, label: doorDelivery
          ? t('deliveryCostCalculator.steps.recipientAddress')
          : t('deliveryCostCalculator.steps.recipientOffice'),
      icon: MapPin
    },
    { number: 4, label: t('deliveryCostCalculator.steps.senderRecipient'), icon: User },
    { number: 5, label: t('deliveryCostCalculator.steps.review'), icon: FileText },
  ];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  return (
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10 mx-10" />

        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const StepIcon = step.icon;

          return (
              <div key={step.number} className="flex flex-col items-center relative z-10">
                <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300
              ${status === 'completed'
                    ? 'bg-green-500 border-green-500 text-white'
                    : status === 'active'
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                }
            `}>
                  {status === 'completed' ? (
                      <CheckCircle size={16} />
                  ) : (
                      <StepIcon size={16} />
                  )}
                </div>
                <span className={`
              mt-2 text-xs font-medium text-center max-w-20
              ${status === 'completed'
                    ? 'text-green-600'
                    : status === 'active'
                        ? 'text-orange-600 font-semibold'
                        : 'text-gray-400'
                }
            `}>
              {step.label}
            </span>
                <div className={`
              absolute -top-1 -right-4 w-8 h-0.5 transition-all duration-300
              ${index === steps.length - 1 ? 'hidden' : ''}
              ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}
            `} />
              </div>
          );
        })}
      </div>
  );
};

export default StepIndicator;