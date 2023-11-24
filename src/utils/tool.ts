export const setPhone = (num: string | number, start: number, length: number) => {
  const newNum = num + '';
  return newNum.slice(0, start) + '*'.repeat(length) + newNum.slice(newNum.length - start - 1);
};
