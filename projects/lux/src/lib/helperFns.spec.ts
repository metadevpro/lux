import {
  exists,
  hasValue,
  normalizeDate,
  isValidEmail,
  isValidNumber
} from './helperFns';

describe('exists', () => {
  it('should return false for null or undefined', () => {
    expect(exists(null)).toBeFalse();
    expect(exists(undefined)).toBeFalse();
  });
  it('should return true for values except null or undefined', () => {
    expect(exists(0)).toBeTrue();
    expect(exists('')).toBeTrue();
    expect(exists(false)).toBeTrue();
    expect(exists({})).toBeTrue();
    expect(exists([])).toBeTrue();
  });
});

describe('hasValue', () => {
  it('should return false for null or undefined or empty strings or whitespace only strings', () => {
    expect(hasValue(null)).toBeFalse();
    expect(hasValue(undefined)).toBeFalse();
    expect(hasValue('')).toBeFalse();
    expect(hasValue(' ')).toBeFalse();
    expect(hasValue('                ')).toBeFalse();
    expect(hasValue('\n')).toBeFalse();
    expect(hasValue('\t')).toBeFalse();
  });
  it('should return true for non empty strings', () => {
    expect(hasValue('a')).toBeTrue();
    expect(hasValue('    a    ')).toBeTrue();
    expect(hasValue('null')).toBeTrue();
    expect(hasValue('undefined')).toBeTrue();
  });
});

describe('isEmptyString', () => {
  it('should return false for strings that consist of whitespace only', () => {
    expect(hasValue('')).toBeFalse();
    expect(hasValue(' ')).toBeFalse();
    expect(hasValue('                ')).toBeFalse();
    expect(hasValue('\n')).toBeFalse();
    expect(hasValue('\t')).toBeFalse();
    expect(hasValue('\n\t ')).toBeFalse();
  });
  it('should return true for strings that do not consist of whitespace only', () => {
    expect(hasValue('a')).toBeTrue();
    expect(hasValue(' a')).toBeTrue();
    expect(hasValue('a ')).toBeTrue();
    expect(hasValue('    a    ')).toBeTrue();
    expect(hasValue('a    b')).toBeTrue();
    expect(hasValue('a\nb')).toBeTrue();
    expect(hasValue('a\tb')).toBeTrue();
    expect(hasValue('.')).toBeTrue();
    expect(hasValue('null')).toBeTrue();
    expect(hasValue('undefined')).toBeTrue();
  });
});

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('a@acme.com')).toBeTrue();
    expect(isValidEmail('a+b@acme.com')).toBeTrue();
    expect(isValidEmail('a+b@acme.br.com')).toBeTrue();
    expect(isValidEmail('a_b@acme.br.com')).toBeTrue();
    expect(isValidEmail('a-b@acme.br.com')).toBeTrue();
    expect(isValidEmail('a23@acme.br.com')).toBeTrue();
  });
  it('should return false for invalid emails', () => {
    expect(isValidEmail('a')).toBeFalse();
    expect(isValidEmail('a+b')).toBeFalse();
    expect(isValidEmail('a+b@acme')).toBeFalse();
    expect(isValidEmail('a_b@acme.')).toBeFalse();
    expect(isValidEmail('a-b@acme.br.')).toBeFalse();
    expect(isValidEmail('a23@acme.br.com asd')).toBeFalse();
  });
});

describe('normalizeDate', () => {
  it('should return a normalized Date for strings', () => {
    expect(normalizeDate('2021-05-01')).toBe('2021-05-01');
    expect(normalizeDate('2021-05-01T00:23:34')).toBe('2021-05-01');
    expect(normalizeDate('2021-05-01T00:23:34Z')).toBe('2021-05-01');
    expect(normalizeDate('2021-05-01T00:23:34+02:00')).toBe('2021-05-01');
  });
});

describe('isValidNumber', () => {
  it('should return true for strings representing numbers', () => {
    expect(isValidNumber('0')).toBeTrue();
    expect(isValidNumber('4')).toBeTrue();
    expect(isValidNumber('-4')).toBeTrue();
    expect(isValidNumber('3.1')).toBeTrue();
    expect(isValidNumber('3.1e2')).toBeTrue();
    expect(isValidNumber('3.1e-2')).toBeTrue();
    expect(isValidNumber('-3.1e-2')).toBeTrue();
    expect(isValidNumber('5e300')).toBeTrue();
    expect(isValidNumber('Infinity')).toBeTrue();
  });
  it('should return true for numbers', () => {
    expect(isValidNumber(0)).toBeTrue();
    expect(isValidNumber(4)).toBeTrue();
    expect(isValidNumber(-4)).toBeTrue();
    expect(isValidNumber(3.1)).toBeTrue();
    expect(isValidNumber(3.1e2)).toBeTrue();
    expect(isValidNumber(3.1e-2)).toBeTrue();
    expect(isValidNumber(-3.1e-2)).toBeTrue();
    expect(isValidNumber(5e300)).toBeTrue();
    expect(isValidNumber(Infinity)).toBeTrue();
  });
  it('should return false for strings not representing a number', () => {
    expect(isValidNumber('NaN')).toBeFalse();
    expect(isValidNumber('e')).toBeFalse();
    expect(isValidNumber('e10')).toBeFalse();
    expect(isValidNumber('ee')).toBeFalse();
    expect(isValidNumber('-')).toBeFalse();
    expect(isValidNumber('e-e')).toBeFalse();
    expect(isValidNumber('.')).toBeFalse();
    expect(isValidNumber(',')).toBeFalse();
    expect(isValidNumber('+')).toBeFalse();
    expect(isValidNumber('')).toBeFalse();
    expect(isValidNumber('                ')).toBeFalse();
  });
  it('should return false for null or undefined', () => {
    expect(isValidNumber(undefined)).toBeFalse();
    expect(isValidNumber(null)).toBeFalse();
  });
  it('should return false for NaN', () => {
    expect(isValidNumber(NaN)).toBeFalse();
  });
});
