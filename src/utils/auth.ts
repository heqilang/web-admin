import Cookies from 'js-cookie';
const suffix = import.meta.env.MODE === 'development' ? '-Dev' : '';
const TokenKey = 'Rrq-Admin-Token' + suffix;
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const time = tomorrow.getTime();
  return Cookies.set(TokenKey, token, { expires: time, path: '' });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
