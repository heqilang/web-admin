<template>
  <div>
    <el-radio-group v-model="settingType">
      <el-radio-button label="部门设置"></el-radio-button>
      <el-radio-button label="岗位设置"></el-radio-button>
    </el-radio-group>

    <div class="top-handle-warper">
      <el-button v-show="settingType == '部门设置'" class="f_r" type="primary" @click="addDept">新增部门</el-button>
    </div>
    <div class="table-warper" v-show="settingType == '部门设置'">
      <BaseTable
        :tableData="list.topSysDeptList"
        :tableHead="tableHead1"
        :treeProp="{ children: 'sub_dept_list', hasChildren: 'hasChildren' }"
      >
        <template #actions>
          <el-table-column width="240" align="center">
            <template v-slot="scope">
              <el-button link class="primary" @click="addDept(scope.row)">新增子部门</el-button>
              <el-button link class="warning" @click="editDept(scope.row)">编辑</el-button>
              <el-button link class="danger" @click="deleteDept(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </BaseTable>
    </div>

    <div class="table-warper" v-show="settingType == '岗位设置'">
      <BaseTable
        :tableData="list.topSysJobList"
        :tableHead="tableHead2"
        :treeProp="{ children: 'sub_job_list', hasChildren: 'hasChildren' }"
      >
        <template #actions>
          <el-table-column width="240" align="center">
            <template v-slot="scope">
              <el-button link class="primary" @click="addJob(scope.row)">新增子岗位</el-button>
              <el-button link class="warning" @click="editJob(scope.row)">编辑</el-button>
              <el-button link class="danger" @click="deleteJob(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </BaseTable>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :title="(data.deptForm.id ? '修改' : '新增') + '部门'"
      v-model="deptVisible"
      width="25%"
      class="padd1020"
    >
      <el-form :model="data.deptForm" :rules="rules" ref="deptFormRef" label-width="90px">
        <el-form-item label="上级部门" prop="upper_id">
          <el-select v-model="data.deptForm.upper_id" placeholder="无">
            <template v-for="item in list.sysDeptList" :key="item.dept_id">
              <el-option v-if="item.dept_id" :label="item.dept_list_name" :value="item.dept_id"> </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="dept_name">
          <el-input v-model="data.deptForm.dept_name"></el-input>
        </el-form-item>
        <el-form-item label="部门备注" prop="dept_comment">
          <el-input type="textarea" :rows="3" v-model="data.deptForm.dept_comment"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="deptVisible = false">取 消</el-button>
          <el-button type="primary" @click="deptRemote">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :title="(data.jobForm.id ? '修改' : '新增') + '岗位'"
      v-model="jobVisible"
      width="25%"
    >
      <el-form :model="data.jobForm" :rules="rules" ref="jobFormRef" label-width="90px">
        <el-form-item label="上级岗位" prop="upper_id">
          <el-select v-model="data.jobForm.upper_id" placeholder="无">
            <template v-for="item in list.sysJobList" :key="item.job_id">
              <el-option v-if="item.job_id" :label="item.job_list_name" :value="item.job_id"> </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位名称" prop="job_name">
          <el-input v-model="data.jobForm.job_name"></el-input>
        </el-form-item>
        <el-form-item label="岗位备注" prop="job_comment">
          <el-input type="textarea" :rows="3" v-model="data.jobForm.job_comment"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="jobVisible = false">取 消</el-button>
          <el-button type="primary" @click="jobRemote">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue';
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { OrginizationState, OrginizationForm } from './organize';
import {
  addSysDept,
  addSysJob,
  deleteSysDept,
  deleteSysJob,
  getSysDeptList,
  getSysJobList,
  getTopSysDeptList,
  getTopSysJob,
  updateSysDept,
  updateSysJob
} from '@/api/system/api/SysApi';
const tableHead1 = [
  { prop: 'dept_name', label: '部门' },
  { prop: 'dept_comment', label: '备注' }
];
const tableHead2 = [
  { prop: 'job_name', label: '岗位名称' },
  { prop: 'job_comment', label: '备注' }
];
const rules = {
  dept_name: [{ required: true, message: '请输入部门名称' }],
  dept_comment: [{ required: true, message: '请输入部门备注' }],
  job_name: [{ required: true, message: '请输入岗位名称' }],
  job_comment: [{ required: true, message: '请输入岗位备注' }]
};

