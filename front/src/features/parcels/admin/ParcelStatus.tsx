import {
  Check,
  FileText,
  Package,
  Truck,
  Map,
  Building2,
  MapPin,
  CheckCircle2, SquarePen, Save, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
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
    icon: <FileText className="w-5 h-5"/>,
    color: 'text-gray-400',
    statusValue: 'draft'
  },
  {
    id: 2,
    label: 'Создан',
    icon: <Package className="w-5 h-5 text-blue-500"/>,
    color: 'text-blue-500',
    statusValue: 'created'
  },
  {
    id: 3,
    label: 'Принят',
    icon: <CheckCircle2 className="w-5 h-5 text-fuchsia-500"/>,
    color: 'text-fuchsia-500',
    statusValue: 'accepted'
  },
  {
    id: 4,
    label: 'Отправлен',
    icon: <Truck className="w-5 h-5 text-gray-400"/>,
    color: 'text-gray-400',
    statusValue: 'shipped'
  },
  {
    id: 5,
    label: 'В стране',
    icon: <Map className="w-5 h-5 text-orange-700"/>,
    color: 'text-orange-700',
    statusValue: 'in_country'
  },
  {
    id: 6,
    label: 'В городе',
    icon: <Building2 className="w-5 h-5 text-orange-500"/>,
    color: 'text-orange-500',
    statusValue: 'in_city'
  },
  {
    id: 7,
    label: 'На ПВЗ',
    icon: <MapPin className="w-5 h-5 text-lime-600"/>,
    color: 'text-lime-600',
    statusValue: 'at_pickup_point'
  },
  {
    id: 8,
    label: 'Выдано',
    icon: <Check className="w-5 h-5 text-green-600"/>,
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
  const {editParcelStatus} = useParcelsStore();

  const getCurrentStep = (statusValue: string) => {
    const step = steps.find(s => s.statusValue === statusValue);
    return step ? step.id : 1;
  };

  const currentStep = getCurrentStep(newStatus || status);

  const save = async () => {
    if (!newStatus || !trackingNumber) return;

    await editParcelStatus(trackingNumber, newStatus);
    setIsEditing(false);
    setNewStatus(null);
  };

  return (
    <div className="w-full bg-white border rounded-md shadow-sm py-5 px-4 sm:px-6 flex flex-col items-center relative">
      {isEditing && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 text-xs font-medium rounded px-2 py-1">
        Выберите статус!
        </span>
      )}

      <div className="absolute top-2 right-2 z-20 flex space-x-2">
        {
          isEditing && (
            <Button
              variant="outline"
              size="icon"
              className="size-5"
              onClick={save}
              disabled={!newStatus}
            >
              <Save/>
            </Button>
          )
        }
        <Button
          variant="outline"
          size="icon"
          className="size-5"
          onClick={() => {
            setIsEditing(!isEditing);
            setNewStatus(null);
          }}
        >
          {
            isEditing ? (
              <X/>
            ) : (
              <SquarePen/>
            )
          }
        </Button>
      </div>
      <div className="relative w-full overflow-x-auto scrollbar-hide">
        <div className="relative min-w-[800px] sm:min-w-[1000px] md:min-w-0 mx-auto flex flex-col items-center">

          <div className="absolute top-4 left-0 w-full h-[2px] bg-[#d3d3d3] z-0"/>
          <div
            className="absolute top-4 left-0 h-[2px] bg-[#22c55e] z-0 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />

          <div className="relative flex justify-between w-full px-3 sm:px-0 z-10">
            {steps.map((step) => (
              <div
                onClick={() => isEditing && setNewStatus(step.statusValue)}
                key={step.id}
                className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                  step.id <= currentStep
                    ? 'bg-[#22c55e] border-[#22c55e]'
                    : 'bg-[#d3d3d3] border-[#d3d3d3]'
                } ${isEditing ? 'cursor-pointer hover:scale-110' : ''}`}
              >
                {step.id <= currentStep && <Check className="w-5 h-5 text-white"/>}
              </div>
            ))}
          </div>

          <div className="flex justify-between w-full mt-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center text-center w-16 sm:w-20 shrink-0"
              >
                <div className={`${step.id <= currentStep ? step.color : 'text-gray-400'}`}>
                  {step.icon}
                </div>
                <div
                  className={`text-[11px] sm:text-xs mt-1 font-medium flex flex-col items-center ${
                    step.id <= currentStep ? step.color : 'text-gray-400'
                  }`}
                >
                  <div>
                    {step.label}
                  </div>
                  <div>
                    {step.statusValue === 'draft' ? dayjs(draftedAt).format('DD.MM.YYYY HH:mm') : null}
                    {step.statusValue === 'created' ? createdAt ? dayjs(createdAt).format('DD.MM.YYYY HH:mm') : null : null}
                    {step.statusValue === 'accepted' ? acceptedAt ? dayjs(acceptedAt).format('DD.MM.YYYY HH:mm') : null : null}
                    {step.statusValue === 'shipped' ? shippedAt ? dayjs(shippedAt).format('DD.MM.YYYY HH:mm') : null : null}
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