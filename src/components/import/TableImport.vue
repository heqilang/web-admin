<template>
  <div class="import_class">
    <el-button type="primary" @click="to_import">
      <el-icon class="el-icon--left">
        <i-ep-upload />
      </el-icon>
      导入
    </el-button>
    <el-dialog
      title="导入"
      :close-on-click-modal="false"
      v-model="state.importDialog"
      width="570px"
      :append-to-body="props.isAppend"
      class="padd1020"
    >
      <h2>一、请按照数据模板的格式准备要导入的数据</h2>
      <section>
        <p>
          <el-button v-if="props.hasTmp" link size="small" :loading="state.tmp_load" @click="to_down_temp"
            >点击下载导入模板文件</el-button
          >
          <span v-else>无需下载模板，按照导出的数据修改，直接上传</span>
        </p>
      </section>
      <h2>二、请选择需要导入的文件</h2>
      <section>
        <p style="padding: 5px 0">
          <el-upload
            class="upload-demo"
            :action="action"
            :headers="{ Authorization: state.token }"
            :file-list="state.importFileList"
            :on-progress="uploading"
            :on-success="uploadSuccess"
            :on-remove="uploadRemove"
            :on-error="uploadFail"
            v-loading.fullscreen.lock="state.fullLoading"
            element-loading-text="上传中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-button size="small">
              <el-icon class="el-icon--left">
                <i-ep-UploadFilled />
              </el-icon>
              点击上传
            </el-button>
          </el-upload>
        </p>
      </section>
      <h2>三、导入结果</h2>
      <section v-if="showResult">
        <p class="success">本次导入成功{{ state.importInfo.successCount }}条数据</p>
        <p class="fail">
          本次导入失败{{ state.importInfo.failureCount }}条数据<span v-if="state.importInfo.failureCount > 0"
            >，已生成错误报告</span
          >,
          <a v-if="state.importInfo.failureCount > 0" @click="to_down_error" style="font-weight: 600"
            >点击下载错误报告</a
          >
        </p>
      </section>
      <section v-if="!showResult">
        <p v-if="state.status === 1" class="success">本次导入成功</p>
        <p v-if="state.status === 2" class="fail">本次导入失败</p>
      </section>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="to_close" size="small">
            <el-icon class="el-icon--left">
              <i-ep-close />
            </el-icon>
            关 闭</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ImportMicroServer'
};
</script>
<script setup>
import { getToken } from '@/utils/auth';
import { computed, reactive } from 'vue';
import { ElMessage } from 'element-plus';
const emit = defineEmits(['getNewData', 'downTemp']);

const props = defineProps({
  /** 导入api */
  apiUrl: {
    type: String,
    required: true
  },
  /** 是否有导入模板 */
  hasTmp: {
    type: Boolean,
    default: true
  },
  /** 弹框是否页面插入根节点 */
  isAppend: {
    type: Boolean,
    default: false
  },
  /** 是否展示详细导入结果 */
  showResult: {
    type: Boolean,
    default: true
  }
});
const state = reactive({
  tmp_load: false,
  token: 'Bearer ' + getToken(),
  BASE_URL: import.meta.env.VITE_APP_BASE_URL,
  importDialog: false,
  importFileList: [], //以上为导入相关参数
  loadingTmp: false,
  fullLoading: false,
  afterAdd: false,
  isImportSuccess: 0,
  successCount: 0,
  errorArr: [],
  isWrongSheet: false,
  importInfo: {
    successCount: 0,
    failureCount: 0,
    fileName: '',
    error_report_url: ''
  },
  status: 0
});
const action = computed(() => {
  if (!props.apiUrl) return '';
  return props.apiUrl.startsWith('http') ? props.apiUrl : state.BASE_URL + props.apiUrl;
});

function to_close() {
  // 导入dialog
  state.importDialog = false;
  emit('getNewData');
}

function to_down_temp() {
  emit('downTemp');
  state.tmp_load = true;
  setTimeout(() => {
    state.tmp_load = false;
  }, 1500);
}
function to_down_error() {
  return '';
  // getError({ fileName: state.importInfo.fileName })
  //   .then(res => {
  //     if (res) {
  //       const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
  //       const url = window.URL.createObjectURL(blob);
  //       // 创建a标签
  //       const link = document.createElement('a');
  //       link.href = url;
  //       // 重命名文件
  //       link.download = '导入文件-错误日志';
  //       link.click();
  //       // 释放内存
  //       URL.revokeObjectURL(url);
  //     }
  //   })
  //   .catch(() => {
  //     //
  //   });
}

function uploadSuccess(response, _file, _fileList) {
  if (response.state === 0) {
    state.importInfo = response.data;
    state.status = 1;
  } else {
    ElMessage.error(response.msg + '请下载最新模版');
    state.status = 2;
  }
  state.fullLoading = false;
}
function uploadFail() {
  state.fullLoading = false;
  state.isWrongSheet = true;
  state.afterAdd = false;
}
function uploading() {
  state.fullLoading = true;
}
function uploadRemove() {
  state.afterAdd = false;
}
function to_import() {
  state.importDialog = true;
  state.importFileList = [];
  state.import_msg = '';
  state.status = 0;
}
</script>
<style lang="less" scoped>
.import_class {
  display: inline-block;
  margin: 0 10px;
}
h2 {
  font-weight: normal;
  color: #333;
  font-size: 14px;
}
section {
  padding-left: 30px;
}
.success {
  color: #409eff;
  font-size: 13px;
}
.fail {
  color: #ff0066;
  font-size: 13px;
}
</style>
