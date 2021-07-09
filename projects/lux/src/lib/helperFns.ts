// undefined and null functions

export const exists = (v: any): boolean => v !== null && v !== undefined;

export const hasValue = (v: any): boolean =>
  v !== null &&
  v !== undefined &&
  (typeof v === 'string' ? isEmptyString(v) : true);

// string functions

export const isEmptyString = (input: string): boolean => input.trim() === '';

export const isValidEmail = (email: string): boolean => {
  const re =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  return re.test(String(email).toLowerCase().trim());
};

// date functions

export const normalizeDate = (v: any): string => {
  if (typeof v === 'string' && v.length > 10) {
    return v.substr(0, 10);
  }
  return v ? v.toString() : null;
};

// other functions

export const isValidNumber = (
  input: string | number | undefined | null
): boolean => (hasValue(input) ? !Number.isNaN(Number(input)) : false);

export const isInitialAndEmpty = (prevValue: any, newValue: any): boolean => {
  const isPrevArray = Array.isArray(prevValue);
  const isNewArray = Array.isArray(newValue);
  return !(
    (isPrevArray ? prevValue.length !== 0 : Boolean(prevValue)) ||
    (isNewArray ? newValue.length !== 0 : Boolean(newValue))
  );
};
