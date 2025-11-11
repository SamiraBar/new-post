// import useParcelsStore from '@/stores/parcelsStore/parcelsStore';
// import { useEffect } from 'react';
import ParcelItem from './ParcelItem';
import type { IParcel } from '@/types';

const ParcelsList = () => {
  //! После того как бекенд появиться, удалим тестовые данные и закоментированные данные раскоментируем
  // const { parcels, getParcels, getParcelsLoading, getParcelsError } = useParcelsStore();

  const testParcels: IParcel[] = [
    {
      _id: 'testParcelId',
      trackingNumber: 'KGZ-312-SLFKDJEWSL',
      partnerTrackingNumber: '№LSDFKJEWXOXS',
      senderFullName: 'Иванов Петр Сергеевич',
      recipientFullName: 'Сидоров Женя Александрович',
      recipientPhoneNumber: '+996 700 234 412',
      originCity: 'Бишкек',
      destinationCity: 'Москва',
      status: 'Создан',
      createdAt: '2025-09-11T10:16:37.775Z',
      isPaid: false,
      partnerStickerReceived: false,
      weight: 0.6,
    },
    {
      _id: 'testParcelId2',
      trackingNumber: 'KGZ-478-QWERTYUIOP',
      partnerTrackingNumber: '№PLKJHGFDSA',
      senderFullName: 'Калиев Арсен Нурланович',
      recipientFullName: 'Петрова Алина Дмитриевна',
      recipientPhoneNumber: '+996 557 890 223',
      originCity: 'Ош',
      destinationCity: 'Санкт-Петербург',
      status: 'В пути',
      createdAt: '2025-09-13T14:22:10.123Z',
      isPaid: true,
      partnerStickerReceived: true,
      weight: 1.25,
    },
    {
      _id: 'testParcelId3',
      trackingNumber: 'KGZ-999-ASDFGHJKL',
      partnerTrackingNumber: '№ZXCVBNM123',
      senderFullName: 'Ахметов Данияр Рустамович',
      recipientFullName: 'Иванова Татьяна Сергеевна',
      recipientPhoneNumber: '+996 771 543 678',
      originCity: 'Кара-Балта',
      destinationCity: 'Алматы',
      status: 'Доставлен',
      createdAt: '2025-09-15T09:45:00.000Z',
      isPaid: true,
      partnerStickerReceived: false,
      weight: 3.8,
    },
  ];

  // useEffect(() => {
  //   getParcels();
  // }, [getParcels]);

  // if (getParcelsLoading) return <p>Загрузка...</p>;
  // if (getParcelsError) return <p>Ошибка: {getParcelsError.error}</p>;
  // if (!parcels) return null;
  // if (parcels.length === 0) return <p>Посылок нет</p>;
  return (
    <div className="container flex flex-col gap-6">
      {testParcels.map((parcel) => {
        return <ParcelItem key={parcel._id} parcel={parcel} />;
      })}
    </div>
  );
};

export default ParcelsList;
