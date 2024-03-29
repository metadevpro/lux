/* eslint-disable no-useless-escape */
// undefined and null functions

export const exists = (value: any): boolean =>
  value !== null && value !== undefined;

export const hasValue = (value: any): boolean =>
  exists(value) && (typeof value === 'string' ? !isEmptyString(value) : true);

// string functions

export const isEmptyString = (value: string): boolean => value.trim() === '';

export const isValidEmail = (value: string): boolean => {
  const re =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  return re.test(String(value).toLowerCase().trim());
};

export const isValidUrl = (value: string): boolean => {
  const pattern =
    // eslint-disable-next-line max-len
    /^((([a-z]+?:\/\/)?(((([a-z0-9]([a-z0-9-]*[a-z0-9])*)\.)+[a-z]{2,})|((([0-9]{1,3}\.){3}[0-9]{1,3}))|(localhost))(\:[0-9]+)?))?((\/[a-zA-Z0-9\-_+=~.,:;%]+)*\/?)((\?|;)[a-zA-Z0-9\-_+~.,:;%]+=[a-zA-Z0-9\-_+~.,:;%]+(((&|;)[a-zA-Z0-9\-_+~.,:;%]+=[a-zA-Z0-9\-_+~.,:;%]+)*))?(#[a-zA-Z0-9\-_+~.,:;%]+(=[a-zA-Z0-9\*\-_+~.,:;%]+)?)?$/;
  return pattern.test(value);
};

export const isValidRelativeUrl = (value: string): boolean => {
  const pattern =
    // eslint-disable-next-line max-len
    /^((([a-z]+?:\/\/)?(((([a-z0-9]([a-z0-9-]*[a-z0-9])*)\.)+[a-z]{2,})|((([0-9]{1,3}\.){3}[0-9]{1,3}))|(localhost))(\:[0-9]+)?)|([a-zA-Z0-9\-_+=~.,:;%]+))?((\/[a-zA-Z0-9\-_+=~.,:;%]+)*\/?)((\?|;)[a-zA-Z0-9\-_+~.,:;%]+=[a-zA-Z0-9\-_+~.,:;%]+(((&|;)[a-zA-Z0-9\-_+~.,:;%]+=[a-zA-Z0-9\-_+~.,:;%]+)*))?(#[a-zA-Z0-9\-_+~.,:;%]+(=[a-zA-Z0-9\*\-_+~.,:;%]+)?)?$/;
  return pattern.test(value);
};

export const isValidColor = (value: string): boolean => {
  value = String(value).toLowerCase();
  // valid values for CSS color property, yet not valid colors by themselves
  if (
    value === 'currentcolor' ||
    value === 'inherit' ||
    value === 'initial' ||
    value === 'revert' ||
    value === 'unset'
  ) {
    return false;
  }
  return CSS.supports('color', value);
};

// date functions

export const isValidDate = (date: Date): boolean =>
  exists(date) ? !isNaN(date.getTime()) : false;

export const normalizeDate = (value: any): string => {
  if (typeof value === 'string' && value.length > 10) {
    return value.substr(0, 10);
  }
  return value ? value.toString() : null;
};

export const addTimezoneOffset = (date: Date): Date => {
  if (!isValidDate(date)) {
    return date;
  } else {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }
};

// number functions

export const isValidNumber = (
  value: string | number | undefined | null
): boolean => (hasValue(value) ? !Number.isNaN(Number(value)) : false);

export const numberOfDecimalDigits = (
  x: number | string
): number | undefined => {
  if (isValidNumber(x)) {
    const xString = String(Number(x));
    if (xString === 'Infinity') {
      return 0;
    }
    const indexOfE = xString.indexOf('e');
    if (indexOfE >= 0) {
      return 0;
    }
    const indexOfDecimalPoint = xString.indexOf('.');
    if (indexOfDecimalPoint < 0) {
      return 0;
    } else {
      return xString.length - indexOfDecimalPoint - 1;
    }
  }
  return undefined;
};

export const numberOfWholeDigits = (x: number | string): number | undefined => {
  if (isValidNumber(x)) {
    let xString = String(Number(x));
    if (xString.indexOf('-') === 0) {
      xString = xString.slice(1, xString.length);
    }
    if (xString === 'Infinity') {
      return Infinity;
    }
    if (xString.indexOf('0') === 0) {
      xString = xString.slice(1, xString.length);
    }
    const indexOfE = xString.indexOf('e');
    if (indexOfE >= 0) {
      return Number(xString.slice(indexOfE + 1, xString.length)) + 1;
    }
    const indexOfDecimalPoint = xString.indexOf('.');
    if (indexOfDecimalPoint < 0) {
      return xString.length;
    } else {
      return indexOfDecimalPoint;
    }
  }
  return undefined;
};

export const roundToMultipleOf = (x: number, modulo: number): number => {
  const moduloString = String(modulo);
  // approximates the result
  // prone to inexactitude because of floating point arithmetic
  const approximation = Math.round(x / modulo) * modulo;
  const approximationString = String(approximation);
  // remove useless decimals
  const uselessDecimalsInApproximation =
    numberOfDecimalDigits(approximationString) -
    numberOfDecimalDigits(moduloString);
  const resultString = approximationString.slice(
    0,
    approximationString.length - uselessDecimalsInApproximation
  );
  return Number(resultString);
};

// other functions

export const isInitialAndEmpty = (
  previousValue: any,
  newValue: any
): boolean => {
  const isPrevArray = Array.isArray(previousValue);
  const isNewArray = Array.isArray(newValue);
  return !(
    (isPrevArray ? previousValue.length !== 0 : Boolean(previousValue)) ||
    (isNewArray ? newValue.length !== 0 : Boolean(newValue))
  );
};
