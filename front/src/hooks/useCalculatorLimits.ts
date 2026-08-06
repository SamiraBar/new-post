import { useEffect, useState } from 'react';
import axiosApi from '@/axiosApi';

interface CalcLimits {
  maxWeightCourier: number;
  maxWeightPVZ: number;
  maxParcelValue: number;
  minParcelValue: number;
}

const DEFAULT_LIMITS: CalcLimits = {
  maxWeightCourier: 15,
  maxWeightPVZ: 12,
  maxParcelValue: 50000,
  minParcelValue: 1000
};

export const useCalculatorLimits = () => {
  const [limits, setLimits] = useState<CalcLimits>(DEFAULT_LIMITS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const { data } = await axiosApi.get<CalcLimits>('/calculator-limits');
        setLimits(data);
      } catch (error) {
        console.error('Ошибка загрузки лимитов калькулятора:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchLimits();
  }, []);

  return { limits, loading };
};
