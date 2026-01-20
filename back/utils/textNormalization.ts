export function normalizeRuBase(value: unknown): string {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // диакритика
        .replace(/ё/g, 'е')
        .replace(/й/g, 'и')
        .replace(/\s+/g, ' ');
}


export function normalizeCity(value: unknown): string {
    return normalizeRuBase(value)
        .replace(/\s+(город|г\.?|city)$/gi, '')
        .trim();
}
