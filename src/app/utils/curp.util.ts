const CHECKSUM_ALPHABET = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

const STRUCTURE_PATTERN = new RegExp(
  '^[A-Z][AEIOU][A-Z]{2}' +
    '\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])' +
    '[HM]' +
    '(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QO|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)' +
    '[B-DF-HJ-NP-TV-Z]{3}' +
    '[A-Z0-9]' +
    '\\d$',
);

/** Mirrors dential-api's `CurpValidator` (research.md §2) for instant client-side feedback; the server remains authoritative. */
export function isValidCurp(curp: string | null | undefined): boolean {
  if (!curp) {
    return false;
  }
  const normalized = curp.trim().toUpperCase();
  if (!STRUCTURE_PATTERN.test(normalized)) {
    return false;
  }
  const expectedCheckDigit = Number(normalized.charAt(17));
  return computeCheckDigit(normalized) === expectedCheckDigit;
}

function computeCheckDigit(curp: string): number {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const value = CHECKSUM_ALPHABET.indexOf(curp.charAt(i));
    const weight = 18 - i;
    sum += value * weight;
  }
  const remainder = sum % 10;
  return (10 - remainder) % 10;
}
