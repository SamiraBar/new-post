export const formatKGPhone = (phone?: string): string => {
  if (!phone) return '';

  let digits = phone.replace(/\D/g, '');

  if (digits.startsWith('996996')) {
    digits = digits.slice(3);
  }

  if (digits.startsWith('996')) {
    digits = digits.slice(3);
  }

  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 9) {
    return `+996 ${digits}`;
  }

  return `+996 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};
