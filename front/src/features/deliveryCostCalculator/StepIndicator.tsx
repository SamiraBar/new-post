interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number;
    className?: string;
}

export const StepIndicator = ({
                                  currentStep,
                                  totalSteps = 5,
                                  className = ""
                              }: StepIndicatorProps) => {
    return (
        <div className={`flex justify-center mb-6 sm:mb-8 ${className}`}>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
                    <div key={step} className="flex items-center">
                        <div
                            className={`
                                flex items-center justify-center 
                                rounded-full transition-all duration-300 
                                font-medium
                                w-6 h-6 text-xs
                                sm:w-8 sm:h-8 sm:text-sm
                                md:w-10 md:h-10 md:text-base
                                lg:w-12 lg:h-12 lg:text-lg
                                ${currentStep >= step
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-gray-200 text-gray-600'
                            }
                            `}
                        >
                            {step}
                        </div>
                        {index < totalSteps - 1 && (
                            <div
                                className={`
                                    transition-colors duration-300
                                    w-8 h-0.5
                                    sm:w-12 sm:h-0.5
                                    md:w-16 md:h-1
                                    lg:w-24 lg:h-1
                                    ${currentStep > step ? 'bg-orange-500' : 'bg-gray-300'}
                                `}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};