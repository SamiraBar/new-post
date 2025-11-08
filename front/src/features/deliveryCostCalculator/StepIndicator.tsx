interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number;
}

export const StepIndicator = ({ currentStep, totalSteps = 5 }: StepIndicatorProps) => {
    return (
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
                    <>
                        <div
                            key={step}
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                                currentStep >= step ? 'bg-orange-500 text-white' : 'bg-gray-300'
                            }`}
                        >
                            {step}
                        </div>
                        {index < totalSteps - 1 && (
                            <div
                                key={`line-${step}`}
                                className={`w-20 h-1 transition-colors ${
                                    currentStep > step ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                            />
                        )}
                    </>
                ))}
            </div>
        </div>
    );
};