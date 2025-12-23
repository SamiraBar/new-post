import { create } from 'zustand';

const CYRILLIC_TO_LATIN_MAP: Record<string, string> = {
  й: 'q',
  ц: 'w',
  у: 'e',
  к: 'r',
  е: 't',
  н: 'y',
  г: 'u',
  ш: 'i',
  щ: 'o',
  з: 'p',
  х: '[',
  ъ: ']',
  ф: 'a',
  ы: 's',
  в: 'd',
  а: 'f',
  п: 'g',
  р: 'h',
  о: 'j',
  л: 'k',
  д: 'l',
  ж: ';',
  э: "'",
  я: 'z',
  ч: 'x',
  с: 'c',
  м: 'v',
  и: 'b',
  т: 'n',
  ь: 'm',
  б: ',',
  ю: '.',

  Й: 'Q',
  Ц: 'W',
  У: 'E',
  К: 'R',
  Е: 'T',
  Н: 'Y',
  Г: 'U',
  Ш: 'I',
  Щ: 'O',
  З: 'P',
  Х: '{',
  Ъ: '}',
  Ф: 'A',
  Ы: 'S',
  В: 'D',
  А: 'F',
  П: 'G',
  Р: 'H',
  О: 'J',
  Л: 'K',
  Д: 'L',
  Ж: ':',
  Э: '"',
  Я: 'Z',
  Ч: 'X',
  С: 'C',
  М: 'V',
  И: 'B',
  Т: 'N',
  Ь: 'M',
  Б: '<',
  Ю: '>',
};

const convertCyrillicToLatin = (text: string): string => {
  return text
    .split('')
    .map((char) => CYRILLIC_TO_LATIN_MAP[char] || char)
    .join('');
};

const extractCharFromEvent = (e: KeyboardEvent): string => {
  const code = e.code;
  const key = e.key;
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

  if (key && key.length === 1) {
    return convertCyrillicToLatin(key);
  }

  return '';
};

interface BarcodeState {
  buffer: string;

  lastKeyTime: number;

  isScanning: boolean;

  config: {
    minLength: number;
    maxTimeBetweenKeys: number;
    targetInputId: string;
    enabled: boolean;
    onScan?: (barcode: string) => void;
  };

  setConfig: (config: Partial<BarcodeState['config']>) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  reset: () => void;
  setEnabled: (enabled: boolean) => void;
}

export const useBarcodeStore = create<BarcodeState>((set, get) => ({
  buffer: '',
  lastKeyTime: 0,
  isScanning: false,

  config: {
    minLength: 4,
    maxTimeBetweenKeys: 50,
    targetInputId: 'trackingNumber',
    enabled: true,
    onScan: undefined,
  },

  setConfig: (newConfig) => {
    set((state) => ({
      config: { ...state.config, ...newConfig },
    }));
  },

  setEnabled: (enabled) => {
    set((state) => ({
      config: { ...state.config, enabled },
    }));
  },

  reset: () => {
    set({
      buffer: '',
      lastKeyTime: 0,
      isScanning: false,
    });
  },

  handleKeyDown: (e: KeyboardEvent) => {
    const state = get();
    const { config, buffer, lastKeyTime } = state;

    if (!config.enabled) return;

    const now = Date.now();
    const timeDiff = now - lastKeyTime;

    if (timeDiff > config.maxTimeBetweenKeys) {
      set({ buffer: '' });
    }

    set({ lastKeyTime: now });

    if (e.key === 'Enter') {
      if (buffer.length >= config.minLength) {
        const normalized = convertCyrillicToLatin(buffer).toUpperCase();
        const targetInput = document.getElementById(
          config.targetInputId,
        ) as HTMLInputElement | null;

        if (targetInput) {
          targetInput.value = normalized;

          targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        config.onScan?.(normalized);

        e.preventDefault();
        e.stopPropagation();
      }

      set({ buffer: '' });
      return;
    }

    const char = extractCharFromEvent(e);
    if (!char) return;

    set({ buffer: buffer + char });
  },
}));
