import {
  exists,
  hasValue,
  isValidColor,
  isValidEmail,
  isValidRelativeUrl,
  isValidUrl,
  normalizeDate,
  numberOfDecimalDigits,
  numberOfWholeDigits,
  roundToMultipleOf
} from './helperFns';

describe('exists', () => {
  it('should return false for null or undefined', () => {
    expect(exists(null)).toBeFalsy();
    expect(exists(undefined)).toBeFalsy();
  });
  it('should return true for values except null or undefined', () => {
    expect(exists(0)).toBeTruthy();
    expect(exists('')).toBeTruthy();
    expect(exists(false)).toBeTruthy();
    expect(exists({})).toBeTruthy();
    expect(exists([])).toBeTruthy();
  });
});

describe('hasValue', () => {
  it('should return false for null, undefined, or empty/whitespace-only strings', () => {
    expect(hasValue(null)).toBeFalsy();
    expect(hasValue(undefined)).toBeFalsy();
    expect(hasValue('')).toBeFalsy();
    expect(hasValue(' ')).toBeFalsy();
    expect(hasValue('                ')).toBeFalsy();
    expect(hasValue('\n')).toBeFalsy();
    expect(hasValue('\t')).toBeFalsy();
  });
  it('should return true for non-empty strings', () => {
    expect(hasValue('a')).toBeTruthy();
    expect(hasValue('    a    ')).toBeTruthy();
    expect(hasValue('null')).toBeTruthy();
    expect(hasValue('undefined')).toBeTruthy();
  });
});

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('a@acme.com')).toBeTruthy();
    expect(isValidEmail('a+b@acme.com')).toBeTruthy();
    expect(isValidEmail('a+b@acme.br.com')).toBeTruthy();
    expect(isValidEmail('a_b@acme.br.com')).toBeTruthy();
    expect(isValidEmail('a-b@acme.br.com')).toBeTruthy();
    expect(isValidEmail('a23@acme.br.com')).toBeTruthy();
  });
  it('should return false for invalid emails', () => {
    expect(isValidEmail('a')).toBeFalsy();
    expect(isValidEmail('a+b')).toBeFalsy();
    expect(isValidEmail('a+b@acme')).toBeFalsy();
    expect(isValidEmail('a_b@acme.')).toBeFalsy();
    expect(isValidEmail('a-b@acme.br.')).toBeFalsy();
    expect(isValidEmail('a23@acme.br.com asd')).toBeFalsy();
  });
});

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('https://a.com')).toBeTruthy();
    expect(isValidUrl('http://www.example.com')).toBeTruthy();
    expect(
      isValidUrl('ftps://www.example.com/example/example.jsp')
    ).toBeTruthy();
    expect(isValidUrl('www.example.com')).toBeTruthy();
  });
  it('should return false for invalid URLs', () => {
    expect(isValidUrl('a')).toBeFalsy();
    expect(isValidUrl('http://no spaces.com')).toBeFalsy();
    expect(isValidUrl('http//missingcolon.com')).toBeFalsy();
  });
});

describe('isValidRelativeUrl', () => {
  it('should return true for valid relative URLs', () => {
    expect(isValidRelativeUrl('abc')).toBeTruthy();
    expect(isValidRelativeUrl('/abc')).toBeTruthy();
    expect(isValidRelativeUrl('abc/def')).toBeTruthy();
  });
});

describe('isValidColor', () => {
  let originalCSS: any;
  beforeAll(() => {
    originalCSS = (global as any).CSS;
  });
  afterAll(() => {
    (global as any).CSS = originalCSS;
  });

  describe('valid colors', () => {
    beforeAll(() => {
      (global as any).CSS = {
        supports: (_prop: string, _value: string) => true
      };
    });
    it('should return true for valid colors', () => {
      expect(isValidColor('red')).toBeTruthy();
      expect(isValidColor('#00FF00')).toBeTruthy();
      expect(isValidColor('rgb(0,0,255)')).toBeTruthy();
    });
  });

  describe('invalid colors', () => {
    beforeAll(() => {
      (global as any).CSS = {
        supports: (_prop: string, _value: string) => false
      };
    });
    it('should return false for invalid colors', () => {
      expect(isValidColor(null)).toBeFalsy();
      expect(isValidColor(undefined)).toBeFalsy();
      expect(isValidColor('notacolor')).toBeFalsy();
    });
  });
});

describe('normalizeDate', (): void => {
  it('should normalize ISO date strings to YYYY-MM-DD', () => {
    expect(normalizeDate('2021-05-01T12:34:56Z')).toBe('2021-05-01');
  });
});

describe('number functions', (): void => {
  it('should round to closest multiple', () => {
    expect(roundToMultipleOf(1.2345, 0.1)).toEqual(1.2);
  });
  it('should count decimal digits', () => {
    expect(numberOfDecimalDigits('10.25')).toEqual(2);
    expect(numberOfDecimalDigits(3.1415)).toEqual(4);
  });
  it('should count whole digits', () => {
    expect(numberOfWholeDigits('1234')).toEqual(4);
    expect(numberOfWholeDigits(0.12)).toEqual(0);
  });
});
