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

describe('exists', (): void => {
  it('should return false for null or undefined', (): void => {
    expect(exists(null)).toBeFalsy();
    expect(exists(undefined)).toBeFalsy();
  });
  it('should return true for values except null or undefined', (): void => {
    expect(exists(0)).toBeTruthy();
    expect(exists('')).toBeTruthy();
    expect(exists(false)).toBeTruthy();
    expect(exists({})).toBeTruthy();
    expect(exists([])).toBeTruthy();
  });
});

describe('hasValue', (): void => {
  it('should return false for null, undefined, or empty/whitespace-only strings', (): void => {
    expect(hasValue(null)).toBeFalsy();
    expect(hasValue(undefined)).toBeFalsy();
    expect(hasValue('')).toBeFalsy();
    expect(hasValue(' ')).toBeFalsy();
    expect(hasValue('                ')).toBeFalsy();
    expect(hasValue('\n')).toBeFalsy();
    expect(hasValue('\t')).toBeFalsy();
  });
  it('should return true for non-empty strings', (): void => {
    expect(hasValue('a')).toBeTruthy();
    expect(hasValue('    a    ')).toBeTruthy();
    expect(hasValue('null')).toBeTruthy();
    expect(hasValue('undefined')).toBeTruthy();
  });
});

describe('isValidEmail', (): void => {
  it('should return true for valid emails', (): void => {
    expect(isValidEmail('a@acme.com')).toBeTruthy();
    expect(isValidEmail('a+b@acme.com')).toBeTruthy();
    expect(isValidEmail('a+b@acme.br.com')).toBeTruthy();
    expect(isValidEmail('a_b@acme.br.com')).toBeTruthy();
    expect(isValidEmail('a-b@acme.br.com')).toBeTruthy();
    expect(isValidEmail('a23@acme.br.com')).toBeTruthy();
  });
  it('should return false for invalid emails', (): void => {
    expect(isValidEmail('a')).toBeFalsy();
    expect(isValidEmail('a+b')).toBeFalsy();
    expect(isValidEmail('a+b@acme')).toBeFalsy();
    expect(isValidEmail('a_b@acme.')).toBeFalsy();
    expect(isValidEmail('a-b@acme.br.')).toBeFalsy();
    expect(isValidEmail('a23@acme.br.com asd')).toBeFalsy();
  });
});

describe('isValidUrl', (): void => {
  it('should return true for valid URLs', (): void => {
    expect(isValidUrl('https://a.com')).toBeTruthy();
    expect(isValidUrl('http://www.example.com')).toBeTruthy();
    expect(
      isValidUrl('ftps://www.example.com/example/example.jsp')
    ).toBeTruthy();
    expect(isValidUrl('www.example.com')).toBeTruthy();
  });
  it('should return false for invalid URLs', (): void => {
    expect(isValidUrl('a')).toBeFalsy();
    expect(isValidUrl('http://no spaces.com')).toBeFalsy();
    expect(isValidUrl('http//missingcolon.com')).toBeFalsy();
  });
});

describe('isValidRelativeUrl', (): void => {
  it('should return true for valid relative URLs', (): void => {
    expect(isValidRelativeUrl('abc')).toBeTruthy();
    expect(isValidRelativeUrl('/abc')).toBeTruthy();
    expect(isValidRelativeUrl('abc/def')).toBeTruthy();
  });
});

describe('isValidColor', (): void => {
  let originalCSS: any;
  beforeAll((): void => {
    originalCSS = (global as any).CSS;
  });
  afterAll((): void => {
    (global as any).CSS = originalCSS;
  });

  describe('valid colors', (): void => {
    beforeAll((): void => {
      (global as any).CSS = {
        supports: (_prop: string, _value: string): boolean => true
      };
    });
    it('should return true for valid colors', (): void => {
      expect(isValidColor('red')).toBeTruthy();
      expect(isValidColor('#00FF00')).toBeTruthy();
      expect(isValidColor('rgb(0,0,255)')).toBeTruthy();
    });
  });

  describe('invalid colors', (): void => {
    beforeAll((): void => {
      (global as any).CSS = {
        supports: (_prop: string, _value: string): boolean => false
      };
    });
    it('should return false for invalid colors', (): void => {
      expect(isValidColor(null)).toBeFalsy();
      expect(isValidColor(undefined)).toBeFalsy();
      expect(isValidColor('notacolor')).toBeFalsy();
    });
  });
});

describe('normalizeDate', (): void => {
  it('should normalize ISO date strings to YYYY-MM-DD', (): void => {
    expect(normalizeDate('2021-05-01T12:34:56Z')).toBe('2021-05-01');
  });
});

describe('number functions', (): void => {
  it('should round to closest multiple', (): void => {
    expect(roundToMultipleOf(1.2345, 0.1)).toEqual(1.2);
  });
  it('should count decimal digits', (): void => {
    expect(numberOfDecimalDigits('10.25')).toEqual(2);
    expect(numberOfDecimalDigits(3.1415)).toEqual(4);
  });
  it('should count whole digits', (): void => {
    expect(numberOfWholeDigits('1234')).toEqual(4);
    expect(numberOfWholeDigits(0.12)).toEqual(0);
  });
});
