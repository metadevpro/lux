import {
  exists,
  hasValue,
  normalizeDate,
  isValidEmail,
  isValidUrl,
  isValidColor,
  isValidNumber,
  numberOfDecimalDigits,
  numberOfWholeDigits,
  roundToMultipleOf,
  isValidRelativeUrl
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

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('https://a.com')).toBeTrue();
    expect(isValidUrl('http://www.example.com')).toBeTrue();
    expect(isValidUrl('ftps://www.example.com/example/example.jsp')).toBeTrue();
    expect(
      isValidUrl('https://www.example.com/example/?example=true&ejemplo=false')
    ).toBeTrue();
    expect(
      isValidUrl('https://www.example.com/example/;example=true;ejemplo=false')
    ).toBeTrue();
    expect(isValidUrl('https://www.example.com/example123')).toBeTrue();
    expect(isValidUrl('https://localhost')).toBeTrue();
    expect(isValidUrl('https://localhost:4200/')).toBeTrue();
    expect(isValidUrl('https://1.2.3.4')).toBeTrue();
    expect(isValidUrl('www.example.com')).toBeTrue();
    expect(
      isValidUrl('protocolthatijustinvented://my.server.at.my.domain')
    ).toBeTrue();
    expect(
      isValidUrl('www.example.com/a+domain-with_weird,characters.html')
    ).toBeTrue();
    expect(isValidUrl('http://no%20spaces%20in%20urls.com')).toBeFalse();
  });
  it('should return false for invalid URLs', () => {
    expect(isValidUrl('a')).toBeFalse();
    expect(isValidUrl('http://no spaces in urls.com')).toBeFalse();
    expect(isValidUrl('http//missing.a.colon.com')).toBeFalse();
  });
});

describe('isValidRelativeUrl', () => {
  it('should return true for valid relative URLs', () => {
    expect(isValidRelativeUrl('abc')).toBeTrue();
    expect(isValidRelativeUrl('abc/')).toBeTrue();
    expect(isValidRelativeUrl('/abc')).toBeTrue();
    expect(isValidRelativeUrl('/abc/')).toBeTrue();
    expect(isValidRelativeUrl('abc/def/ghi/')).toBeTrue();
    expect(isValidRelativeUrl('/abc?a=0')).toBeTrue();
    expect(isValidRelativeUrl('/abc#row=4-8')).toBeTrue();
    expect(isValidRelativeUrl('/abc#row=1-*')).toBeTrue();
    expect(isValidRelativeUrl('/abc?a=0&b=1#c')).toBeTrue();
    expect(isValidRelativeUrl('./abc')).toBeTrue();
    expect(isValidRelativeUrl('../abc')).toBeTrue();
    expect(isValidRelativeUrl('./../abc')).toBeTrue();
    expect(isValidRelativeUrl('/.././abc')).toBeTrue();
  });
});

