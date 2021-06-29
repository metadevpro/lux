export const isInitialAndEmpty = (prevValue: any, newValue: any): boolean => {
  const isPrevArray = Array.isArray(prevValue);
  const isNewArray = Array.isArray(newValue);
  return !(
    (isPrevArray ? prevValue.length !== 0 : Boolean(prevValue)) ||
    (isNewArray ? newValue.length !== 0 : Boolean(newValue))
  );
};
