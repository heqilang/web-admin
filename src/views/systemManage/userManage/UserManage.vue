<template>
  <div>
    <div class="top_dom">
      <div class="user-top-des">
        <span class="dot"></span>
        <span>可根据运营需要自定义添加用户，多人协作</span>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div class="top-handle-box">
          <span class="label">角色</span>
          <el-select v-model="data.echoSearch.role_id" placeholder="全部" clearable>
            <template v-for="(item, index) in data.roleList" :key="index">
              <el-option v-if="item.id" :label="item.role_name" :value="item.id" />
            </template>
          </el-select>
          <el-input placeholder="请输入姓名" clearable v-model="data.echoSearch.user_name" />
          <el-button type="primary" @click="getUserList(true)">
            <el-icon class="el-icon--left"> <i-ep-search /> </el-icon>
          </el-button>
        </div>
        <div>
          <el-button style="text-align: right" type="primary" @click="add">
            <el-icon class="el-icon--left"> <i-ep-plus /> </el-icon>新增
          </el-button>
        </div>
      </div>
    </div>
    <BaseTable
      :tableData="data.userTable.row_list"
      :total="data.userTable.rows_count"
      pagination
      :page="page.page_num"
      :size="page.page_size"
      :tableHead="tableHead"
      @paginationEvn="paginationEvn"
    >
      <template #actions>
        <el-table-column width="180" align="center" label="操作">
          <template v-slot="scope">
            <el-button class="primary" link @click="showAdjust(scope.row)">调整角色</el-button>
            <el-button class="danger" link @click="lockUser(scope.row)">
              {{ scope.row.status_mark === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </template>
    </BaseTable>
    <el-dialog :title="title" v-model="adjustVisible" class="padd1020" width="28%" @closed="close">
      <el-form
        style="width: 90%; margin: auto"
        :model="data.adjustForm"
        :rules="rules"
        ref="adjustFormRef"
        label-width="68px"
      >
        <el-form-item label="姓名" prop="id">
          <el-input v-model="data.adjustForm.user_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="手机号" prop="user_mobile">
          <el-input v-model="data.adjustForm.user_mobile" />
        </el-form-item>
        <el-form-item label="部门" prop="dept_id">
          <el-select v-model="data.adjustForm.dept_id" filterable>
            <template v-for="item in deptList" :key="item.dept_id">
              <el-option v-if="item.dept_id" :label="item.dept_list_name" :value="item.dept_id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="job_id">
          <el-select v-model="data.adjustForm.job_id" filterable>
            <template v-for="item in jobList" :key="item.job_id">
              <el-option v-if="item.job_id" :label="item.job_list_name" :value="item.job_id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="user_role_id_list">
          <el-select multiple v-model="data.adjustForm.user_role_id_list" placeholder="无">
            <template v-for="(item, index) in data.roleList" :key="index">
              <el-option v-if="item.id" :label="item.role_name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="adjustRemote">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { UserData } from './user';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import UseSysManageStore from '@/store/sysManage';
import { Page } from '@/types/common';
import {
  addSysUser,
  disableSysUser,
  enableSysUser,
  getSysRoleList,
  getSysUserList,
  updateSysUser
} from '@/api/system/api/SysApi';

const adjustFormRef = ref<FormInstance>();

const tableHead = [
  { label: '姓名', prop: 'user_name' },
  { label: '手机号', prop: 'user_mobile' },
  { label: '角色列表', prop: 'user_role_list_str' },
  { label: '部门', prop: 'dept_name' },
  { label: '岗位', prop: 'job_name' },
  { label: '最后登录时间', prop: 'logined_time' },
  {
    label: '状态',
    prop: 'status_mark',
    status: true,
    statusMap: { 1: 'primary', 0: 'error' },
    nameMap: { 1: '启用', 0: '禁用' }
  }
];
const rules = {
  login_user_pwd: [{ required: true, trigger: 'blur', message: '请输入登陆密码' }]
};
const title = ref('');
const adjustVisible = ref(false);
const data = reactive<UserData>({
  search: {},
  echoSearch: {},
  adjustForm: {},
  roleList: [],
  userTable: { row_list: [], rows_count: 0 }
});
const page = reactive<Page>({
  page_num: 1,
  page_size: 10
});

onMounted(() => {
  init();
});
function init() {
  getUserList();
  getRoleList();
}

// 用户修改、新增弹框表单选择项
const sysManageStore = UseSysManageStore();
const deptList = computed(() => sysManageStore.deptOption);
const jobList = computed(() => sysManageStore.jobOption);
watch(adjustVisible, val => {
  if (val) {
    if (deptList.value.length === 0) {
      sysManageStore.queryDeptOption();
    }
    if (jobList.value.length === 0) {
      sysManageStore.queryJobOption();
    }
  }
});

/* 获取角色 */
function getRoleList() {
  getSysRoleList()
    .then(res => {
      if (res.state === 0 && res.data) {
        data.roleList = res.data;
      } else {
        data.roleList = [];
      }
    })
    .catch(err => {
      console.error(err);
    });
}

/* 获取用户列表 */
function getUserList(isSearch?: boolean) {
  if (isSearch) {
    page.page_num = 1;
    data.search = data.echoSearch;
  }
  const { role_id = '', user_name = '' } = data.search;
  const params = {
    page_num: page.page_num || 1,
    page_size: page.page_size || 10,
    role_id,
    user_name
  };

  getSysUserList(params)
    .then(res => {
      if (res.state === 0 && res.data) {
        data.userTable = res.data;
      } else {
        data.userTable = {
          row_list: [],
          rows_count: 0
        };
      }
    })
    .catch(err => {
      console.error(err);
    });
}

/* 启用|禁用用户 */
function lockUser(row: any) {
  const enable = row.status_mark !== 1;
  ElMessageBox.confirm(`确认${enable ? '启用' : '禁用'}该用户?`, `${enable ? '启用' : '禁用'}用户`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const api = enable ? enableSysUser : disableSysUser;
      api(row.id).then(res => {
        if (res.state === 0) {
          ElMessage({
            type: 'success',
            message: res.msg
          });
          getUserList();
        }
      });
    })
    .catch(err => {
      console.error(err);
      ElMessage({
        type: 'info',
        message: '已取消'
      });
    });
}

/* 调整dialog */
function showAdjust(row: any) {
  title.value = '调整角色';
  adjustVisible.value = true;
  data.adjustForm = { ...row };
}
function add() {
  title.value = '新增';
  adjustVisible.value = true;
}
function close() {
  data.adjustForm = {};
  adjustVisible.value = false;
}

/* 调整ajax */
function adjustRemote() {
  adjustFormRef.value?.validate(valid => {
    if (valid) {
      const api = title.value === '新增' ? addSysUser : updateSysUser;
      api(data.adjustForm).then(res => {
        if (res.state === 0) {
          ElMessage({
            type: 'success',
            message: res.msg
          });
          adjustVisible.value = false;
          getUserList();
        }
      });
    } else {
      console.error('error submit!!');
      return false;
    }
  });
}
/* 分页变化 */
function paginationEvn({ data, type }: { data: number; type: 'size' | 'page' }) {
  if (type === 'size') {
    page.page_size = data;
  }
  if (type === 'page') {
    page.page_num = data;
  }
  getUserList();
}
</script>
<style lang="scss">
.user-top-des {
  width: 95%;
  border: 1px solid rgb(244, 244, 244);
  font-size: 14px;
  margin: 0 0 10px 0;
  color: #9c9898;
  vertical-align: middle;
  padding: 15px 0;
  display: flex;
  align-items: center;
  .dot {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #ccc;
    border-radius: 50%;
    margin-right: 8px;
    margin-left: 16px;
  }
}
.top-handle-box {
  padding: 8px 0;
  .label {
    margin-right: 8px;
    color: #777;
  }
  .el-select,
  .el-input {
    width: 150px;
  }
  .el-select + .el-input {
    margin-left: 8px;
  }

  .el-input + .el-button {
    margin-left: 8px;
  }
}
</style>