describe('isValidColor', () => {
  it('should return true for valid colors', () => {
    expect(isValidColor('red')).toBeTrue();
    expect(isValidColor('aqua')).toBeTrue();
    expect(isValidColor('#000000')).toBeTrue();
    expect(isValidColor('#FFFFFF')).toBeTrue();
    expect(isValidColor('rgb(0,0,255)')).toBeTrue();
    expect(isValidColor('rgba(0,0,255,0.5)')).toBeTrue();
    expect(isValidColor('hsl(0,100%,0%)')).toBeTrue();
  });
  it('should return false for invalid colors', () => {
    expect(isValidColor(null)).toBeFalse();
    expect(isValidColor(undefined)).toBeFalse();
    expect(isValidColor('null')).toBeFalse();
    expect(isValidColor('currentcolor')).toBeFalse();
    expect(isValidColor('inherit')).toBeFalse();
    expect(isValidColor('initial')).toBeFalse();
    expect(isValidColor('revert')).toBeFalse();
    expect(isValidColor('unset')).toBeFalse();
    expect(isValidColor('Initial')).toBeFalse();
    expect(isValidColor('UNSET')).toBeFalse();
    expect(isValidColor('color')).toBeFalse();
    expect(isValidColor('#01234')).toBeFalse();
    expect(isValidColor('#GGGGGG')).toBeFalse();
    expect(isValidColor('rgb ( 255 , 255 , 255 )')).toBeFalse();
    expect(isValidColor('colorao')).toBeFalse();
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

describe('numberOfDecimalDigits', () => {
  it('should return the correct number of decimal digits for strings representing numbers', () => {
    expect(numberOfDecimalDigits('0')).toEqual(0);
    expect(numberOfDecimalDigits('0.1')).toEqual(1);
    expect(numberOfDecimalDigits('10.25')).toEqual(2);
    expect(numberOfDecimalDigits('-12.345')).toEqual(3);
    expect(numberOfDecimalDigits('1.2345e1')).toEqual(3);
    expect(numberOfDecimalDigits('1.2345e2')).toEqual(2);
    expect(numberOfDecimalDigits('1.2345e4')).toEqual(0);
    expect(numberOfDecimalDigits('1.2345e5')).toEqual(0);
    expect(numberOfDecimalDigits('1.2345e100')).toEqual(0);
    expect(numberOfDecimalDigits('1.2345e-1')).toEqual(5);
    expect(numberOfDecimalDigits('Infinity')).toEqual(0);
  });
  it('should return the correct number of decimal digits for numbers', () => {
    expect(numberOfDecimalDigits(0)).toEqual(0);
    expect(numberOfDecimalDigits(0.1)).toEqual(1);
    expect(numberOfDecimalDigits(10.25)).toEqual(2);
    expect(numberOfDecimalDigits(-12.345)).toEqual(3);
    expect(numberOfDecimalDigits(1.2345e1)).toEqual(3);
    expect(numberOfDecimalDigits(1.2345e2)).toEqual(2);
    expect(numberOfDecimalDigits(1.2345e4)).toEqual(0);
    expect(numberOfDecimalDigits(1.2345e5)).toEqual(0);
    expect(numberOfDecimalDigits(1.2345e100)).toEqual(0);
    expect(numberOfDecimalDigits(1.2345e-1)).toEqual(5);
    expect(numberOfDecimalDigits(Infinity)).toEqual(0);
  });
  it('should return undefined for strings not representing a number', () => {
    expect(numberOfDecimalDigits('NaN')).toEqual(undefined);
    expect(numberOfDecimalDigits('e')).toEqual(undefined);
    expect(numberOfDecimalDigits('e10')).toEqual(undefined);
    expect(numberOfDecimalDigits('ee')).toEqual(undefined);
    expect(numberOfDecimalDigits('-')).toEqual(undefined);
    expect(numberOfDecimalDigits('e-e')).toEqual(undefined);
    expect(numberOfDecimalDigits('.')).toEqual(undefined);
    expect(numberOfDecimalDigits(',')).toEqual(undefined);
    expect(numberOfDecimalDigits('+')).toEqual(undefined);
    expect(numberOfDecimalDigits('')).toEqual(undefined);
    expect(numberOfDecimalDigits('                ')).toEqual(undefined);
  });
});

describe('numberOfWholeDigits', () => {
  it('should return the correct number of whole digits for strings representing numbers', () => {
    expect(numberOfWholeDigits('0')).toEqual(0);
    expect(numberOfWholeDigits('0.1')).toEqual(0);
    expect(numberOfWholeDigits('10.25')).toEqual(2);
    expect(numberOfWholeDigits('-12.345')).toEqual(2);
    expect(numberOfWholeDigits('1.2345e1')).toEqual(2);
    expect(numberOfWholeDigits('1.2345e2')).toEqual(3);
    expect(numberOfWholeDigits('1.2345e4')).toEqual(5);
    expect(numberOfWholeDigits('1.2345e5')).toEqual(6);
    expect(numberOfWholeDigits('123.45e100')).toEqual(103);
    expect(numberOfWholeDigits('0.00012345e100')).toEqual(97);
    expect(numberOfWholeDigits('1.2345e-1')).toEqual(0);
    expect(numberOfWholeDigits('Infinity')).toEqual(Infinity);
    expect(numberOfWholeDigits('-Infinity')).toEqual(Infinity);
  });
  it('should return the correct number of decimal digits for numbers', () => {
    expect(numberOfWholeDigits(0)).toEqual(0);
    expect(numberOfWholeDigits(0.1)).toEqual(0);
    expect(numberOfWholeDigits(10.25)).toEqual(2);
    expect(numberOfWholeDigits(-12.345)).toEqual(2);
    expect(numberOfWholeDigits(1.2345e1)).toEqual(2);
    expect(numberOfWholeDigits(1.2345e2)).toEqual(3);
    expect(numberOfWholeDigits(1.2345e4)).toEqual(5);
    expect(numberOfWholeDigits(1.2345e5)).toEqual(6);
    expect(numberOfWholeDigits(123.45e100)).toEqual(103);
    expect(numberOfWholeDigits(0.00012345e100)).toEqual(97);
    expect(numberOfWholeDigits(1.2345e-1)).toEqual(0);
    expect(numberOfWholeDigits(Infinity)).toEqual(Infinity);
    expect(numberOfWholeDigits(-Infinity)).toEqual(Infinity);
  });
  it('should return undefined for strings not representing a number', () => {
    expect(numberOfWholeDigits('NaN')).toEqual(undefined);
    expect(numberOfWholeDigits('e')).toEqual(undefined);
    expect(numberOfWholeDigits('e10')).toEqual(undefined);
    expect(numberOfWholeDigits('ee')).toEqual(undefined);
    expect(numberOfWholeDigits('-')).toEqual(undefined);
    expect(numberOfWholeDigits('e-e')).toEqual(undefined);
    expect(numberOfWholeDigits('.')).toEqual(undefined);
    expect(numberOfWholeDigits(',')).toEqual(undefined);
    expect(numberOfWholeDigits('+')).toEqual(undefined);
    expect(numberOfWholeDigits('')).toEqual(undefined);
    expect(numberOfWholeDigits('                ')).toEqual(undefined);
  });
});

describe('roundToMultipleOf', () => {
  it('should round to the closest multiple of', () => {
    expect(roundToMultipleOf(0, 1)).toEqual(0);
    expect(roundToMultipleOf(0.75, 1)).toEqual(1);
    expect(roundToMultipleOf(-0.75, -1)).toEqual(-1);
    expect(roundToMultipleOf(0.5, 0.3)).toEqual(0.6);
    expect(roundToMultipleOf(920, 25)).toEqual(925);
    expect(roundToMultipleOf(1.23456789, 0.01)).toEqual(1.23);
    expect(roundToMultipleOf(1.23456789, 0.02)).toEqual(1.24);
    expect(roundToMultipleOf(1.23456789, 0.04)).toEqual(1.24);
    expect(roundToMultipleOf(1.23456789, 0.05)).toEqual(1.25);
  });
});
