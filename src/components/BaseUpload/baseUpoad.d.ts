import { MinioObject } from '@/entity/common';
import type { UploadFile, UploadProps } from 'element-plus';
export interface UploadFileExt extends UploadFile {
  url_half?: string;
}

type FilterUpload = Omit<
  UploadProps,
  'action' | 'fileList'
  // | 'beforeUpload'
  // | 'beforeRemove'
  // | 'onRemove'
  // | 'onChange'
  // | 'onPreview'
  // | 'onSuccess'
  // | 'onProgress'
  // | 'onError'
  // | 'onExceed'
>;

export interface BaseUploadProp extends Partial<FilterUpload> {
  /** 桶名 */
  bucketName?: string;
  /** 存储路径 */
  savePath?: string;
  /** 单张图片大小限制 */
  size?: number;
  /** 上传提示语 */
  tipText?: string;
  /** 默认上传图片 */
  defVal?: string | string[];
  /** 是否删除远程图片 */
  removeRemote?: boolean;
}

export interface BaseUploadState {
  imgUrl: UploadFileExt[];
  saveUrl: string[];
  // 查看大图
  showBigImgViewer?: boolean;
  // 查看大图列表
  showBigImgList: string[];

  awaitRemove: MinioObject[];
}
