import { isValidCurp } from './curp.util';

// Structurally valid CURP with a checksum computed by hand per research.md §2's algorithm:
// first 17 chars "PEPJ000101HDFRGZ5" -> weighted sum 2066 -> check digit (10 - 2066%10) % 10 = 4.
const VALID_CURP = 'PEPJ000101HDFRGZ54';

describe('isValidCurp', () => {
  it('accepts a structurally valid CURP with correct checksum', () => {
    expect(isValidCurp(VALID_CURP)).toBe(true);
  });

  it('accepts lowercase input by normalizing', () => {
    expect(isValidCurp(VALID_CURP.toLowerCase())).toBe(true);
  });

  it('rejects an incorrect checksum digit', () => {
    expect(isValidCurp('PEPJ000101HDFRGZ50')).toBe(false);
  });

  it('rejects too short input', () => {
    expect(isValidCurp('12345')).toBe(false);
  });

  it('rejects when the second character is not a vowel', () => {
    expect(isValidCurp('PXPJ000101HDFRGZ54')).toBe(false);
  });

  it('rejects an invalid month in the birthdate segment', () => {
    expect(isValidCurp('PEPJ001301HDFRGZ54')).toBe(false);
  });

  it('rejects an unknown state code', () => {
    expect(isValidCurp('PEPJ000101HZZRGZ54')).toBe(false);
  });

  it('rejects null/undefined/empty input', () => {
    expect(isValidCurp(null)).toBe(false);
    expect(isValidCurp(undefined)).toBe(false);
    expect(isValidCurp('')).toBe(false);
  });
});
