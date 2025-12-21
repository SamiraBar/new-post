import { useEffect, useRef } from 'react';
import { useBarcodeStore } from '@/stores/useBarcodeStore/useBarcodeStore';

interface UseBarcodeScannerOptions {
  onScan?: (barcode: string) => void;
  minLength?: number;
  maxTimeBetweenKeys?: number;
  enabled?: boolean;
  targetInputId?: string;
}

export const useBarcodeScanner = ({
  onScan,
  minLength = 4,
  maxTimeBetweenKeys = 50,
  enabled = true,
  targetInputId = 'trackingNumber',
}: UseBarcodeScannerOptions = {}) => {
  const { setConfig, reset } = useBarcodeStore();
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    setConfig({
      minLength,
      maxTimeBetweenKeys,
      enabled,
      targetInputId,
      onScan: onScanRef.current,
    });
  }, [minLength, maxTimeBetweenKeys, enabled, targetInputId, setConfig]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      useBarcodeStore.getState().handleKeyDown(e);
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      reset();
    };
  }, [enabled, reset]);

  return {
    reset,
  };
};
