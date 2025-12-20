import { useEffect, useRef, useCallback } from 'react';

interface BarcodeScannerOptions {
  onScan: (barcode: string) => void;
  minLength?: number;
  maxTimeBetweenKeys?: number;
  enabled?: boolean;
  targetInputId: string; // ID инпута, в который нужно вставлять баркод (обязательный)
}

/**
 * Извлекает физический символ из кода клавиши (независимо от раскладки)
 */
const extractCharFromCode = (e: KeyboardEvent): string => {
  const code = e.code;
  const shift = e.shiftKey;

  if (code.startsWith('Key')) {
    const letter = code.replace('Key', '');
    return shift ? letter : letter.toLowerCase();
  }

  if (code.startsWith('Digit')) {
    const digit = code.replace('Digit', '');
    if (!shift) return digit;

    const shiftMap: Record<string, string> = {
      '1': '!',
      '2': '@',
      '3': '#',
      '4': '$',
      '5': '%',
      '6': '^',
      '7': '&',
      '8': '*',
      '9': '(',
      '0': ')',
    };
    return shiftMap[digit] || digit;
  }

  if (code.startsWith('Numpad')) {
    return code.replace('Numpad', '');
  }

  const specialChars: Record<string, [string, string]> = {
    Minus: ['-', '_'],
    Equal: ['=', '+'],
    BracketLeft: ['[', '{'],
    BracketRight: [']', '}'],
    Backslash: ['\\', '|'],
    Semicolon: [';', ':'],
    Quote: ["'", '"'],
    Comma: [',', '<'],
    Period: ['.', '>'],
    Slash: ['/', '?'],
    Backquote: ['`', '~'],
    Space: [' ', ' '],
  };

  if (specialChars[code]) {
    return shift ? specialChars[code][1] : specialChars[code][0];
  }

  return '';
};

/**
 * Хук для работы со сканером баркодов
 * Перехватывает быстрый ввод от сканера и направляет его ТОЛЬКО в указанный инпут
 */
export const useBarcodeScanner = ({
  onScan,
  minLength = 4,
  maxTimeBetweenKeys = 50,
  enabled = true,
  targetInputId,
}: BarcodeScannerOptions) => {
  const scanBuffer = useRef('');
  const lastKeyTime = useRef(0);
  const isScanningRef = useRef(false);
  const hasStartedNewScan = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // const target = e.target as HTMLElement;
      const targetInput = document.getElementById(targetInputId) as HTMLInputElement;

      if (!targetInput) return;

      const now = Date.now();
      const timeDiff = now - lastKeyTime.current;
      lastKeyTime.current = now;

      // Сброс буфера при большой паузе
      if (timeDiff > maxTimeBetweenKeys) {
        scanBuffer.current = '';
        isScanningRef.current = false;
        hasStartedNewScan.current = false;
      }

      // Определяем, это сканер или человек
      const isLikelyScanner = timeDiff < maxTimeBetweenKeys && scanBuffer.current.length >= 2;

      // Если мы определили, что это сканер
      if (isLikelyScanner) {
        isScanningRef.current = true;
      }

      // Enter завершает сканирование
      if (e.code === 'Enter' || e.key === 'Enter') {
        if (isScanningRef.current && scanBuffer.current.length >= minLength) {
          const barcode = scanBuffer.current.trim();

          // Вызываем callback
          onScan(barcode);

          // Предотвращаем дефолтное поведение
          e.preventDefault();
          e.stopPropagation();
        }

        scanBuffer.current = '';
        isScanningRef.current = false;
        hasStartedNewScan.current = false;
        return;
      }

      // Извлекаем символ
      const char = extractCharFromCode(e);
      if (!char) return;

      // Накапливаем в буфере
      scanBuffer.current += char;

      // Если это активное сканирование
      if (isScanningRef.current) {
        // Перехватываем событие, чтобы символ не попал в текущий инпут
        e.preventDefault();
        e.stopPropagation();

        // Вставляем символ в целевой инпут
        if (targetInput) {
          // При начале нового сканирования очищаем поле полностью
          if (!hasStartedNewScan.current) {
            targetInput.value = '';
            hasStartedNewScan.current = true;
          }

          // Добавляем символ к текущему значению
          targetInput.value += char;

          // Триггерим событие input для React
          const inputEvent = new Event('input', { bubbles: true });
          targetInput.dispatchEvent(inputEvent);

          // Устанавливаем фокус на целевой инпут
          if (document.activeElement !== targetInput) {
            targetInput.focus();
          }
        }
      }
    },
    [onScan, minLength, maxTimeBetweenKeys, targetInputId],
  );

  useEffect(() => {
    if (!enabled) return;

    // Используем capture фазу для перехвата событий ДО того, как они дойдут до инпутов
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      scanBuffer.current = '';
      isScanningRef.current = false;
      hasStartedNewScan.current = false;
    };
  }, [handleKeyDown, enabled]);

  const resetBuffer = useCallback(() => {
    scanBuffer.current = '';
    isScanningRef.current = false;
    hasStartedNewScan.current = false;
  }, []);

  return { resetBuffer };
};
