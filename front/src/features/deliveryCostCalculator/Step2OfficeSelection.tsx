import { LoaderCircle, Map, MapPin, Phone } from 'lucide-react';
import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type UseFormReturn, useWatch } from 'react-hook-form';
import type { OrderFormData } from '@/lib/order.schema.ts';
import useOfficesStore from '@/stores/officesStore/officesStore.ts';

interface Props {
  form: UseFormReturn<OrderFormData>;
}

const Step2SenderOfficeSelection: FC<Props> = ({form}) => {
  const {t} = useTranslation();
  const {getOffices, offices, getOfficesLoading} = useOfficesStore();
  const {
    setValue,
  } = form;
  const [originOffice, originCity] = useWatch({
    control: form.control,
    name: ['originOffice', 'originCity'],
  });
  const isOfficeSelected = !!originOffice;

  const handleOfficeSelect = (officeId: string) => {
    const selectedOffice = offices.find((o) => o._id === officeId);

    if (!selectedOffice) {
      console.error(`Office with id ${officeId} not found`);
      return;
    }
    setValue('originOffice', officeId);
  };

  useEffect(() => {
    void getOffices(originCity);
  }, [getOffices, originCity]);

  const cardBase =
    'p-6 border-2 rounded-lg transition-all duration-300 text-left relative focus:outline-none focus:ring-2';

  const cardSelected =
    'border-orange-500 bg-linear-to-br from-orange-50 to-orange-100 shadow-xl ring-orange-200';

  const cardDefault =
    'border-gray-300 bg-white hover:shadow-lg hover:border-orange-300 hover:scale-[1.02]';

  return (
    <div className="w-full pt-5">
      <div className="flex items-center justify-center gap-2 mb-6">
        <h3 className="text-2xl font-bold text-center">
          {t('deliveryCostCalculator.stepTwoForm.title')}
        </h3>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <span className="font-medium">{t('deliveryCostCalculator.stepTwoForm.spanOne')}</span>
          {t('deliveryCostCalculator.stepTwoForm.spanTwo')}
        </p>
      </div>

      {getOfficesLoading && (
        <div className="flex justify-center py-10">
          <LoaderCircle className="animate-spin text-brand h-12 w-12" />
        </div>
      )}

      {!getOfficesLoading && offices.length === 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="rounded-full bg-orange-50 p-6 mb-4">
            <MapPin className="h-12 w-12 text-orange-300" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t('deliveryCostCalculator.stepTwoForm.notFound')}
          </h3>
          <p className="text-sm text-gray-600 max-w-md">
            {t('deliveryCostCalculator.stepTwoForm.noOfficesDescription')}
          </p>
        </div>
      )}

      {!getOfficesLoading && offices.length > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5"
          role="radiogroup"
        >
          {offices.map((office) => {
            const isSelected = originOffice === office._id;

            return (
              <div
                key={office._id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleOfficeSelect(office._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOfficeSelect(office._id);
                  }
                }}
                className={`${cardBase} cursor-pointer group ${
                  isSelected ? cardSelected : cardDefault
                } relative transition-all`}
              >
                <div className="flex flex-col h-full gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={20}
                        className={isSelected ? 'text-orange-500' : 'text-gray-400'}
                      />
                      <h4 className="font-bold text-lg">{office.label}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(office.mapUrl, '_blank');
                      }}
                      className="flex items-center gap-1 text-xs hover:text-blue-700 font-medium p-1 rounded hover:bg-blue-50 transition-colors"
                      aria-label="Open map"
                    >
                      <Map className="text-blue-600" />
                    </button>
                  </div>

                  {office.name && (
                    <p className="not-italic text-sm text-gray-600">
                      <span className="font-medium">{t('deliveryCostCalculator.stepTwoForm.name')}:</span> {office.name}
                    </p>
                  )}

                  <div className="not-italic text-sm text-gray-600">
                    <span className="font-medium">{t('deliveryCostCalculator.stepTwoForm.address')}:</span> {office.address}
                  </div>

                  <a
                    href={`tel:${office.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 w-fit mt-1"
                  >
                    <Phone size={14} />
                    {office.phone}
                  </a>

                  <p className="text-sm text-gray-500 mt-1">
                    {t('deliveryCostCalculator.stepTwoForm.schedule')}: {office.worktime}
                  </p>

                  <div
                    className={`mt-auto pt-3 text-sm font-medium flex items-center gap-2 ${
                      isSelected ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-orange-500' : 'bg-gray-300'}`} />
                    {isSelected
                      ? t('deliveryCostCalculator.stepTwoForm.checkSelected')
                      : t('deliveryCostCalculator.stepTwoForm.checkSelect')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isOfficeSelected && (
        <div className="mt-4 mx-5 p-3 bg-amber-50 border border-amber-300 rounded-lg">
          <p className="text-amber-700 text-sm font-medium">
            ⚠️ {t('deliveryCostCalculator.stepTwoForm.warning')}
          </p>
        </div>
      )}
    </div>
  );
};

export default Step2SenderOfficeSelection;
