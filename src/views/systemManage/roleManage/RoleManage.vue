<template>
  <div>
    <div class="user-top-des">
      <span class="dot"></span>
      <span>系统内置角色的模块权限不可调整，不可编辑和删除</span>
    </div>
    <div class="user-content">
      <div class="top-handle-box">
        <el-button style="float: right" type="primary" @click="toDetail()">新增角色</el-button>
      </div>
      <BaseTable :tableData="data.roleList" :tableHead="tableHead">
        <template #actions>
          <el-table-column width="200" align="left" label="操作">
            <template v-slot="scope">
              <el-button class="primary" link @click="toDetail(scope.row)">
                {{ scope.row.role_type === 0 ? '查看' : '编辑' }}
              </el-button>
              <el-button v-if="scope.row.role_type !== 0" class="danger" link @click="deleteRole(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </template>
      </BaseTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { deleteSysRole, getSysRoleList } from '@/api/system/api/SysApi';
import BaseTable from '@/components/BaseTable.vue';
import { RoleVO } from '@/entity/system';
import { ElMessageBox, ElMessage } from 'element-plus';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const tableHead = [
  {
    label: '角色类型',
    prop: 'role_type',
    width: 250,
    status: true,
    statusMap: { 1: 'info', 0: 'info' },
    nameMap: { 1: '自定义角色', 0: '系统内置角色' }
  },
  { label: '角色名称', width: 250, prop: 'role_name' },
  { label: '角色描述', prop: 'role_desc' }
];

const data = reactive<{ roleList: RoleVO[] }>({
  roleList: []
});

/* 删除角色 */
function deleteRole(row: RoleVO) {
  ElMessageBox.confirm(`确认删除角色-<strong style='color: #409eff'>${row.role_name}?</strong>`, `删除角色`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    dangerouslyUseHTMLString: true
  })
    .then(() => {
      if (!row.id) return;
      deleteSysRole({ role_id: row.id }).then(res => {
        if (res.state === 0) {
          ElMessage({
            type: 'success',
            message: res.msg
          });
          getRoleList();
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

/* 查看详情 */
function toDetail(row?: RoleVO) {
  const id = row?.id;
  const role_type = row?.role_type;
  router.push({
    name: id ? 'updateroleInfo' : 'roleInfo',
    query: { id, role_type }
  });
}

/* 获取角色 */
function getRoleList() {
  getSysRoleList()
    .then(res => {
      if (res.state === 0) {
        data.roleList = res.data ?? [];
      } else {
        data.roleList = [];
      }
    })
    .catch(err => {
      console.error(err);
    });
}

onMounted(() => {
  getRoleList();
});
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
  overflow: hidden;
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
