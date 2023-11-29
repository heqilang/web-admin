import { MINIO_API } from "@/utils/api/index"
import { ResultUploadFileDTO,ResultObject,ResultListFileDTO,ResultListBucketDTO,ResultString,ResultFileInfoDTO } from "@/entity/minio"

/** 上传文件 */
export function upload(body: { file?: File }, query?: { prefix?: string }, bucketName?: string): Promise<ResultUploadFileDTO> {
  return MINIO_API.connect("POST", `/minio/upload/${bucketName}`, body, query , { contentType: 'multipart/form-data' })
}

/** 创建存储桶 */
export function makeBucket(bucketName?: string): Promise<ResultObject> {
  return MINIO_API.connect("POST", `/minio/makeBucket/${bucketName}`)
}

/** 列出所有文件 */
export function listObjects(query?: { prefix?: string }, bucketName?: string): Promise<ResultListFileDTO> {
  return MINIO_API.connect("GET", `/minio/listObjects/${bucketName}`, undefined, query)
}

/** 列出所有存储桶 */
export function listBuckets(): Promise<ResultListBucketDTO> {
  return MINIO_API.connect("GET", `/minio/listBuckets`)
}

/** 获取文件的url */
export function getObjectUrl(query?: { objectName?: string }, bucketName?: string): Promise<ResultString> {
  return MINIO_API.connect("GET", `/minio/getObjectUrl/${bucketName}`, undefined, query)
}

/** 获取文件信息 */
export function getObjectInfo(query?: { objectName?: string }, bucketName?: string): Promise<ResultFileInfoDTO> {
  return MINIO_API.connect("GET", `/minio/getObjectInfo/${bucketName}`, undefined, query)
}

/** 下载文件 */
export function download(query?: { objectName?: string }, bucketName?: string): Promise<any> {
  return MINIO_API.connect("GET", `/minio/download/${bucketName}`, undefined, query)
}

/** 删除多个文件 */
export function removeObjects(arr?: string[], bucketName?: string): Promise<ResultObject> {
  return MINIO_API.connect("DELETE", `/minio/removeObjects/${bucketName}`, arr)
}

/** 删除单个文件 */
export function removeObject(query?: { objectName?: string }, bucketName?: string): Promise<ResultObject> {
  return MINIO_API.connect("DELETE", `/minio/removeObject/${bucketName}`, undefined, query)
}

/** 删除存储桶 */
export function removeBucket(bucketName?: string): Promise<ResultObject> {
  return MINIO_API.connect("DELETE", `/minio/removeBucket/${bucketName}`)
}