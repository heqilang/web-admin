import { BaseApi } from './baseApi';

export const COMMON_API = new BaseApi(import.meta.env.VITE_APP_BASE_URL, '通用');
export const SYS_API = new BaseApi(import.meta.env.VITE_APP_BASE_URL + '/sys', '系统');
export const WARNING_API = new BaseApi(import.meta.env.VITE_APP_BASE_URL + '/cfc-warn', '告警');
export const DEVICE_API = new BaseApi(import.meta.env.VITE_APP_BASE_URL + '/cfc-device', '告警设备');
export const MINIO_API = new BaseApi(import.meta.env.VITE_APP_BASE_URL + '/minio', 'minio');
