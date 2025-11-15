import { useEffect, useMemo } from 'react';
import ParcelItem from './ParcelItem';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Package, XCircle } from 'lucide-react';

interface Props {
  searchFilters: {
    trackingNumber: string;
    sender: string;
    recipient: string;
  };
}

const ParcelsList = ({ searchFilters }: Props) => {
  const { parcels, getParcels, getParcelsLoading, getParcelsError } = useParcelsStore();

  useEffect(() => {
    getParcels();
  }, [getParcels]);

  const filteredParcels = useMemo(() => {
    if (!parcels) return [];

    return parcels.filter((parcel) => {
      const trackNumberMatch = searchFilters.trackingNumber
        ? parcel.trackingNumber?.toLowerCase().includes(searchFilters.trackingNumber.toLowerCase())
        : true;

      const senderMatch = searchFilters.sender
        ? parcel.sender.fullName.toLowerCase().includes(searchFilters.sender.toLowerCase())
        : true;

      const receiverMatch = searchFilters.recipient
        ? parcel.recipient.fullName.toLowerCase().includes(searchFilters.recipient.toLowerCase())
        : true;

      return trackNumberMatch && senderMatch && receiverMatch;
    });
  }, [parcels, searchFilters]);

  if (getParcelsLoading) return <p>Загрузка...</p>;

  if (getParcelsError) {
    return (
      <div className="container flex justify-center py-8">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <XCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-900">Ошибка загрузки</AlertTitle>
          <AlertDescription className="text-red-700">
            {getParcelsError.error ||
              'Не удалось загрузить список посылок. Попробуйте обновить страницу.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!parcels) {
    return (
      <div className="container flex justify-center py-8">
        <Alert className="max-w-md border-orange-200 bg-orange-50">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-900">Проблема с данными</AlertTitle>
          <AlertDescription className="text-orange-700">
            Произошла ошибка при получении данных. Пожалуйста, обновите страницу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (parcels.length === 0) {
    return (
      <div className="container flex justify-center py-8">
        <Alert className="max-w-md border-gray-200 bg-gray-50">
          <Package className="h-5 w-5 text-gray-600" />
          <AlertTitle className="text-gray-900">Посылок нет</AlertTitle>
          <AlertDescription className="text-gray-700">
            В системе пока нет ни одной посылки.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (filteredParcels.length === 0)
    return (
      <div className="container flex justify-center py-8">
        <Alert className="max-w-md border-amber-200 bg-amber-50">
          <Package className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-900">Посылки не найдены</AlertTitle>
          <AlertDescription className="text-amber-700">
            По вашему запросу посылки не обнаружены. Попробуйте изменить параметры поиска.
          </AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="container flex flex-col gap-6">
      {filteredParcels.map((parcel) => {
        return <ParcelItem key={parcel._id} parcel={parcel} />;
      })}
    </div>
  );
};

export default ParcelsList;
