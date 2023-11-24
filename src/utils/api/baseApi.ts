import ApiUtils from './apiUtil';
import { PromiseTimeout } from '../PromiseTimeOut';
import { isEmpty } from '../objectUtil';
import { getToken, removeToken } from '../auth';
import router from '@/router';
import { ElMessage } from 'element-plus';

export type ApiConfig = {
  timeout?: number;
};

export class BaseApi {
  private host: string | undefined;
  private name: string | undefined;

  constructor(host: string, name: string) {
    if (!host) throw new Error('没有配置' + name);
    this.host = host;
    this.name = name;
  }

  /**
   *
   * @param {string} method 请求方法
   * @param {string} url 请求地址
   * @param {Record<string, any> | string | undefined | null} body 请求参数
   * @param {Record<string, any> | undefined | null} query 请求参数
   *
   * 请求额外参数
   * timeout 设置请求超时时间
   * @param {{timeout: number,}} apiConfig
   */
  async connect(
    method: string,
    url: string,
    body: Record<string, any> | string | undefined | null = {},
    query: Record<string, any> | undefined | null = {},
    apiConfig: ApiConfig = { timeout: 15000 }
  ): Promise<any> {
    method = method.toUpperCase();
    const headers = new Headers();

    if (body instanceof FormData) {
      //
    } else {
      headers.set('content-type', 'application/json');
    }

    const token = getToken();
    token && headers.append('Authorization', 'Bearer ' + token);

    const args: RequestInit = { method, headers };

    if (query && !isEmpty(query)) {
      url = url + ApiUtils.formatBody(query);
    }
    if (method === 'GET' || method === 'HEAD') {
      //
    } else {
      if (body instanceof FormData) {
        args.body = body;
      } else {
        args.body = body ? JSON.stringify(body) : null;
      }
    }

    const fetchUrl = `${this.host}${url}`;

    try {
      const res: Response = await PromiseTimeout(window.fetch(fetchUrl, args), apiConfig.timeout);
      if (res.status === 401) {
        pageToLogin();
        throw new Error(`请求接口[${this.name}]${this.host}${url} 鉴权失败！`);
      }
      let value;
      const contentType = res.headers.get('content-type');
      if (contentType?.startsWith('application/json')) {
        value = await res.json();
        if (value.state !== 200 && value.state !== 0) {
          throw new Error(value.msg);
        }
      } else if (contentType?.startsWith('application/vnd.ms-excel')) {
        const fileName = res.headers.get('Content-Disposition')?.split('filename=')[1];
        const buffer = await res.arrayBuffer();
        value = { state: 0, data: { fileName, buffer, fileType: contentType } };
      } else {
        const str = await res.text();
        value = { state: 0, data: str };
      }
      return value;
    } catch (err: any) {
      const errorMap = {
        'Failed to fetch': `网络连接超时[${this.name}]${this.host}${url} ，请检查网络或联系管理员！`,
        404: `请求接口[${this.name}]${this.host}${url} 不存在！`,
        401: `请求接口[${this.name}]${this.host}${url} 鉴权失败！`,
        500: `请求接口[${this.name}]${this.host}${url} 服务器错误！`,
        501: `请求接口[${this.name}]${this.host}${url} 请求方法错误！`
      };
      const errorMessage: keyof typeof errorMap = err ? err.message || err : '404';
      const error = errorMap[errorMessage] || err?.message || err || '网络连接错误';
      ElMessage.error(error);
      return { state: -1, data: null, msg: error };
    }
  }
}
function pageToLogin() {
  removeToken();
  router.push('login');
}
