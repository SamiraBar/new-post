import type { IParcel } from '@/types';
import {
  Barcode,
  Building2,
  Check,
  CheckCircle2,
  Ellipsis,
  Map,
  MapPin,
  Package,
  Play,
  StickyNote,
  Truck,
  FileText,
} from 'lucide-react';
import dayjs from 'dayjs';

import icUser from '../../assets/images/user-round.svg';
import icPhone from '../../assets/images/phone.svg';
import icBanknote from '../../assets/images/banknote.svg';
import icWeight from '../../assets/images/weight.svg';
import icCalendar from '../../assets/images/calendar-clock.svg';
import { useNavigate } from 'react-router-dom';

const steps = [
  { icon: <FileText size={25} />, statusValue: 'draft' },
  { icon: <Package size={25} className="text-blue-500" />, statusValue: 'created' },
  { icon: <CheckCircle2 size={25} className="text-fuchsia-500" />, statusValue: 'accepted' },
  { icon: <Truck size={25} className="text-gray-400" />, statusValue: 'shipped' },
  { icon: <Map size={25} className="text-orange-700" />, statusValue: 'in_country' },
  { icon: <Building2 size={25} className="text-orange-500" />, statusValue: 'in_city' },
  { icon: <MapPin size={25} className="text-lime-600" />, statusValue: 'at_pickup_point' },
  { icon: <Check size={25} className="text-green-600" />, statusValue: 'delivered' },
];

interface Props {
  parcel: IParcel;
}

const ParcelItem = ({ parcel }: Props) => {
  const {
    _id,
    trackingNumber,
    partnerTrackingNumber,
    status,
    draftedAt,
    isPaid,
    partnerStickerReceived,
    weight,
    sender,
    recipient,
    deliveryType,
    partnerType,
  } = parcel;

  const navigate = useNavigate();

  const deliveryLabel = deliveryType === 'pickup' ? 'ПВЗ' : 'Курьер';

  return (
    <div
      data-testid="parcel-item"
      className="flex flex-col lg:flex-row gap-4 w-full bg-amber-50 p-4 md:p-6 rounded-2xl relative"
    >
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
        <div className="size-4 w-20 h-20 rounded-full border-4 border-orange-500 flex items-center justify-center">
          {steps.find((step) => step.statusValue === status)?.icon}
        </div>
      </div>

      <div className="flex-1 pr-20 lg:pr-24">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-gray-700 bg-gray-300 py-1 px-3 rounded-2xl text-xs md:text-sm font-medium">
            KG312-1
          </span>

          <div className="flex gap-1">
            <Play size={12} fill="currentColor" />
            <Play size={12} fill="currentColor" />
          </div>

          <p className="font-bold m-0 text-base md:text-lg">{trackingNumber}</p>

          <div className="flex md:flex-row md:items-center gap-3 md:ml-auto sm:flex-col sm:items-start">
            <div className="relative group">
              <p className="font-bold m-0 text-base md:text-lg cursor-help">
                {partnerTrackingNumber || '-'}
              </p>
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
              >
                Трек номер партнера
              </div>
            </div>

            <div
              className="
      ml-0 md:ml-2 md:order-last
      flex items-center gap-2
      rounded-lg px-2.5 py-1.5
      bg-gradient-to-r from-orange-300 to-orange-400
      shadow text-white
    "
            >
              <div className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-md">
                <Package size={15} strokeWidth={2} className="text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-semibold drop-shadow-sm">{deliveryLabel}</span>
                <span className="text-[9px] opacity-90 font-medium">{partnerType}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="flex gap-3 md:col-span-2">
              <img src={icCalendar} alt="Calendar icon" className="w-5 h-5" />
              <div className="flex flex-col gap-0.5 text-sm">
                <span className="font-medium">{dayjs(draftedAt).format('DD.MM.YYYY')}</span>
                <span className="text-gray-600">{dayjs(draftedAt).format('HH:mm:ss')}</span>
              </div>
            </div>

            <div className="flex gap-3 md:col-span-5 md:flex-row sm:flex-col">
              <p className="m-0 text-base whitespace-nowrap">Отправитель:</p>
              <div className="flex items-center gap-2">
                <img src={icUser} alt="User icon" className="w-5 h-5" />
                <p className="m-0 font-bold text-base">{sender.fullName}</p>
              </div>
            </div>

            <div className="flex justify-between md:justify-end gap-4 md:col-span-5 md:flex-row sm:flex-col lg:items-center">
              {isPaid && (
                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <img src={icBanknote} alt="Banknote icon" className="w-8 h-8 md:w-9 md:h-9" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      Оплачено
                    </div>
                  </div>

                  {partnerStickerReceived && (
                    <div className="relative group">
                      <a
                        href="#"
                        className="p-2 rounded-lg hover:bg-amber-100 transition-colors hover:scale-110 duration-300 flex items-center justify-center"
                      >
                        <StickyNote color="#6b6b6b" strokeWidth={3} size={24} />
                      </a>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        Стикер партнёра получен
                      </div>
                    </div>
                  )}

                  <div className="relative group">
                    <a
                      href="#"
                      className="p-2 rounded-lg hover:bg-amber-100 transition-colors hover:scale-110 duration-300 flex items-center justify-center"
                    >
                      <Barcode color="#6b6b6b" strokeWidth={3} size={24} />
                    </a>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      Печать штрих-кода
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 items-center">
                <div className="flex gap-2 items-center">
                  <img src={icWeight} alt="Weight icon" className="w-5 h-5" />
                  <p className="m-0 text-base md:text-lg font-bold whitespace-nowrap">
                    Вес: {weight} кг
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="hidden md:block md:col-span-2"></div>

            <div className="flex gap-3 md:col-span-5 md:flex-row sm:flex-col">
              <p className="m-0 text-base whitespace-nowrap">Получатель:</p>
              <div className="flex items-center gap-2 lg:pl-2.5">
                <img src={icUser} alt="User icon" className="w-5 h-5" />
                <p className="m-0 font-bold text-base">{recipient.fullName}</p>
              </div>
            </div>

            <div className="flex justify-between md:justify-end gap-4 md:col-span-5 md:flex-row sm:flex-col">
              <div className="flex items-center gap-2">
                <img src={icPhone} alt="Phone icon" className="w-5 h-5" />
                <p className="m-0 font-bold text-base md:text-lg">{recipient.phoneNumber}</p>
              </div>

              <button
                onClick={() => navigate(`/parcels/${_id}`)}
                className="p-2 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer duration-300 self-start relative group"
              >
                <Ellipsis color="#6b6b6b" strokeWidth={3} size={24} />
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Подробнее
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelItem;
