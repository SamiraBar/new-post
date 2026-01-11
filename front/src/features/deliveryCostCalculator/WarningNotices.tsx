import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WarningNotices = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 mt-10 text-sm md:text-base px-1 sm:px-5">
      <div className="p-5 border border-orange-400 rounded-lg shadow-lg flex gap-2 items-center bg-orange-50">
        <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 shrink-0" color="orange" />
        <div>
          <p className="whitespace-pre-line">
            {t('deliveryCostCalculator.WarningNotices.warningDelivery')}
          </p>
        </div>
      </div>

      <div className="p-5 border border-orange-400 rounded-lg shadow-lg flex gap-2 items-center bg-orange-50">
        <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 shrink-0" color="orange" />
        <div>
          <p className="whitespace-pre-line">
            {t('deliveryCostCalculator.WarningNotices.warningWeight')}
          </p>
        </div>
      </div>

      <div className="p-5 border border-orange-400 rounded-lg shadow-lg flex gap-2 items-center bg-orange-50">
        <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" color="orange" />
        <div>
          <p className="whitespace-pre-line">
            {t('deliveryCostCalculator.WarningNotices.warningPrice')}
          </p>
        </div>
      </div>

      <div className="p-5 border border-orange-400 rounded-lg shadow-lg flex gap-2 items-center bg-orange-50">
        <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 shrink-0" color="orange" />
        <div>
          <p className="whitespace-pre-line">
            {t('deliveryCostCalculator.WarningNotices.warningParam')}
          </p>
        </div>
      </div>
    </div>
  );
};
