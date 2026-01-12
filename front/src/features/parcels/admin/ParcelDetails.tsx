import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Boxes,
  Copy,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  UserRoundSearch,
  Weight,
  Building2,
  Clock,
  CreditCard,
  Banknote,
  Store,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import ParcelStatus from '@/features/parcels/admin/ParcelStatus';
import useParcelsStore from '../../../stores/parcelsStore/parcelsStore.ts';
import ParcelItem from '@/features/parcels/ParcelItem.tsx';
import { toast } from 'sonner';
import PartnerTrackingRow from '../PartnerTrackingRow.tsx';

const ParcelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { parcel, getParcelById, getParcelLoading, getParcelError, editParcelStatusError } =
    useParcelsStore();

  useEffect(() => {
    if (id) getParcelById(id);
  }, [id, getParcelById]);

  if (getParcelLoading) return <p>Загрузка...</p>;
  if (getParcelError) return <p>Ошибка: {getParcelError.error}</p>;
  if (!parcel) return <p>Посылка не найдена</p>;
  if (editParcelStatusError) toast(editParcelStatusError);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white space-y-10 text-[15px] text-gray-900">
      <ParcelItem parcel={parcel} />
      <Link
        to="/admin"
        className="text-gray-600 hover:text-black transition flex items-center gap-1 text-sm font-semibold"
      >
        <ArrowLeft size={16} />
        <span>список посылок</span>
      </Link>
      <div className="mt-10">
        <ParcelStatus
          parcelId={parcel._id}
          status={parcel.status}
          trackingNumber={parcel.trackingNumber}
          draftedAt={parcel.draftedAt}
          createdAt={parcel.createdAt}
          acceptedAt={parcel.acceptedAt}
          shippedAt={parcel.shippedAt}
        />
      </div>

      <Card className="border-gray-300 rounded-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 border-b md:border-b-0 md:border-r border-gray-300">
            <div className="divide-y divide-gray-200">
              {[
                ['Трек Номер Новая Почта', parcel.trackingNumber],
                ['Дата создания', new Date(parcel.draftedAt).toLocaleString()],
                ['Дата оплаты', parcel.isPaid ? 'Оплачено' : 'Не оплачено'],
                ...(parcel.deliveryType === 'pickup' ? [['РЦ', parcel.serviceCity]] : []),
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-3 sm:px-4 py-2.5"
                >
                  <span className="text-sm text-gray-700 whitespace-nowrap">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-gray-100 border border-gray-300 px-2 sm:px-3 py-1 rounded text-gray-800 text-xs sm:text-sm break-all max-w-[180px] sm:max-w-none text-right">
                      {value}
                    </span>
                    <Copy size={14} className="text-gray-500 cursor-pointer shrink-0" />
                  </div>
                </div>
              ))}
              <PartnerTrackingRow parcel={parcel} />
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-center px-3 sm:px-6 py-3 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Boxes size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="uppercase text-xs sm:text-sm font-medium">КОЛ-ВО МЕСТ</span>
              </div>
              <span className="font-bold text-gray-900 text-base sm:text-lg">1</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Weight size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="uppercase text-xs sm:text-sm font-medium">ВЕС, КГ.</span>
              </div>
              <span className="font-bold text-gray-900 text-base sm:text-lg">{parcel.weight}</span>
            </div>
          </div>
        </div>
      </Card>
      {parcel.pvzData && (
        <Card className="border-orange-300 rounded-md overflow-hidden bg-orange-50/30">
          <div className="bg-orange-500 text-white px-4 py-2 flex items-center gap-2">
            <Building2 size={20} />
            <h3 className="font-bold text-base uppercase tracking-wide">
              Пункт выдачи заказов (ПВЗ)
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Название</p>
                  <div className="flex items-start gap-2">
                    <Store className="text-orange-600 mt-0.5 flex-shrink-0" size={18} />
                    <p className="font-semibold text-gray-900">{parcel.pvzData.name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Адрес</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="text-orange-600 mt-0.5 flex-shrink-0" size={18} />
                    <p className="text-gray-800">{parcel.pvzData.address}</p>
                  </div>
                </div>

                {parcel.pvzData.phone && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Телефон</p>
                    <div className="flex items-center gap-2">
                      <Phone className="text-orange-600 flex-shrink-0" size={18} />
                      <p className="text-gray-800">{parcel.pvzData.phone}</p>
                    </div>
                  </div>
                )}

                {parcel.pvzData.worktime && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Режим работы</p>
                    <div className="flex items-start gap-2">
                      <Clock className="text-orange-600 mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-gray-800">{parcel.pvzData.worktime}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {parcel.pvzData.parentname && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Компания</p>
                    <p className="font-medium text-gray-900">{parcel.pvzData.parentname}</p>
                  </div>
                )}

                {parcel.pvzData.town && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Город / Регион</p>
                    <p className="text-gray-800">
                      {parcel.pvzData.town}
                      {parcel.pvzData.region && `, ${parcel.pvzData.region}`}
                    </p>
                  </div>
                )}

                {parcel.pvzData.maxweight && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Максимальный вес</p>
                    <p className="text-gray-800">{parcel.pvzData.maxweight} кг</p>
                  </div>
                )}

                {(parcel.pvzData.acceptcash === 1 || parcel.pvzData.acceptcard === 1) && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-2">Способы оплаты</p>
                    <div className="flex flex-wrap gap-2">
                      {parcel.pvzData.acceptcash === 1 && (
                        <div className="flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1.5 rounded-md border border-green-300">
                          <Banknote size={16} />
                          <span className="text-sm font-medium">Наличные</span>
                        </div>
                      )}
                      {parcel.pvzData.acceptcard === 1 && (
                        <div className="flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md border border-blue-300">
                          <CreditCard size={16} />
                          <span className="text-sm font-medium">Карта</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-md p-3 border border-gray-300">
                  <p className="text-xs text-gray-500 uppercase mb-1">Код ПВЗ</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-orange-600 text-lg">
                      #{parcel.pvzData.code}
                    </p>
                    <Copy size={16} className="text-gray-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="border-gray-300 rounded-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-300">
          <div className="p-6">
            <h3 className="font-extrabold text-lg uppercase mb-5 text-center tracking-wide">
              ОТПРАВИТЕЛЬ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="text-gray-600" size={18} />
                <span>{parcel.sender.fullName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-600" size={18} />
                <span>{parcel.sender.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-600" size={18} />
                <span>{parcel.sender.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-600" size={18} />
                <span>{parcel.sender.addressName || parcel.sender.address || 'Адрес не указан'}</span>
              </div>
              <div className="flex items-center gap-3">
                <UserRoundSearch className="text-gray-600" size={18} />
                <span>{parcel.sender.inn_passport || 'ИНН не указан'}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-3 mt-4">
                <div>
                  <p className="text-sm text-gray-500">объявленная стоимость</p>
                  <p className="font-bold text-gray-900 text-lg">1000.00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">сумма к оплате</p>
                  <p className="font-bold text-gray-900 text-lg">
                    {parcel.isPaid ? '1205.60' : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-extrabold text-lg uppercase mb-5 text-center tracking-wide">
              ПОЛУЧАТЕЛЬ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="text-gray-600" size={18} />
                <span>{parcel.recipient.fullName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-600" size={18} />
                <span>{parcel.recipient.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-600" size={18} />
                <span>{parcel.recipient.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-600" size={18} />
                <span>{parcel.recipient.address || 'Адрес не указан'}</span>
              </div>

              {parcel.description && (
                <div className="bg-gray-100 rounded-md mt-4 p-4 flex items-start gap-3">
                  <Package className="text-gray-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Вложение посылки</p>
                    <p className="text-gray-700">{parcel.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ParcelDetails;
