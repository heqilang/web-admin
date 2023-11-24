export type ResultUploadFileDTO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  data?: UploadFileDTO;
};
/** 数据 */
export type UploadFileDTO = {
  bucket?: string;
  object?: string;
  filename?: string;
};
export type ResultObject = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: any;
};
/** 数据 */
export type FileDTO = {
  objectName?: string;
  lastModified?: string;
  size?: number;
};
export type ResultListFileDTO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: FileDTO[];
};
/** 数据 */
export type BucketDTO = {
  name?: string;
  creationDate?: string;
};
export type ResultListBucketDTO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: BucketDTO[];
};
export type ResultString = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: string;
};
/** 数据 */
export type FileInfoDTO = {
  bucketName?: string;
  objectName?: string;
  lastModified?: string;
  size?: number;
  contentType?: string;
};
export type ResultFileInfoDTO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  data?: FileInfoDTO;
};
