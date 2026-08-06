import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import axiosApi from '@/axiosApi';

type Lang = 'ru' | 'kg';

interface CalcLimits {
  maxWeightCourier: number;
  maxWeightPVZ: number;
  maxParcelValue: number;
  minParcelValue: number;
}

interface CalcNotices {
  warningDelivery: string;
  warningWeight: string;
  warningPrice: string;
  warningParam: string;
}

interface Props {
  lang: Lang;
  calcLimits?: CalcLimits;
  calcNotices?: CalcNotices;
}

const CalculatorPreview = ({ lang, calcLimits: propLimits, calcNotices: propNotices }: Props) => {
  const [calcLimits, setCalcLimits] = useState<CalcLimits>({
    maxWeightCourier: 15,
    maxWeightPVZ: 12,
    maxParcelValue: 50000,
    minParcelValue: 1000,
  });

  const [calcNotices, setCalcNotices] = useState<CalcNotices>({
    warningDelivery: '',
    warningWeight: '',
    warningPrice: '',
    warningParam: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propLimits && propNotices) {
      setCalcLimits(propLimits);
      setCalcNotices(propNotices);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosApi.get(`/i18n-content/${lang}`);
        const limits = data.deliveryCostCalculator?.limits || {};
        const notices = data.deliveryCostCalculator?.WarningNotices || {};

        setCalcLimits({
          maxWeightCourier: Number(limits.maxWeightCourier) || 15,
          maxWeightPVZ: Number(limits.maxWeightPVZ) || 12,
          maxParcelValue: Number(limits.maxParcelValue) || 50000,
          minParcelValue: Number(limits.minParcelValue) || 1000,
        });

        setCalcNotices({
          warningDelivery: String(notices.warningDelivery || ''),
          warningWeight: String(notices.warningWeight || ''),
          warningPrice: String(notices.warningPrice || ''),
          warningParam: String(notices.warningParam || ''),
        });
      } catch (error) {
        console.error('Ошибка загрузки предпросмотра:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [lang, propLimits, propNotices]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const warnings = [
    {
      key: 'warningDelivery',
      text: calcNotices.warningDelivery,
      icon: '⚠️',
    },
    {
      key: 'warningWeight',
      text: calcNotices.warningWeight,
      icon: '⚖️',
    },
    {
      key: 'warningPrice',
      text: calcNotices.warningPrice,
      icon: '💰',
    },
    {
      key: 'warningParam',
      text: calcNotices.warningParam,
      icon: '📏',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Предпросмотр калькулятора (Шаг 1)</h2>
        <p className="text-sm text-gray-600">Язык: {lang.toUpperCase()}</p>
      </div>

      <Card className="rounded-2xl border-2 border-amber-200 shadow-sm bg-amber-50/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🧮</span>
            Текущие ограничения калькулятора
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <p className="text-gray-600 text-xs mb-1">Макс. вес (Курьер)</p>
              <p className="text-xl font-bold text-amber-600">{calcLimits.maxWeightCourier} кг</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <p className="text-gray-600 text-xs mb-1">Макс. вес (ПВЗ)</p>
              <p className="text-xl font-bold text-amber-600">{calcLimits.maxWeightPVZ} кг</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <p className="text-gray-600 text-xs mb-1">Макс. ценность</p>
              <p className="text-xl font-bold text-amber-600">{calcLimits.maxParcelValue} сом</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <p className="text-gray-600 text-xs mb-1">Мин. ценность</p>
              <p className="text-xl font-bold text-amber-600">{calcLimits.minParcelValue} сом</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          Уведомления для пользователей
        </h3>
        <div className="flex flex-col gap-5">
          {warnings.map((warning) => (
            <div
              key={warning.key}
              className="p-5 border-2 border-orange-400 rounded-xl shadow-lg flex gap-3 items-start bg-orange-50 hover:shadow-xl transition-shadow"
            >
              <span className="text-2xl shrink-0 mt-0.5">{warning.icon}</span>
              <div className="flex-1">
                <p className="whitespace-pre-line text-base md:text-lg leading-relaxed text-gray-800">
                  {formatTextWithBold(warning.text || 'Текст не указан')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-lg shrink-0">ℹ️</span>
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Как это отображается пользователям:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Уведомления показываются на первом шаге калькулятора</li>
              <li>Числа автоматически выделяются жирным шрифтом</li>
              <li>Валидация полей использует значения из "Ограничения калькулятора"</li>
              <li>При смене языка (RU/KG) тексты обновляются автоматически</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPreview;
