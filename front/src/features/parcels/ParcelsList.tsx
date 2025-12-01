import { useEffect } from 'react';
import ParcelItem from './ParcelItem';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Package, Search, XCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

const ParcelsList = () => {
  const {
    parcels,
    parcelsResponse,
    getParcels,
    getParcelsLoading,
    getParcelsError,
    searchFilters,
  } = useParcelsStore();
  const notFound = parcelsResponse && parcelsResponse.parcels.length === 0

  useEffect(() => {
    if (!parcels || parcels.length === 0) {
      void getParcels(1);
    }
  }, [getParcels, parcels]);

  const handleLoadMore = () => {
    if (parcelsResponse?.currentPage && !getParcelsLoading) {
      void getParcels(parcelsResponse.currentPage + 1);
    }
  };

  const isSearchActive =
    searchFilters.trackingNumber || searchFilters.sender || searchFilters.recipient;

  const hasMore = parcelsResponse?.hasMore ?? false;

  if (getParcelsLoading && (!parcels || parcels.length === 0)) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="relative">
          <Package className="h-16 w-16 text-gray-300 animate-pulse" />
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-600 mt-4 font-medium">Загрузка посылок...</p>
      </div>
    );
  }

  if (getParcelsError && (!parcels || parcels.length === 0)) {
    return (
      <div className="container flex justify-center py-12">
        <Alert className="max-w-md border-red-200 bg-linear-to-br from-red-50 to-red-100/50 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <AlertTitle className="text-red-900 font-semibold mb-1">Ошибка загрузки</AlertTitle>
              <AlertDescription className="text-red-700">
                {getParcelsError.error ||
                  'Не удалось загрузить список посылок. Попробуйте обновить страницу.'}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container flex justify-center py-12">
        <Alert className="max-w-md border-gray-200 bg-linear-to-br from-gray-50 to-gray-100/50 shadow-lg">
          <div className="flex items-start gap-3">
            {isSearchActive ? (
              <>
                <div className="bg-gray-100 p-2 rounded-full">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <AlertTitle className="text-gray-900 font-semibold mb-1">
                    Ничего не найдено
                  </AlertTitle>
                  <AlertDescription className="text-gray-700">
                    По вашему запросу посылок не найдено. Попробуйте изменить параметры поиска.
                  </AlertDescription>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-100 p-2 rounded-full">
                  <Package className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <AlertTitle className="text-gray-900 font-semibold mb-1">Посылок нет</AlertTitle>
                  <AlertDescription className="text-gray-700">
                    В системе пока нет ни одной посылки.
                  </AlertDescription>
                </div>
              </>
            )}
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-linear-to-br from-gray-50 to-gray-100/30">
      <div className="px-6 py-2.5 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Управление посылками</h2>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <p className="text-xs text-blue-600 font-medium">Всего:</p>
            <p className="text-lg font-bold text-blue-700">{parcelsResponse?.total || 0}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="space-y-2 pb-6">
          {parcels?.map((parcel) => (
            <ParcelItem key={parcel._id} parcel={parcel} />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-6 mb-4">
            <button
              onClick={handleLoadMore}
              disabled={getParcelsLoading}
              className="group relative px-8 py-3 bg-white text-gray-700 rounded-xl
                       hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50
                       border-2 border-gray-200 hover:border-blue-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 font-medium shadow-md hover:shadow-xl
                       min-w-[180px] overflow-hidden"
            >
              <span className="absolute inset-0 bg-linear-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              {getParcelsLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-blue-600">Загрузка...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Package className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                  <span className="group-hover:text-blue-600 transition-colors">Загрузить ещё</span>
                </span>
              )}
            </button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ParcelsList;
