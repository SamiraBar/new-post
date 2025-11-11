import type { IParcel } from '@/types';
import { Barcode, Ellipsis, Play, StickyNote } from 'lucide-react';
import dayjs from 'dayjs';

import icUser from '../../assets/images/user-round.svg';
import icPhone from '../../assets/images/phone.svg';
import icBanknote from '../../assets/images/banknote.svg';
import icWeight from '../../assets/images/weight.svg';
import icCalendar from '../../assets/images/calendar-clock.svg';
import { useNavigate } from 'react-router-dom';

interface Props {
  parcel: IParcel;
}

const ParcelItem = ({ parcel }: Props) => {
  const {
    _id,
    trackingNumber,
    partnerTrackingNumber,
    senderFullName,
    recipientFullName,
    recipientPhoneNumber,
    status,
    createdAt,
    isPaid,
    partnerStickerReceived,
    weight,
  } = parcel;

  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full bg-amber-50 p-4 md:p-6 rounded-2xl relative">
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-orange-500  flex items-center justify-center">
          {status}
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
          <div className="flex md:flex-row md:items-center gap-3 md:ml-auto sm: flex-col  sm: items-start">
            <p className="font-bold m-0 text-base md:text-lg">{partnerTrackingNumber}</p>
            <span className="text-gray-500 text-sm">(трек номер партнера)</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="flex gap-3 md:col-span-2">
              <img src={icCalendar} alt="Calendar icon" className="w-5 h-5" />
              <div className="flex flex-col gap-0.5 text-sm ">
                <span className="font-medium">{dayjs(createdAt).format('DD.MM.YYYY')}</span>
                <span className="text-gray-600">{dayjs(createdAt).format('HH:mm:ss')}</span>
              </div>
            </div>

            <div className="flex gap-3 md:col-span-5 md:flex-row sm: flex-col">
              <p className="m-0 text-base whitespace-nowrap">Отправитель:</p>
              <div className="flex items-center gap-2">
                <img src={icUser} alt="User icon" className="w-5 h-5" />
                <p className="m-0 font-bold text-base">{senderFullName}</p>
              </div>
            </div>

            <div className="flex justify-between md:justify-end gap-4 md:col-span-5 md:flex-row sm: flex-col lg:items-center">
              {isPaid && (
                <div className="flex items-center gap-2">
                  <img src={icBanknote} alt="Banknote icon" className="w-8 h-8 md:w-9 md:h-9" />

                  {partnerStickerReceived && (
                    <a
                      href="#"
                      className="p-2 rounded-lg hover:bg-amber-100 transition-colors hover:scale-110 duration-300"
                    >
                      <StickyNote color="#6b6b6b" strokeWidth={3} size={24} />
                    </a>
                  )}

                  <a
                    href="#"
                    className="p-2 rounded-lg hover:bg-amber-100 transition-colors hover:scale-110 duration-300"
                  >
                    <Barcode color="#6b6b6b" strokeWidth={3} size={24} />
                  </a>
                </div>
              )}

              <div className="flex gap-2 items-center">
                <img src={icWeight} alt="Weight icon" className="w-5 h-5" />
                <p className="m-0 text-base md:text-lg font-bold whitespace-nowrap">
                  Вес: {weight} кг
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="hidden md:block md:col-span-2"></div>

            <div className="flex gap-3 md:col-span-5 md:flex-row sm: flex-col">
              <p className="m-0 text-base whitespace-nowrap">Получатель:</p>
              <div className="flex items-center gap-2">
                <img src={icUser} alt="User icon" className="w-5 h-5" />
                <p className="m-0 font-bold text-base">{recipientFullName}</p>
              </div>
            </div>

            <div className="flex justify-between md:justify-end gap-4 md:col-span-5 md:flex-row sm: flex-col ml-7">
              <div className="flex items-center gap-2 ">
                <img src={icPhone} alt="Phone icon" className="w-5 h-5" />
                <p className="m-0 font-bold text-base md:text-lg">{recipientPhoneNumber}</p>
              </div>

              <button
                onClick={() => {
                  navigate(`/parcels/${_id}`);
                }}
                className="p-2 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer duration-300 self-start"
              >
                <Ellipsis color="#6b6b6b" strokeWidth={3} size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelItem;
