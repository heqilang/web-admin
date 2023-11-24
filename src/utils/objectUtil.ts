export function isEmpty(obj: Record<string, any>) {
  for (const key in obj) {
    return false;
  }
  return true;
}

/**
 * 将对象转枚举
 * @param obj
 * @returns
 */
export function recordToEmun(obj: Record<string, string>) {
  const newAlarms: Record<string, string> = {};
  Object.entries(obj).forEach(([key, value]) => {
    newAlarms[key] = value;
    newAlarms[value] = key;
  });

  return Object.freeze(newAlarms);
}
