<template>
  <div class="q-upload-img">
    <el-upload
      id="q-upload-img"
      ref="uploadImageRef"
      :class="state.imgUrl.length === props.limit ? 'upload_btn' : '_btn'"
      :action="action"
      :headers="{
        authorization: 'Bearer ' + getToken()
      }"
      :multiple="multiple"
      :name="name"
      :drag="drag"
      :accept="accept"
      :type="type"
      v-model:file-list="state.imgUrl"
      :auto-upload="autoUpload"
      :list-type="listType"
      :http-request="httpRequest"
      :disabled="disabled"
      :limit="limit"
      :on-remove="handleRemove"
      :on-error="handleError"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :before-upload="beforeUploadEvent"
      :before-remove="beforeRemoveEvent"
    >
      <el-icon><i-ep-plus /></el-icon>
      <template #tip>
        <div class="el-upload__tip">
          <slot name="tip"></slot>
        </div>
      </template>
    </el-upload>

    <el-image-viewer v-if="state.showBigImgViewer" @close="closePreview" :url-list="state.showBigImgList" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { BaseUploadProp, BaseUploadState, UploadFileExt } from './baseUpoad';
import { isEqual } from 'lodash';
import { UploadProps, ElMessage } from 'element-plus';
import { getToken } from '@/utils/auth';
import { removeObject } from '@/api/minio/minioApi';
import { ResultUploadFileDTO, UploadFileDTO } from '@/entity/minio';

const emits = defineEmits<{
  addImage: [file: UploadFileExt, savePath: string[]];
  removeImage: [file: UploadFileExt, savePath: string[], awaitRemove: UploadFileDTO[]];
}>();

const UPLOAD_BASE_URL = import.meta.env.VITE_APP_UPLOAD_URL;
const UPLOAD_FILE_URL = import.meta.env.VITE_APP_BASE_URL;

const headers = new Headers();
headers.set('authorization', 'Bearer ' + getToken());
const props = withDefaults(defineProps<BaseUploadProp>(), {
  bucketName: 'hz-cfc',
  savePath: 'web',
  size: 10,
  accept: 'image/*',
  autoUpload: true,
  listType: 'picture-card',
  limit: 1,
  headers: () => ({
    authorization: 'Bearer ' + getToken()
  }),
  removeRemote: false
});

const state = reactive<BaseUploadState>({
  // 需要双向绑定的上传参数
  imgUrl: [],
  saveUrl: [],
  // 查看大图
  showBigImgViewer: false,
  // 查看大图列表
  showBigImgList: [],
  // 待移除列表
  awaitRemove: []
});

const action = computed(() => {
  return `${UPLOAD_FILE_URL}/minio/minio/upload/${props.bucketName}?prefix=${props.savePath}`;
});

watch(
  () => props.defVal,
  (newValue, oldValue) => {
    // 图片未更新
    if (oldValue && isEqual(newValue, oldValue)) {
      return;
    }
    // 单张图时 允许直接传入url:string 处理成数组
    if (props.limit === 1 && newValue && !Array.isArray(newValue)) {
      const url = newValue.startsWith('http') ? newValue : `${UPLOAD_BASE_URL}${newValue}`;
      newValue = [url];
    }
    if (newValue && Array.isArray(newValue) && newValue.length > 0) {
      const arr: UploadFileExt[] = [];
      let fileId = 1;
      for (const item of newValue) {
        const url = item.startsWith('http') ? item : `${UPLOAD_BASE_URL}${item}`;
        arr.push({ url, status: 'success', name: item, url_half: item, uid: Date.now() + fileId++ });
      }
      state.imgUrl = arr;
      state.saveUrl = newValue;
    }
  },
  { immediate: true }
);

/**
 * 文件移除本地处理
 * @param uploadFile
 * @param uploadFiles
 */
const handleRemove: UploadProps['onRemove'] = (uploadFile: UploadFileExt, uploadFiles) => {
  // eslint-disable-next-line no-console
  console.log('handleRemove');
  if (props.onRemove && typeof props.onRemove === 'function') {
    props.onRemove(uploadFile, uploadFiles);
    return;
  }
  const index = state.saveUrl.findIndex(it => it === uploadFile.url_half);
  state.saveUrl.splice(index, 1);
  state.awaitRemove.push({
    object: (uploadFile.url_half as string).replace(`/${props.bucketName}`, ''),
    bucket: props.bucketName
  });

  emits('removeImage', uploadFile, state.saveUrl, state.awaitRemove);
};
/**
 * 文件上传成功处理
 * @param response
 * @param uploadFile
 * @param uploadFiles
 */
