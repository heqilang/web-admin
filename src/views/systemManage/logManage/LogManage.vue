<template>
  <div>
    <div class="top_search_box">
      <div class="col">
        <span class="label">操作人</span>
        <el-select
          v-model="formData.user_name"
          filterable
          remote
          reserve-keyword
          placeholder="请输入"
          remote-show-suffix
          :remote-method="remoteMethod"
          :loading="loading"
          clearable
        >
          <template v-for="item in userList">
            <el-option
              v-if="item.id && item.user_name"
              :key="item.id"
              :label="item.user_name"
              :value="item.user_name"
            />
          </template>
        </el-select>
      </div>
      <div class="col">
        <span class="label">操作时间</span>
        <el-date-picker
          v-model="formData.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="选择开始时间"
          end-placeholder="选择结束时间"
          value-format="YYYY-MM-DD"
          clearable
        />
      </div>
      <div class="col">
        <span class="label">操作模块</span>
        <el-select v-model="formData.module" filterable clearable placeholder="请选择">
          <template v-for="(value, key) in moduleList">
            <el-option v-if="value" :key="key" :label="value" :value="value" />
          </template>
        </el-select>
      </div>
      <div class="col">
        <span class="label">操作内容</span>
        <el-input v-model="formData.content" clearable />
      </div>
      <div class="col">
        <el-button type="primary" @click="queryList()">搜索</el-button>
        <el-button @click="resetFormData">重置</el-button>
      </div>
    </div>

    <BaseTable
      :tableData="tableData.list"
      :total="tableData.page.total"
      :page="tableData.page.page_num"
      :size="tableData.page.page_size"
      :tableHead="tableData.tableHead"
      pagination
      showTbNum
      @paginationEvn="paginationEvn"
    />
  </div>
</template>
<script setup lang="ts">
import { getLogModule, getLogPage, getSysUserList } from '@/api/system/api/SysApi';
import { UserVO } from '@/entity/system';
import { TableReactive } from '@/types/common';
import { LogVo, LogSelectVo } from '@/types/log';
import { onMounted, reactive, ref } from 'vue';

/**
 * @description 搜索表单
 */
const formData = ref<LogSelectVo>({});
/**
 * @description 重置表单
 */
function resetFormData() {
  formData.value = {};
  queryList();
}

const tableData = reactive<TableReactive<LogVo>>({
  page: {
    page_num: 1,
    page_size: 10,
    total: 0
  },
  list: [],
  tableHead: [
    { prop: 'user_name', label: '操作人' },
    { prop: 'op_time', label: '操作时间' },
    { prop: 'op_module_name', label: '操作模块' },
    { prop: 'op_content', label: '操作内容' },
    { prop: 'op_user_ip', label: 'IP地址' }
  ]
});
/**
 * @description 查询操作模块表单
 */
const moduleList = ref({});
getLogModule().then(res => {
  if (res.state === 0) {
    moduleList.value = res.data ?? {};
  }
});

onMounted(() => {
  queryList();
});

function queryList() {
  const param = Object.assign(formData.value, tableData.page);
  // 处理时间范围
  if (param.timeRange && param.timeRange.length > 0) {
    param.start_time = param.timeRange[0] as string;
    param.end_time = param.timeRange[1] as string;
  } else {
    delete param.start_time;
    delete param.end_time;
    delete param.timeRange;
  }

  getLogPage(param).then(res => {
    if (res.state === 0) {
      tableData.list = res.data?.row_list ?? [];
      tableData.page.total = res.data?.rows_count ?? 0;
    }
  });
}
/**
 * 分页事件
 */
const paginationEvn = ({ data, type }: { data: number; type: 'page' | 'size' }) => {
  if (type === 'page') {
    tableData.page.page_num = data;
  }
  if (type === 'size') {
    tableData.page.page_size = data;
  }
  queryList();
};

/**
 * @description 操作人搜索列表查询
 */
const loading = ref(false);
const userList = ref<UserVO[]>([]);
async function remoteMethod(query: string) {
  if (query) {
    loading.value = true;
    const res = await getSysUserList({
      page_num: 1,
      page_size: 1000,
      user_name: query
    });
    if (res.state === 0) {
      userList.value = res.data?.row_list ?? [];
    } else {
      userList.value = [];
    }
    loading.value = false;
  } else {
    userList.value = [];
  }
}
</script>
