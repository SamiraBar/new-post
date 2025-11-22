import { Button } from '@/components/ui/button';
import { Search, X, Package, MapPin, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTrackingStore } from '@/stores/trackingStore/trackingStore';
import { useTranslation } from 'react-i18next';

const TrackingSearch = () => {
  const { t } = useTranslation();

  const {
    trackNumber,
    parcelInfo,
    isModalOpen,
    isLoading,
    setTrackNumber,
    searchParcel,
    closeModal,
  } = useTrackingStore();

  const handleSearch = () => {
    searchParcel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="space-y-4 text-center">
        <div className="flex gap-0 w-full max-w-80 sm:max-w-96 md:max-w-110 mx-auto">
          <input
            type="text"
            placeholder="Трек-номер..."
            value={trackNumber}
            onChange={(e) => setTrackNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 p-2 rounded-l-xl border-2 border-orange-500 border-r-0
             focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
             transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-orange-500 text-white border-2 border-orange-500 rounded-l-none rounded-r-xl
                hover:bg-orange-400 hover:border-orange-500
                active:scale-95 active:shadow-lg active:bg-orange-500 transition-all duration-200 h-11 shadow-md hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Search className="w-8 h-8" />
            )}
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className=" max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 m-1 sm:m-0 w-[calc(100%-2rem)] sm:w-full">
          <DialogHeader className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-t-lg z-10 sm:p-6 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8" />
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {t('deliveryCalculation.trackingSearch.status')}
                  </DialogTitle>
                  <p className="text-orange-100 text-sm font-mono mt-1">
                    {parcelInfo?.trackNumber}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="hover:bg-white/20 text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          {parcelInfo && (
            <div className="p-6 space-y-6">
              <div
                className={`p-4 rounded-xl border-2 ${
                  parcelInfo.isDelivered
                    ? 'bg-green-50 border-green-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`w-6 h-6 ${
                      parcelInfo.isDelivered ? 'text-green-600' : 'text-blue-600'
                    }`}
                  />
                  <div>
                    <p className="text-sm text-gray-600">
                      {t('deliveryCalculation.trackingSearch.currentStatus')}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        parcelInfo.isDelivered ? 'text-green-700' : 'text-blue-700'
                      }`}
                    >
                      {parcelInfo.currentStatus}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        {t('deliveryCalculation.trackingSearch.departurePoint')}
                      </p>
                      <p className="font-bold text-gray-800">{parcelInfo.sender.location}</p>
                      <p className="text-sm text-gray-600 mt-1">{parcelInfo.sender.address}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        {t('deliveryCalculation.trackingSearch.pickUpPoint')}
                      </p>
                      <p className="font-bold text-gray-800">{parcelInfo.recipient.location}</p>
                      <p className="text-sm text-gray-600 mt-1">{parcelInfo.recipient.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  {t('deliveryCalculation.trackingSearch.history')}
                </h3>

                <div className="relative">
                  <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-green-500"></div>

                  <div className="space-y-4">
                    {parcelInfo.statuses.map((status, index) => {
                      const isLast = index === parcelInfo.statuses.length - 1;
                      const isFirst = index === 0;

                      return (
                        <div key={index} className="relative pl-12">
                          <div
                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 ${
                              isLast
                                ? 'bg-green-500 border-green-200 animate-pulse shadow-lg shadow-green-500/50'
                                : isFirst
                                  ? 'bg-orange-500 border-orange-200'
                                  : 'bg-orange-400 border-orange-100'
                            } flex items-center justify-center`}
                          >
                            {isLast && <CheckCircle2 className="w-5 h-5 text-white" />}
                          </div>

                          <div
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isLast
                                ? 'bg-green-50 border-green-300 shadow-lg animate-pulse'
                                : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <p
                                  className={`font-bold ${
                                    isLast ? 'text-green-700' : 'text-gray-800'
                                  }`}
                                >
                                  {status.status}
                                </p>
                                {status.location && (
                                  <p className="text-sm text-gray-600 mt-1">📍 {status.location}</p>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 sm:text-right">
                                <p className="font-semibold">{status.date}</p>
                                {status.time && <p className="text-gray-500">{status.time}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrackingSearch;
