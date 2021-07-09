// undefined and null functions

export const exists = (value: any): boolean =>
  value !== null && value !== undefined;

export const hasValue = (value: any): boolean =>
  exists(value) && (typeof value === 'string' ? isEmptyString(value) : true);

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

// other functions

export const isValidNumber = (
  value: string | number | undefined | null
): boolean => (hasValue(value) ? !Number.isNaN(Number(value)) : false);

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
