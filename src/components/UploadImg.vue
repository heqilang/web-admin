<template>
  <div class="q-upload-img">
    <el-upload
      id="q-upload-img"
      ref="uploadImageRef"
      :class="state.imgUrl.length >= props.limit ? 'upload_btn' : '_btn'"
      action="#"
      list-type="picture-card"
      :accept="props.fileTypes.join(',')"
      :limit="props.limit"
      :auto-upload="false"
      :disabled="disabled"
      :file-list="state.imgUrl"
      :before-upload="beforeUpload"
      :on-change="handleChange"
    >
      <template #default>
        <i class="el-icon-plus"></i>
      </template>
      <template #file="{ file }">
        <div class="file">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="缩略图" />
          <span class="el-upload-list__item-actions">
            <span title="点击查看大图" class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <el-icon><i-ep-ZoomIn /></el-icon>
            </span>
            <span v-if="!disabled" title="点击删除图片" class="el-upload-list__item-delete" @click="handleRemove(file)">
              <el-icon><i-ep-delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
      <template #tip>
        <div class="el-upload__tip">
          <slot name="tip"></slot>
        </div>
      </template>
    </el-upload>

    <el-image-viewer
      v-if="state.showBigImgViewer"
      @close="state.showBigImgViewer = false"
      :url-list="state.showBigImgList"
    />
    <ImgCropper
      v-if="useCropper"
      v-model="state.cropperUrl"
      ref="ImgCropperRef"
      @change="onCropperChange"
      :aspectRatio="cropperOptions.aspectRatio"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { cloneDeep, isEqual } from 'lodash';
import { reactive, watch, ref } from 'vue';
import ImgCropper from './Cropper/ImgCropper.vue';
import { upload } from '@/api/minio/minioApi';
const UPLOAD_BASE_URL = import.meta.env.VITE_APP_UPLOAD_URL;
const emits = defineEmits(['uploadImg', 'change']);
const props = defineProps({
  // 默认绑定的值（图片路径，用于修改回显）
  defVal: {
    type: [Array, String],
    default() {
      return [];
    }
  },
  // 存放文件夹名称
  bucketName: {
    type: String,
    default: 'community-service'
  },
  savePath: {
    type: String,
    default: 'web'
  },
  // 单张图片大小（MB）
  size: {
    type: Number,
    default: 10
  },
  // 最多上传数量
  limit: {
    type: Number,
    default: 1
  },
  // 上传文件格式
  fileTypes: {
    type: Array,
    default() {
      return ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    }
  },
  // 提示文案
  tipText: {
    type: String,
    default: '图片'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  useCropper: {
    type: Boolean,
    default: false
  },
  cropperOptions: {
    type: Object,
    default: () => {
      return {
        aspectRatio: 16 / 9
      };
    }
  }
});
const uploadImageRef = ref(null);
const ImgCropperRef = ref(null);
const state = reactive({
  // 需要双向绑定的上传参数
  imgUrl: [],
  // 查看大图
  showBigImgViewer: false,
  // 查看大图列表
  showBigImgList: [],
  // 当前要裁剪的图片url
  cropperUrl: ''
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
      newValue = [newValue];
    }
    const arr = cloneDeep(newValue);
    state.imgUrl = [];
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      if (oldValue !== undefined) {
        state.imgUrl = [];
      }
    } else {
      for (let index = 0; index < arr.length; index++) {
        const it = arr[index];
        if (!it) continue;
        const url = it.indexOf('http') !== -1 ? it : UPLOAD_BASE_URL + it;
        state.imgUrl.push({ id: index, url, src: it }); // src保存最原始的地址 可能不是全路径
      }
    }
  },
  { immediate: true, deep: true }
);
// 自定义上传
function handleChange(file, _files) {
  const fg = beforeUpload(file.raw);
  if (!fg) {
    handleRemove(file);
    return;
  }
  uploadFunc(file);
}
function uploadFunc(file) {
  if (props.limit && state.imgUrl.length >= props.limit) {
    return;
  }
  upload(file.raw, { prefix: props.savePath }, props.bucketName).then(res => {
    const newUrl = `/${res.data.bucket}/${res.data.object}`;
    state.imgUrl.push({
      file: file,
      uid: file.raw.uid + '',
      url: file.url,
      res: { ...res.data },
      src: newUrl
    });
    revokeObjectURL();
    // 自定义组件双向绑定 子传父
    emits('uploadImg', state.imgUrl);
    emits('change', {
      file: newUrl,
      fileList: state.imgUrl.map(it => it.src)
    });
  });
}
// 查看大图
function handlePictureCardPreview(_file) {
  state.showBigImgViewer = true;
  // 处理数据
  const arr = [];
  state.imgUrl.forEach(it => {
    arr.push(it.file ? it.file.url : it.url);
  });
  state.showBigImgList = arr;
}
// 删除文件
function handleRemove(file) {
  const delIndex = state.imgUrl.findIndex(it => it.uid === file.uid);
  if (delIndex !== -1) {
    state.imgUrl.splice(delIndex, 1);
    // 自定义组件双向绑定 子传父
    emits('uploadImg', state.imgUrl);
    emits('change', {
      file: '',
      fileList: state.imgUrl.map(it => it.src)
    });
    uploadImageRef.value.handleRemove(file);
  } else {
    uploadImageRef.value.handleRemove(file);
  }
}
// 上传之前验证文件
function beforeUpload(file) {
  const isPic = props.fileTypes.find(it => it === file.type);
  const isLtSize = file.size / 1024 / 1024 < props.size;
  if (!isPic) {
    const tip = props.fileTypes
      .join('、')
      .replace(/image\//g, '')
      .toUpperCase();
    ElMessage.error(`上传${props.tipText}只能是 ${tip} 格式!`);
    return false;
  }
  if (!isLtSize) {
    ElMessage.error(`上传${props.tipText}大小不能超过 ${props.size}MB!`);
  }
  if (props.useCropper) {
    state.cropperUrl = URL.createObjectURL(file);
    ImgCropperRef.value.setState({ dialogVisible: true, fileName: file.name });
    return false;
  }
  return isPic && isLtSize;
}
function revokeObjectURL() {
  if (state.cropperUrl) {
    URL.revokeObjectURL(state.cropperUrl);
    state.cropperUrl = '';
  }
}
function onCropperChange({ file }) {
  uploadFunc({ raw: file });
}
</script>

<style lang="less" scoped>
.upload_btn :deep(.el-upload--picture-card) {
  display: none;
}

#q-upload-img {
  :deep(.el-upload-list--picture-card) {
    > .el-upload-list__item {
      .file {
        height: 100%;
        img {
          //margin-top: calc((100% - 82px)/2);

          position: relative;
          width: 148px;
          //height: 84px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
.el-icon-plus {
  @lineColor: #999;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: linear-gradient(90deg, @lineColor, @lineColor), linear-gradient(90deg, @lineColor, @lineColor);
  background-size: 2px 100%, 100% 2px;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
