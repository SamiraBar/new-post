export const normalizeRuBase = (value: string): string => {
  return (value ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // диакритика
    .replace(/ё/g, 'е')
    .replace(/й/g, 'и')
    .replace(/\s+/g, ' ');
};

export const normalizeRuSearch = (value: string): string => {
  return normalizeRuBase(value);
};

export const normalizeCityName = (cityName: string): string => {
  const base = normalizeRuBase(cityName)
    .replace(/\s+(город|г\.?|city)$/gi, '')
    .trim();

  if (!base) return '';

  return base
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');
};