const settingType = ref('部门设置');
const isEdit = ref(false);
const data = reactive<OrginizationForm>({
  deptForm: {},
  jobForm: {}
});

const jobVisible = ref(false);
const deptVisible = ref(false);
const list = reactive<OrginizationState>({
  topSysDeptList: [],
  topSysJobList: [],
  sysDeptList: [],
  sysJobList: []
});

const deptFormRef = ref<FormInstance>();
const jobFormRef = ref<FormInstance>();

/* 打开弹窗新增/编辑部门 */
function addDept(row: any) {
  deptVisible.value = true;
  isEdit.value = false;
  if (row.id) {
    data.deptForm.upper_id = row.id;
    data.deptForm.dept_name = '';
    data.deptForm.dept_comment = '';
  }
}
function editDept(row: any) {
  deptVisible.value = true;
  isEdit.value = true;
  data.deptForm = row;
}
/* ajax 新增/编辑部门 */
function deptRemote() {
  deptFormRef.value?.validate(valid => {
    if (valid) {
      let result;
      if (isEdit.value) {
        if (data.deptForm.upper_id === data.deptForm.id) {
          ElMessage.error('上级部门不能是当前部门');
          return false;
        }
        result = updateSysDept(data.deptForm);
      } else {
        result = addSysDept(data.deptForm);
      }
      result.then(res => {
        if (res.state === 0) {
          ElMessage({
            type: 'success',
            message: res.msg
          });
          deptVisible.value = false;
          queryTopSysDeptList();
          querySysDeptList();
        }
      });
    } else {
      console.error('error submit!!');
      return false;
    }
  });
}
function deleteDept(row: any) {
  ElMessageBox.confirm('此操作将删除该部门, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteSysDept(row.id).then(res => {
        if (res.state === 0) {
          ElMessage({
            type: 'success',
            message: res.msg
          });
          queryTopSysDeptList();
          querySysDeptList();
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消'
      });
    });
}
/* 打开弹窗新增/编辑岗位 */
function addJob(row: any) {
  jobVisible.value = true;
  isEdit.value = false;
  if (row.id) {
    data.jobForm = { upper_id: row.id, job_name: '', job_comment: '' };
  }
}
function editJob(row: any) {
  jobVisible.value = true;
  isEdit.value = true;
  data.jobForm = row;
}
/* ajax 新增/编辑岗位 */
function jobRemote() {
  jobFormRef.value?.validate(valid => {
    if (valid) {
      let response;
      if (isEdit.value) {
        if (data.jobForm.upper_id === data.jobForm.id) {
          ElMessage.error('上级岗位不能是当前岗位');
          return false;
        }
        response = updateSysJob(data.jobForm);
      } else {
        response = addSysJob(data.jobForm);
      }
      response.then(res => {
        if (res.state === 0) {
          ElMessage({
            type: 'success',
            message: res.msg
          });
          jobVisible.value = false;
          queryTopSysJobList();
          querySysJobList();
        }
      });
    } else {
      console.error('error submit!!');
      return false;
    }
  });
}
function deleteJob(row: any) {
  ElMessageBox.confirm('此操作将删除该岗位, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteSysJob(row.id).then(res => {
        if (res.state === 0) {
          ElMessage({
            type: 'success',
            message: res.msg
          });
          queryTopSysJobList();
          querySysJobList();
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消'
      });
    });
}

function queryTopSysDeptList() {
  getTopSysDeptList().then(res => {
    if (res.state === 0) {
      list.topSysDeptList = res.data ?? [];
    }
  });
}
function querySysDeptList() {
  getSysDeptList().then(res => {
    if (res.state === 0) {
      list.sysDeptList = res.data ?? [];
    }
  });
}
function queryTopSysJobList() {
  getTopSysJob().then(res => {
    if (res.state === 0) {
      list.topSysJobList = res.data ? [res.data] : [];
    }
  });
}
function querySysJobList() {
  getSysJobList().then(res => {
    if (res.state === 0) {
      list.sysJobList = res.data ?? [];
    }
  });
}
onMounted(() => {
  queryTopSysDeptList();
  querySysDeptList();
  queryTopSysJobList();
  querySysJobList();
});
</script>
<style lang="scss" scoped>
.f_r {
  float: right;
}

.top-handle-warper {
  overflow: hidden;
  padding: 10px 0;
  min-height: 46px;
}

.el-select {
  width: 100%;
}
</style>
