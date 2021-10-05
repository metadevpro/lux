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

// date functions

export const normalizeDate = (value: any): string => {
  if (typeof value === 'string' && value.length > 10) {
    return value.substr(0, 10);
  }
  return value ? value.toString() : null;
};

export const addTimezoneOffset = (date: Date): Date => {
  if (!date || isNaN(date.getTime())) {
    return date;
  } else {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }
};

export const dateToString = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    // invalid date
    return '';
  } else {
    return date
      .toISOString() // YYYY-MM-DDThh:mm:ss...
      .slice(0, 19); // YYYY-MM-DDThh:mm:ss
  }
};

export const dateToStringWithOffset = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    // invalid date
    return '';
  } else {
    return addTimezoneOffset(date)
      .toISOString() // YYYY-MM-DDThh:mm:ss...
      .slice(0, 19); // YYYY-MM-DDThh:mm:ss
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
