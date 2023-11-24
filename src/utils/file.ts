import { FileDto } from '@/entity/common';

export function downloadFile(res: FileDto, name?: string) {
  const fileName = name || res.fileName || new Date().valueOf().toString();
  const buffer = res.buffer;
  if (!buffer) {
    throw new Error('文件下载错误');
  }
  const blob = new Blob([buffer], { type: res.fileType || 'application/vnd.ms-excel' });
  const url = window.URL.createObjectURL(blob);
  // 创建a标签
  const link = document.createElement('a');
  link.href = url;
  // 重命名文件
  link.download = fileName;
  link.click();
  // 释放内存
  URL.revokeObjectURL(url);
}