const handleSuccess: UploadProps['onSuccess'] = (
  response: ResultUploadFileDTO,
  uploadFile: UploadFileExt,
  uploadFiles
) => {
  if (props.onSuccess && typeof props.onSuccess === 'function') {
    props.onSuccess(response, uploadFile, uploadFiles);
    return;
  }

  const { bucket, object } = response.data || {};
  const url = `${UPLOAD_BASE_URL}/${bucket}/${object}`;
  const src = `/${bucket}/${object}`;
  uploadFile.url = url;
  uploadFile.url_half = src;
  state.saveUrl.push(src);
  emits('addImage', uploadFile, state.saveUrl);
};
// const handleProgress: UploadProps['onProgress'] = (evt, uploadFile, uploadFiles) => {
//   if (props.onProgress && typeof props.onProgress === 'function') {
//     props.onProgress(evt, uploadFile, uploadFiles);
//     return;
//   }
//   console.log('handleProgress', evt, uploadFile, uploadFiles);
// };

/**
 * 查看大图
 */
const handlePreview: UploadProps['onPreview'] = () => {
  state.showBigImgViewer = true;
  // 处理数据
  const arr: string[] = [];
  for (const item of state.imgUrl) {
    arr.push(item.url as string);
  }
  state.showBigImgList = arr;
};
/**
 * 文件错误处理
 * @param err
 * @param uploadFile
 * @param uploadFiles
 */
const handleError: UploadProps['onError'] = (err, uploadFile, uploadFiles) => {
  if (props.onError && typeof props.onError === 'function') {
    props.onError(err, uploadFile, uploadFiles);
    return;
  }
  console.error('err', err);
  ElMessage.error(err);
};
/**
 * 上传前先校验文件格式及大小
 * @param rawFile
 */
const beforeUploadEvent: UploadProps['beforeUpload'] = rawFile => {
  if (props.beforeUpload && typeof props.beforeUpload === 'function') {
    return props.beforeUpload(rawFile);
  }

  const { type, size: fileSize } = rawFile;
  if (!type || !/^(image|video|audio)\/.*?/.test(type)) {
    ElMessage.error('请上传正确的文件格式！');
    return false;
  }
  if (fileSize / 1024 / 1024 > props.size) {
    ElMessage.error(`文件大小不能超过${props.size}M！`);
    return false;
  }

  return true;
};
/**
 * 移除前先删除远程图片
 * @param uploadFile
 * @param uploadFiles
 */
const beforeRemoveEvent: UploadProps['beforeRemove'] = async (uploadFile: UploadFileExt, uploadFiles) => {
  if (props.beforeRemove && typeof props.beforeRemove === 'function') {
    return props.beforeRemove(uploadFile, uploadFiles);
  }
  try {
    if (!props.removeRemote) return true;
    const path = !uploadFile.url_half ? uploadFile.url_half : uploadFile.url?.split(props.bucketName)[1];
    if (!path) throw new Error('未获取到文件路径！');

    const res = await removeObject({ objectName: path }, props.bucketName);
    if (res.state === 200) {
      return true;
    }
    return false;
  } catch (error: any) {
    console.error(error);
    ElMessage.error('文件删除：' + error);
    return false;
  }
};
function closePreview() {
  state.showBigImgViewer = false;
  state.showBigImgList = [];
}
</script>

<style lang="scss" scoped>
.upload_btn :deep(.el-upload--picture-card) {
  display: none;
}

#q-upload-img {
  :deep(.el-upload-list--picture-card) {
    > .el-upload-list__item {
      .file {
        height: 100%;
        img {
          position: relative;
          width: 148px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
.el-icon-plus {
  $lineColor: #999;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: linear-gradient(90deg, $lineColor, $lineColor), linear-gradient(90deg, $lineColor, $lineColor);
  background-size: 2px 100%, 100% 2px;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
