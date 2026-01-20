export function normalizeSearch(value: unknown): string {
  const s = String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

  const n = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

  return n.replace(/ё/g, 'е').replace(/й/g, 'и');
}
