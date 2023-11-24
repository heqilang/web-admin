/// <reference types="vite/client" />

declare module 'coordtransform';

interface ImportMetaEnv {
  /** 环境 */
  readonly VITE_APP_ENV_NAME: string;
  /** 文件 */
  readonly VITE_APP_UPLOAD_URL: string;
  readonly VITE_APP_SYSTEM_NAME: string;
  readonly VITE_APP_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
