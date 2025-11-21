import { useEffect } from 'react';
import ParcelItem from './ParcelItem';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore';

const ParcelsList = () => {
  const {
    parcels,
    parcelsResponse,
    getParcels,
    getParcelsLoading,
    getParcelsError
  } = useParcelsStore();

  useEffect(() => {
    if (!parcels || parcels.length === 0) {
      void getParcels(1);
    }
  }, []);

  const handleLoadMore = () => {
    if (parcelsResponse?.currentPage && !getParcelsLoading) {
      void getParcels(parcelsResponse.currentPage + 1);
    }
  };

  if (getParcelsLoading && (!parcels || parcels.length === 0)) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  if (getParcelsError && (!parcels || parcels.length === 0)) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-red-600">Ошибка: {getParcelsError.error}</p>
      </div>
    );
  }

  if (!parcels || parcels.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600">Посылок нет</p>
      </div>
    );
  }

  const hasMore = parcelsResponse?.hasMore ?? false;

  return (
    <div className="h-[calc(100vh-170px)] flex flex-col bg-gray-50">
      <div className="pb-2  border-b bg-white sticky top-0 z-20">
        <p className="text-gray-600">Управление и отслеживание посылок</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {parcels.map((parcel) => (
          <ParcelItem key={parcel._id} parcel={parcel} />
        ))}

        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              disabled={getParcelsLoading}
              className="px-8 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50
                       border-2 border-gray-200 disabled:opacity-50
                       disabled:cursor-not-allowed transition-all duration-200
                       font-medium shadow-sm hover:shadow min-w-[160px]"
            >
              {getParcelsLoading ? (
                <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </span>
              ) : (
                'Загрузить еще'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

};

export default ParcelsList;