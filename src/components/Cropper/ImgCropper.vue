<template>
  <div class="cropper-com">
    <div @click="openCropper" class="slot-block">
      <slot></slot>
    </div>
    <!--  裁剪按钮-->
    <el-dialog title="裁剪" v-model="state.dialogVisible" width="1000px">
      <div class="main-content">
        <div class="origin-img-block">
          <img src="/images/rrq-logo.png" ref="imageRef" alt="图片" />
        </div>
        <!--裁剪完的图片-->
        <div class="preview">
          <!--  预览的图片  -->
          <h3>预览</h3>
          <div class="before"></div>
          <h3>结果</h3>
          <img v-if="state.afterImg" :src="state.afterImg" alt="图片" />
          <div v-if="!state.afterImg" class="perch"></div>
          <div class="handle-row">
            <el-upload :show-file-list="false" :accept="state.fileTypes.join(',')" :http-request="myUpload">
              <el-button type="primary" @click="sureSava">选择图片</el-button>
            </el-upload>
            <el-button class="tailor-btn" type="primary" @click="sureSava">裁剪</el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button :loading="state.uploadLoading" :disabled="!state.afterImg" type="primary" @click="confirmCropper">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch, watchEffect } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { ElMessage } from 'element-plus';
const MAX_SIZE = 20;
const emits = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  aspectRatio: {
    type: Number,
    default: 16 / 9
  }
});
// 裁剪的图片
const imageRef = ref<HTMLImageElement | null>(null);
const state = reactive<Record<string, any>>({
  // 裁剪后的图片
  afterImg: '',
  // 进行裁剪
  myCropper: null,
  dialogVisible: false,
  // 点击确认后的上传中
  uploadLoading: false,
  fileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
});
watchEffect(() => {
  if (imageRef.value) {
    imageRef.value.src = props.modelValue;
  }
});
watch(
  () => state.dialogVisible,
  val => {
    if (val) {
      nextTick(() => {
        if (!imageRef.value) return;
        if (state.myCropper && imageRef.value.src) {
          state.myCropper.replace(imageRef.value.src);
          state.afterImg = '';
        } else {
          initCropper(imageRef.value);
        }
      });
    }
  }
);
const initCropper = (image: HTMLImageElement) => {
  state.myCropper = new Cropper(image, {
    /*
        * viewMode 视图控制
          - 0 无限制
          - 1 限制裁剪框不能超出图片的范围
          - 2 限制裁剪框不能超出图片的范围 且图片填充模式为 cover 最长边填充
          - 3 限制裁剪框不能超出图片的范围 且图片填充模式为 contain 最短边填充
        * */
    viewMode: 0,
    // 设置图片是否可以拖拽功能
    /*
        * dragMode 拖拽图片模式
          - crop 形成新的裁剪框
          - move 图片可移动
          - none 什么也没有
        * */
    dragMode: 'crop',
    // 是否显示图片后面的网格背景,一般默认为true
    background: true,
    // 进行图片预览的效果
    preview: '.cropper-com .preview .before',
    // 设置裁剪区域占图片的大小 值为 0-1 默认 0.8 表示 80%的区域
    autoCropArea: 0.8,
    // 设置图片是否可以进行收缩功能
    zoomOnWheel: true,
    // 是否显示 + 箭头
    center: true,
    aspectRatio: props.aspectRatio
  });
};
const openCropper = () => {
  state.dialogVisible = true;
};
const beforeImgUpload = (rawFile: File) => {
  if (!state.fileTypes.includes(rawFile.type)) {
    ElMessage.error('只能选择JPG、JPEG、PNG、webp类型的图片');
    return false;
  } else if (rawFile.size / 1024 / 1024 > MAX_SIZE) {
    ElMessage.error(`图片尺寸超过${MAX_SIZE}MB!`);
    return false;
  }
  return true;
};
const sureSava = () => {
  // 拿到裁剪后的图片
  state.afterImg = state.myCropper
    .getCroppedCanvas({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    })
    .toDataURL('image/png'); // 设置图片格式
};
const confirmCropper = () => {
  state.uploadLoading = true;
  state.myCropper
    .getCroppedCanvas({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    })
    .toBlob((blob: Blob) => {
      const file = new File([blob], state.fileName || 'xxx.png', { type: 'image/png' });
      const res = { file, url: URL.createObjectURL(file) };
      state.uploadLoading = false;
      state.dialogVisible = false;
      emits('update:modelValue', res.url);
      emits('change', res);
    });
};
const myUpload = (file: { file: File }) => {
  if (beforeImgUpload(file.file)) {
    const tempUrl = URL.createObjectURL(file.file);
    state.fileName = file.file.name;
    state.myCropper.replace(tempUrl);
    state.afterImg = '';
  }
  return Promise.resolve();
};
const setState = (data: any) => {
  Object.keys(data).forEach(key => {
    state[key] = data[key];
  });
};
defineExpose({ setState });
</script>

<style scoped lang="less">
.cropper-com {
  .slot-block {
    display: inline-block;
  }
}
.before {
  width: 150px;
  height: 150px;
  position: relative;
  overflow: hidden;
}
.main-content {
  display: flex;
  column-gap: 2rem;
  align-items: center;
  justify-content: center;
  & > div {
    height: 500px;
    img {
      display: block;
    }
  }
  .origin-img-block {
    flex: 1;
    overflow: hidden;
  }
  .preview {
    width: 332px;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 4px;
    & > img {
      width: 300px;
      height: 170px;
      margin: 16px auto;
      border: 1px dashed #ccc;
      background-color: #fff;
      object-fit: contain;
    }
    .before {
      height: 85px;
    }
    .perch {
      width: 300px;
      height: 170px;
      margin: 16px auto;
      border: 1px dashed #ccc;
      background-color: #fff;
    }
    .handle-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 16px;
    }
    h3:first-of-type {
      margin-top: 0;
    }
  }
}
</style>
