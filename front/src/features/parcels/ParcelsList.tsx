import { useEffect } from 'react';
import ParcelItem from './ParcelItem';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore';

const ParcelsList = () => {
  const { parcels, getParcels, getParcelsLoading, getParcelsError } = useParcelsStore();

  useEffect(() => {
    getParcels();
  }, [getParcels]);

  if (getParcelsLoading) return <p>Загрузка...</p>;
  if (getParcelsError) return <p>Ошибка: {getParcelsError.error}</p>;
  if (!parcels) return <div>Some error</div>;
  if (parcels.length === 0) return <p>Посылок нет</p>;

  return (
    <div className="container flex flex-col gap-6">
      {parcels.map((parcel) => {
        return <ParcelItem key={parcel._id} parcel={parcel} />;
      })}
    </div>
  );
};

export default ParcelsList;
