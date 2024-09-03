export const trim = (x) => {
  const value = String(x);
  return value.replace(/^\s+|\s+$/gm, '');
};

export const isEmpty = (x) => {
  if (x === undefined || x === null || trim(x) === '' || x === '') {
    return true;
  } else {
    return false;
  }
};
