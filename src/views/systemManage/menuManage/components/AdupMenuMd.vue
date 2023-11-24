<template>
  <el-dialog
    class="adup-menu-md"
    :title="mdTitle"
    :close-on-click-modal="false"
    :model-value="mdData.state"
    :append-to-body="true"
    @close="closeMd"
    width="600px"
  >
    <el-form ref="adupMenuFmRef" :model="submitFormData" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="菜单中文名称"
            prop="title"
            :rules="[{ required: true, message: '菜单中文名称不能为空' }]"
          >
            <el-input
              v-model="submitFormData.title"
              placeholder="请输入菜单中文名称 eg：用户列表"
              maxlength="30"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单英文名称" prop="name" :rules="[{ required: true, message: '菜单英文名称不能为空' }]">
            <el-input
              v-model="submitFormData.name"
              placeholder="请输入菜单英文名称 eg：user-list"
              maxlength="30"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item
            label="菜单图标名称"
            prop="icon"
            :rules="[{ required: false, message: '菜单图标名称不能为空' }]"
          >
            <el-input
              v-model="submitFormData.icon"
              placeholder="请输入菜单图标名称 eg：el-icon-user"
              maxlength="30"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="text-center">
        <el-button type="primary" @click="submitForm" :loading="load">
          <el-icon class="el-icon--left">
            <i-ep-check />
          </el-icon>
          保存
        </el-button>
        <el-button type="warning" @click="closeMd">
          <el-icon class="el-icon--left">
            <i-ep-close />
          </el-icon>
          关闭
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { menuAdd, menuUpdate } from '@/api/system/api/SysApi';
import { MenuListVO } from '@/entity/system';
import { ElMessage, FormInstance } from 'element-plus';

import { computed, reactive, ref, watch } from 'vue';
interface AdupMenuMdProps {
  mdData: Record<string, any>;
}
const props = defineProps<AdupMenuMdProps>();
const emit = defineEmits(['mdClose', 'reloadDg']);

const pobj = computed(() => props.mdData?.pobj || null);
const obj = computed(() => props.mdData?.obj || null);
const mdTitle = computed(() => {
  // 处理弹框标题
  if (pobj.value) {
    return `${obj.value ? '修改' : '添加'}【${pobj.value.title}（${pobj.value.name}）】子菜单`;
  } else {
    return `${obj.value ? '修改' : '添加'}菜单`;
  }
});

const adupMenuFmRef = ref<FormInstance>();

const load = ref(false);
const submitFormData = reactive<MenuListVO>({
  // 菜单中文名称
  title: '',
  // 菜单英文名称
  name: '',
  // 菜单图标名称
  icon: '',
  // 模块ID
  module_id: '',
  // 修改ID
  id: '',
  // 父级菜单ID
  upper_id: ''
});
watch(
  () => props.mdData,
  val => {
    if (val) {
      submitFormData.title = val.obj?.title;
      submitFormData.name = val.obj?.name;
      submitFormData.icon = val.obj?.icon;
      submitFormData.id = val.obj?.id;
      submitFormData.module_id = val?.module_id;
      submitFormData.upper_id = pobj.value?.id;
    }
  },
  { deep: true, immediate: true }
);

// 关闭弹框
function closeMd() {
  emit('mdClose', { state: false });
}
// 重新加载列表
function reloadDg() {
  emit('reloadDg');
}

// 表单提交
function submitForm() {
  adupMenuFmRef.value?.validate((valid: boolean) => {
    if (!submitFormData.module_id) {
      ElMessage.warning('菜单模块ID不能为空');
      return false;
    }

    if (!valid) {
      return false;
    } else {
      load.value = true;

      // 新增/修改使用不同请求方法
      const reqMeth = submitFormData.id ? menuUpdate(submitFormData) : menuAdd(submitFormData);
      reqMeth
        .then(({ state, msg }) => {
          load.value = false;

          if (state === 0) {
            ElMessage.success(!submitFormData.id ? '添加成功' : '修改成功');

            // 重新加载
            reloadDg();
            // 关闭弹框
            closeMd();
          } else {
            ElMessage.error(msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  });
}
</script>
