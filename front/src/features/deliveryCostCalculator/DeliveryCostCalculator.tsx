import { useState, useEffect } from 'react';
import { BASE_PRICE, tariffs } from '../../constants.ts';
import { StepIndicator } from './StepIndicator';
import { Step1Calculator } from './Step1Calculator';
import { Step2OfficeSelection } from './Step2OfficeSelection';
import { Step3Placeholder } from './Step3Placeholder';
import { WarningNotices } from './WarningNotices';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const DeliveryCostCalculator = () => {
  const [weight, setWeight] = useState(0);
  const [value, setValue] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [insuranceCost, setInsuranceCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOffice, setSelectedOffice] = useState<number | null>(null);

  const totalSteps = 5;

  const calculateDeliveryCost = (weight: number) => {
    if (weight <= 0) return 0;
    const tariff = tariffs.find(t => weight <= t.maxWeight) || tariffs[tariffs.length - 1];
    const total = BASE_PRICE + (weight - 1) * tariff.pricePerKg;
    return Math.max(total, BASE_PRICE);
  };

  const calculateInsuranceCost = (parcelValue: number) => {
    if (parcelValue <= 0) return 0;
    if (parcelValue <= 10000) {
      return parcelValue * 0.01;
    } else if (parcelValue <= 50000) {
      return parcelValue * 0.015;
    } else {
      return parcelValue * 0.02;
    }
  };

  useEffect(() => {
    const delivery = calculateDeliveryCost(weight);
    const insurance = calculateInsuranceCost(value);
    const total = delivery + insurance;

    setDeliveryCost(delivery);
    setInsuranceCost(insurance);
    setTotalCost(total);
  }, [weight, value]);

  const handleNext = () => {
    if (currentStep === 2 && selectedOffice) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStep1Submit = () => {
    setCurrentStep(2);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
            <Step1Calculator
                weight={weight}
                value={value}
                deliveryCost={deliveryCost}
                insuranceCost={insuranceCost}
                totalCost={totalCost}
                onWeightChange={setWeight}
                onValueChange={setValue}
                onSubmit={handleStep1Submit}
            />
        );
      case 2:
        return (
            <Step2OfficeSelection
                selectedOffice={selectedOffice}
                onSelectOffice={setSelectedOffice}
            />
        );
      case 3:
        return <Step3Placeholder />;
      case 4:
        return (
            <div className="w-full pt-5">
              <h3 className="text-2xl font-bold text-center mb-8">Шаг 4 - В разработке</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-20 text-center">
                <p className="text-gray-500 text-xl">Этот шаг будет реализован позже</p>
              </div>
            </div>
        );
      case 5:
        return (
            <div className="w-full pt-5">
              <h3 className="text-2xl font-bold text-center mb-8">Шаг 5 - В разработке</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-20 text-center">
                <p className="text-gray-500 text-xl">Этот шаг будет реализован позже</p>
              </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
      <div className="container" id={'calculator'}>
        <h3 className="text-xl font-medium text-center mb-10">
          Жеткирүү баасын эсептөө калькулятору <br /> Калькулятор расчёта стоимости доставки
        </h3>

        <div className="p-2 sm:p-5 bg-yellow-50 rounded-lg">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          {renderCurrentStep()}

          {currentStep > 1 && (
              <div className="flex justify-between mt-8 px-5">
                <Button
                    onClick={handleBack}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3"
                >
                  <ArrowLeft size={20} />
                  <span>Артка / Назад</span>
                </Button>

                {currentStep < totalSteps && (
                    <Button
                        onClick={handleNext}
                        disabled={currentStep === 2 && !selectedOffice}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <span>Алдыга / Вперед</span>
                      <ArrowRight size={20} />
                    </Button>
                )}
              </div>
          )}

          {currentStep === 1 && <WarningNotices />}
        </div>
      </div>
  );
};

export default DeliveryCostCalculator;