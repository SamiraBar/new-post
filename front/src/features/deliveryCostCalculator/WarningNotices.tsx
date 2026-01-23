import { useTranslation } from 'react-i18next';

export const WarningNotices = () => {
  const { t } = useTranslation();

  const warnings = [
    {
      key: 'warningDelivery',
      text: t('deliveryCostCalculator.WarningNotices.warningDelivery'),
      icon: '⚠️',
    },
    {
      key: 'warningWeight',
      text: t('deliveryCostCalculator.WarningNotices.warningWeight'),
      icon: '⚖️',
    },
    {
      key: 'warningPrice',
      text: t('deliveryCostCalculator.WarningNotices.warningPrice'),
      icon: '💰',
    },
    {
      key: 'warningParam',
      text: t('deliveryCostCalculator.WarningNotices.warningParam'),
      icon: '📏',
    },
  ];

  const formatTextWithBold = (text: string) => {
    const parts = text.split(/(\d+\s*(?:кг|сом|см|шт)\.?)/gi);

    return parts.map((part, index) => {
      if (/\d+\s*(?:кг|сом|см|шт)\.?/i.test(part)) {
        return (
          <strong key={index} className="font-bold text-gray-900">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col gap-5 mt-10 px-1 sm:px-5">
      {warnings.map((warning) => (
        <div
          key={warning.key}
          className="p-5 border-2 border-orange-400 rounded-xl shadow-lg flex gap-3 items-start bg-orange-50 hover:shadow-xl transition-shadow"
        >
          <span className="text-2xl shrink-0 mt-0.5">{warning.icon}</span>
          <div className="flex-1">
            <p className="whitespace-pre-line text-base md:text-lg leading-relaxed text-gray-800">
              {formatTextWithBold(warning.text)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WarningNotices;
