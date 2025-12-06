import {
  Check,
  FileText,
  Package,
  Truck,
  Map,
  Building2,
  CheckCircle2,
  SquarePen,
  Save,
  X,
  Clock,
  Warehouse,
  Home,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useState, useEffect } from 'react';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore.ts';
import dayjs from 'dayjs';

interface StatusStep {
  id: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  statusValue: string;
}

const steps: StatusStep[] = [
  {
    id: 1,
    label: 'Черновик',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-gray-500',
    statusValue: 'draft'
  },
  {
    id: 2,
    label: 'Создан',
    icon: <Package className="w-5 h-5 text-blue-600" />,
    color: 'text-blue-600',
    statusValue: 'created'
  },
  {
    id: 3,
    label: 'Принят',
    icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />,
    color: 'text-purple-600',
    statusValue: 'accepted'
  },
  {
    id: 4,
    label: 'Отправлен',
    icon: <Truck className="w-5 h-5 text-orange-500" />,
    color: 'text-orange-500',
    statusValue: 'shipped'
  },
  {
    id: 5,
    label: 'В стране',
    icon: <Map className="w-5 h-5 text-amber-600" />,
    color: 'text-amber-600',
    statusValue: 'in_country'
  },
  {
    id: 6,
    label: 'В городе',
    icon: <Building2 className="w-5 h-5 text-amber-500" />,
    color: 'text-amber-500',
    statusValue: 'in_city'
  },
  {
    id: 7,
    label: 'На ПВЗ',
    icon: <Warehouse className="w-5 h-5 text-lime-600" />,
    color: 'text-lime-600',
    statusValue: 'at_pickup_point'
  },
  {
    id: 8,
    label: 'Доставлен',
    icon: <Home className="w-5 h-5 text-green-600" />,
    color: 'text-green-600',
    statusValue: 'delivered'
  },
];

interface ParcelStatusProps {
  status: string;
  trackingNumber: string;
  draftedAt?: string;
  createdAt?: string;
  acceptedAt?: string;
  shippedAt?: string;
}

const ParcelStatus = ({
                        status,
                        trackingNumber,
                        draftedAt,
                        createdAt,
                        acceptedAt,
                        shippedAt
                      }: ParcelStatusProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [pulsingStep, setPulsingStep] = useState<number | null>(null);
  const { editParcelStatus, editParcelStatusLoading } = useParcelsStore();

  const getCurrentStep = (statusValue: string) => {
    const step = steps.find(s => s.statusValue === statusValue);
    return step ? step.id : 1;
  };

  const currentStep = getCurrentStep(newStatus || status);
  const progress =
      steps.length > 1 ? (currentStep - 1) / (steps.length - 1) : 0;

  useEffect(() => {
    if (pulsingStep !== null) {
      const timer = setTimeout(() => {
        setPulsingStep(null);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [pulsingStep]);

  const handleStatusSelect = (step: StatusStep) => {
    if (isEditing) {
      setNewStatus(step.statusValue);
      setPulsingStep(step.id);
    }
  };

  const save = async () => {
    if (!newStatus || !trackingNumber) return;
    await editParcelStatus(trackingNumber, newStatus);
    setIsEditing(false);
    setNewStatus(null);
  };

  return (
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm py-6 px-4 sm:px-8 flex flex-col items-center relative">
        {isEditing && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-700 text-xs font-medium rounded-full px-3 py-1 border border-blue-200">
          Выберите новый статус
        </span>
        )}
        <div className="absolute -top-8 right-3 sm:right-4 z-20 flex space-x-2">
          {isEditing && (
              <Button
                  variant="outline"
                  size="icon"
                  className="size-9 hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all duration-200 relative group"
                  onClick={save}
                  disabled={!newStatus || editParcelStatusLoading}
              >
                {editParcelStatusLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Save className="w-4 h-4" />
                )}
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {editParcelStatusLoading ? 'Сохранение...' : 'Сохранить статус'}
                </div>
              </Button>
          )}
          <Button
              variant={isEditing ? "default" : "outline"}
              size="icon"
              className={`size-9 transition-all duration-200 relative group ${
                  isEditing
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
              }`}
              onClick={() => {
                setIsEditing(!isEditing);
                setNewStatus(null);
              }}
          >
            {isEditing ? (
                <X className="w-4 h-4" />
            ) : (
                <SquarePen className="w-4 h-4" />
            )}
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {isEditing ? 'Отменить' : 'Изменить статус'}
            </div>
          </Button>
        </div>

        <div className="relative w-full overflow-x-auto scrollbar-hide pt-4.5">
          <div className="relative min-w-[1000px] sm:min-w-[1200px] md:min-w-0 mx-auto flex flex-col items-center">

            <div className="absolute top-6 left-10 right-10 h-1 bg-gray-200 rounded-full z-0" />
            <div
                className="absolute top-6 left-10 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full z-0 transition-all duration-700 ease-out"
                style={{
                  width: progress <= 0 ? '0%' : `${progress * 100}%`,
                }}
            />
            <div className="relative flex justify-between w-full px-10 z-10 mb-14">
              {steps.map((step) => (
                  <div
                      key={step.id}
                      className="flex flex-col items-center"
                  >
                    <div
                        onClick={() => handleStatusSelect(step)}
                        className={`flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300 ${
                            step.id <= currentStep
                                ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-600 shadow-lg shadow-green-200'
                                : 'bg-white border-gray-300'
                        } ${
                            isEditing && step.id > currentStep
                                ? 'cursor-pointer hover:scale-110 hover:border-green-400 hover:shadow-md'
                                : ''
                        } relative`}
                    >
                      {step.id <= currentStep && (
                          <Check className="w-6 h-6 text-white" />
                      )}
                      {step.id > currentStep && (
                          <div className="w-3 h-3 rounded-full bg-gray-300" />
                      )}
                      {pulsingStep === step.id && (
                          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping" />
                      )}
                    </div>
                  </div>
              ))}
            </div>

            <div className="flex justify-between w-full -mt-1 mx-10">
              {steps.map((step) => (
                  <div
                      key={step.id}
                      className="flex flex-col items-center text-center w-24 sm:w-28 shrink-0"
                  >
                    <div className={`mb-3 transition-all duration-300 relative ${
                        step.id <= currentStep
                            ? `${step.color} scale-110`
                            : 'text-gray-400 scale-100'
                    }`}>
                      {step.icon}
                      {pulsingStep === step.id && (
                          <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
                      )}
                    </div>
                    <div className={`text-xs font-medium transition-all duration-300 ${
                        step.id <= currentStep ? step.color : 'text-gray-500'
                    }`}>
                      <div className="font-semibold mb-1 leading-tight">
                        {step.label}
                      </div>
                      <div className="text-[11px] font-semibold opacity-90 min-h-[32px] flex items-center justify-center leading-tight">
                        {step.statusValue === 'draft' && draftedAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {dayjs(draftedAt).format('DD.MM.YY HH:mm')}
                            </div>
                        )}
                        {step.statusValue === 'created' && createdAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {dayjs(createdAt).format('DD.MM.YY HH:mm')}
                            </div>
                        )}
                        {step.statusValue === 'accepted' && acceptedAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {dayjs(acceptedAt).format('DD.MM.YY HH:mm')}
                            </div>
                        )}
                        {step.statusValue === 'shipped' && shippedAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {dayjs(shippedAt).format('DD.MM.YY HH:mm')}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ParcelStatus;