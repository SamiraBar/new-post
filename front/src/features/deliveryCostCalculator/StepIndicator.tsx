interface Props {
  currentStep: number;
  doorDelivery: boolean;
}

export const StepIndicator = ({ currentStep, doorDelivery }: Props) => {
  return (
    <div className="flex flex-col items-center w-full mb-8 px-4">
      <div className="relative flex justify-between items-center w-full max-w-2xl">
        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-200 -translate-y-1/2 rounded-full">
          <div
            className="h-[3px] bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />
        </div>
        {(doorDelivery ? [1, 2, 3, 4] : [1, 2, 3, 4, 5]).map((step) => (
          <div key={step} className="relative flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm sm:text-base z-10 transition-all duration-300 ${
                currentStep >= step
                  ? 'bg-orange-500 text-white shadow-md scale-105'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
