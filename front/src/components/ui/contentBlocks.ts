export const normalizeText = (value: string) =>
  (value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/**
 * Enter один раз = новый блок
 * подряд bullet-линии = один UL блок
 * пустая строка = разделитель (просто пропускаем)
 */
export const splitBlocks = (text: string) => {
  const lines = normalizeText(text).split('\n');

  const blocks: string[] = [];
  let bulletBuf: string[] = [];

  const flushBullets = () => {
    if (bulletBuf.length) {
      blocks.push(bulletBuf.join('\n').trim());
      bulletBuf = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushBullets();
      continue;
    }

    if (/^[•\-–]\s?/.test(line)) {
      bulletBuf.push(line);
      continue;
    }

    flushBullets();
    blocks.push(line);
  }

  flushBullets();
  return blocks.filter(Boolean);
};

export const isHeadingLine = (block: string) => {
  const cleaned = block.trim();
  if (!/^[A-Za-zА-Яа-яЁёҮүӨөҚқІі\s]+$/.test(cleaned)) return false;
  if (cleaned.length > 48) return false;
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.length <= 4;
};
