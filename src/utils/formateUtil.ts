/**
 * 身份证脱敏
 * @param val
 * @returns
 */
export function formateIdCard(val: string) {
  return val ? val.replace(/(\d{6})\d*(\d{4})/, '$1********$2') : '';
}
/**
 * 手机号脱敏
 * @param mobile 手机号
 * @returns
 */
export function formateMobile(mobile: string) {
  return mobile ? mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2') : '';
}
/**
 * 名称脱敏
 */
export function formateName(val: string) {
  const splitarr = val ? val.split('、') : [];
  const res = splitarr
    .map(it => {
      return it.substr(0, 1) + Array(2).fill('*').join('');
    })
    .join('、');
  return res || '***';
}
