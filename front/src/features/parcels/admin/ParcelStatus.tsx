import {
  Check,
  FileText,
  Package,
  Truck,
  Map,
  Building2,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface StatusStep {
  id: number;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const steps: StatusStep[] = [
  { id: 1, label: "Черновик", icon: <FileText className="w-5 h-5" />, color: "text-gray-400" },
  { id: 2, label: "Создан", icon: <Package className="w-5 h-5 text-blue-500" />, color: "text-blue-500" },
  { id: 3, label: "Принят", icon: <CheckCircle2 className="w-5 h-5 text-fuchsia-500" />, color: "text-fuchsia-500" },
  { id: 4, label: "Отправлен", icon: <Truck className="w-5 h-5 text-gray-400" />, color: "text-gray-400" },
  { id: 5, label: "В стране", icon: <Map className="w-5 h-5 text-orange-700" />, color: "text-orange-700" },
  { id: 6, label: "В городе", icon: <Building2 className="w-5 h-5 text-orange-500" />, color: "text-orange-500" },
  { id: 7, label: "На ПВЗ", icon: <MapPin className="w-5 h-5 text-lime-600" />, color: "text-lime-600" },
  { id: 8, label: "Выдано", icon: <Check className="w-5 h-5 text-green-600" />, color: "text-green-600" },
];

interface ParcelStatusProps {
  currentStep: number;
}

const ParcelStatus = ({ currentStep }: ParcelStatusProps) => {
  return (
    <div className="w-full bg-white border rounded-md shadow-sm py-5 px-4 sm:px-6 flex flex-col items-center">

      <div className="relative w-full overflow-x-auto scrollbar-hide">
        <div className="relative min-w-[800px] sm:min-w-[1000px] md:min-w-0 mx-auto flex flex-col items-center">

          <div className="absolute top-4 left-0 w-full h-[2px] bg-[#d3d3d3] z-0" />
          <div
            className="absolute top-4 left-0 h-[2px] bg-[#22c55e] z-0 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />

          <div className="relative flex justify-between w-full px-3 sm:px-0 z-10">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                  step.id <= currentStep
                    ? "bg-[#22c55e] border-[#22c55e]"
                    : "bg-[#d3d3d3] border-[#d3d3d3]"
                }`}
              >
                {step.id <= currentStep && <Check className="w-5 h-5 text-white" />}
              </div>
            ))}
          </div>

          <div className="flex justify-between w-full mt-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center text-center w-16 sm:w-20 shrink-0"
              >
                <div className={`${step.id <= currentStep ? step.color : "text-gray-400"}`}>
                  {step.icon}
                </div>
                <p
                  className={`text-[11px] sm:text-xs mt-1 font-medium ${
                    step.id <= currentStep ? step.color : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelStatus;
