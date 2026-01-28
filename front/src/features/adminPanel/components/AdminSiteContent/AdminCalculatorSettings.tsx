import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Info, Calculator } from 'lucide-react';
import axiosApi from '@/axiosApi';
import { toast } from 'sonner';

type Lang = 'ru' | 'kg';

interface CalcLimits {
  maxWeightCourier: number;
  maxWeightPVZ: number;
  maxParcelValue: number;
}

interface CalcNotices {
  warningDelivery: string;
  warningWeight: string;
  warningPrice: string;
  warningParam: string;
}

interface Props {
  lang: Lang;
  calcLimits: CalcLimits;
  calcNotices: CalcNotices;
  origCalcLimits: CalcLimits;
  origCalcNotices: CalcNotices;
  onLimitsChange: (limits: CalcLimits) => void;
  onNoticesChange: (notices: CalcNotices) => void;
  onOrigLimitsChange: (limits: CalcLimits) => void;
  onOrigNoticesChange: (notices: CalcNotices) => void;
}

export interface AdminCalculatorSettingsRef {
  saveData: () => Promise<void>;
}

const AdminCalculatorSettings = forwardRef<AdminCalculatorSettingsRef, Props>(
  (
    {
      lang,
      calcLimits,
      calcNotices,
      onLimitsChange,
      onNoticesChange,
      onOrigLimitsChange,
      onOrigNoticesChange,
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(false);

    const loadCalculatorData = async (lng: Lang) => {
      setLoading(true);
      try {
        const { data } = await axiosApi.get(`/i18n-content/${lng}`);

        const limits = data.deliveryCostCalculator?.limits || {};
        const notices = data.deliveryCostCalculator?.WarningNotices || {};

        const limitsData: CalcLimits = {
          maxWeightCourier: Number(limits.maxWeightCourier) || 15,
          maxWeightPVZ: Number(limits.maxWeightPVZ) || 12,
          maxParcelValue: Number(limits.maxParcelValue) || 50000,
        };

        const noticesData: CalcNotices = {
          warningDelivery: String(notices.warningDelivery || ''),
          warningWeight: String(notices.warningWeight || ''),
          warningPrice: String(notices.warningPrice || ''),
          warningParam: String(notices.warningParam || ''),
        };

        onLimitsChange(limitsData);
        onNoticesChange(noticesData);

        onOrigLimitsChange(limitsData);
        onOrigNoticesChange(noticesData);
      } catch (error) {
        console.error('Ошибка загрузки данных калькулятора:', error);
        toast.error('Не удалось загрузить данные калькулятора');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      void loadCalculatorData(lang);
    }, [lang]);

    const saveData = async () => {
      const updates = {
        'deliveryCostCalculator.limits.maxWeightCourier': calcLimits.maxWeightCourier,
        'deliveryCostCalculator.limits.maxWeightPVZ': calcLimits.maxWeightPVZ,
        'deliveryCostCalculator.limits.maxParcelValue': calcLimits.maxParcelValue,
        'deliveryCostCalculator.WarningNotices.warningDelivery': calcNotices.warningDelivery,
        'deliveryCostCalculator.WarningNotices.warningWeight': calcNotices.warningWeight,
        'deliveryCostCalculator.WarningNotices.warningPrice': calcNotices.warningPrice,
        'deliveryCostCalculator.WarningNotices.warningParam': calcNotices.warningParam,
      };

      await axiosApi.patch(`/i18n-content/${lang}`, { updates });
    };

    useImperativeHandle(ref, () => ({
      saveData,
    }));

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card className="rounded-2xl border-2 border-amber-200 shadow-sm bg-amber-50/30">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Calculator className="h-5 w-5 text-amber-600" />
              Ограничения калькулятора
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base">
                  Макс. вес (Курьер) <span className="text-amber-600 font-bold">кг</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={calcLimits.maxWeightCourier}
                  onChange={(e) =>
                    onLimitsChange({ ...calcLimits, maxWeightCourier: Number(e.target.value) })
                  }
                  className="text-lg font-semibold mt-2"
                />
              </div>

              <div>
                <Label className="text-base">
                  Макс. вес (ПВЗ) <span className="text-amber-600 font-bold">кг</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={calcLimits.maxWeightPVZ}
                  onChange={(e) =>
                    onLimitsChange({ ...calcLimits, maxWeightPVZ: Number(e.target.value) })
                  }
                  className="text-lg font-semibold mt-2"
                />
              </div>

              <div>
                <Label className="text-base">
                  Макс. ценность <span className="text-amber-600 font-bold">сом</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={calcLimits.maxParcelValue}
                  onChange={(e) =>
                    onLimitsChange({ ...calcLimits, maxParcelValue: Number(e.target.value) })
                  }
                  className="text-lg font-semibold mt-2"
                />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Эти значения используются для валидации полей калькулятора. Убедитесь, что
                  обновили тексты уведомлений ниже после изменения этих значений.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Предупреждения калькулятора
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div>
              <Label className="text-base font-medium">1. Доступность доставки до двери</Label>
              <Textarea
                value={calcNotices.warningDelivery}
                onChange={(e) =>
                  onNoticesChange({ ...calcNotices, warningDelivery: e.target.value })
                }
                rows={3}
                className="mt-2"
                placeholder="Доставка «до двери» доступна не во всех городах..."
              />
            </div>

            <div>
              <Label className="text-base font-medium">2. Ограничения по весу</Label>
              <Textarea
                value={calcNotices.warningWeight}
                onChange={(e) => onNoticesChange({ ...calcNotices, warningWeight: e.target.value })}
                rows={3}
                className="mt-2"
                placeholder="Максимальный вес посылки: • При курьере - 15кг..."
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Не забудьте обновить значения <strong>{calcLimits.maxWeightCourier}кг</strong> и{' '}
                <strong>{calcLimits.maxWeightPVZ}кг</strong> в тексте
              </p>
            </div>

            <div>
              <Label className="text-base font-medium">3. Ограничения по ценности</Label>
              <Textarea
                value={calcNotices.warningPrice}
                onChange={(e) => onNoticesChange({ ...calcNotices, warningPrice: e.target.value })}
                rows={3}
                className="mt-2"
                placeholder="Максимальная ценность посылки - 50000 сом..."
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Не забудьте обновить значение <strong>{calcLimits.maxParcelValue} сом</strong> в
                тексте
              </p>
            </div>

            <div>
              <Label className="text-base font-medium">4. Ограничения по размерам</Label>
              <Textarea
                value={calcNotices.warningParam}
                onChange={(e) => onNoticesChange({ ...calcNotices, warningParam: e.target.value })}
                rows={3}
                className="mt-2"
                placeholder="Сумма всех сторон посылки не должна превышать 250 см..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

AdminCalculatorSettings.displayName = 'AdminCalculatorSettings';

export default AdminCalculatorSettings;
