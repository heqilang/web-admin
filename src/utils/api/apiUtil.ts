import { dayjs } from 'element-plus';
import { isEmpty } from '../objectUtil';
import qs from 'qs';

export default class ApiUtils {
  static formatMomentToString(time: dayjs.Dayjs) {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  }
  static formatBody1(body: Record<string, any>) {
    const keys = Object.keys(body);
    for (const key of keys) {
      const val = body[key];
      if (val && typeof val === 'object') {
        if (dayjs.isDayjs(val)) {
          body[key] = this.formatMomentToString(val);
        } else if ('getDate' in val) {
          body[key] = this.formatMomentToString(dayjs(val));
        } else if (isEmpty(val)) {
          delete body[key];
        } else {
          ApiUtils.formatBody1(val);
        }
      }
    }
    return body;
  }

  static formatBody(body: Record<string, any> | string | undefined | null) {
    if (!body) return '';
    if (typeof body === 'string') return body;
    const newBody = this.formatBody1(body);
    const keys = Object.keys(newBody);
    const paramObject: Record<string, any> = {};
    for (const key of keys) {
      const val = newBody[key];
      if (val && typeof val === 'object') {
        paramObject[key] = JSON.stringify(val);
      } else if (val || val === 0 || val === true) {
        paramObject[key] = val;
      }
    }

    if (isEmpty(paramObject)) {
      return '';
    } else {
      return '?' + qs.stringify(paramObject, { encode: false });
    }
  }
}
