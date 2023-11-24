<template>
  <div v-loading="loading" class="menu-list" style="height: calc(100%)">
    <div class="top_search_box">
      <div>
        <el-form :inline="true" :model="dg" class="demo-form-inline">
          <el-form-item label="菜单模块">
            <el-select v-model="dg.ps.module_id" placeholder="请选择菜单模块" readonly>
              <el-option v-for="it in dg.menuModuleArr" :key="it.id" :label="it.title" :value="it.id"> </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="getTbList">
              <el-icon class="el-icon--left">
                <i-ep-search />
              </el-icon>
              搜索
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div>
        <el-button type="success" @click="setAdupMenuMd({ state: true, type: 1 })">
          <el-icon class="el-icon--left">
            <i-ep-plus />
          </el-icon>
          新增一级菜单
        </el-button>

        <el-button type="danger" @click="updateSort(1)">
          <el-icon class="el-icon--left"> <i-ep-top /> </el-icon>上移
        </el-button>

        <el-button type="warning" @click="updateSort(2)"
          ><el-icon class="el-icon--left">
            <i-ep-bottom />
          </el-icon>
          下移
        </el-button>
      </div>
    </div>

    <BaseTable
      :tableData="dg.list"
      :tableHead="dg.thead"
      :treeProp="{ children: 'children', hasChildren: 'hasChildren' }"
      :bcHeight="-40"
      :showTbNum="true"
      :showRadio="true"
      @radioData="radioRow"
    >
      <template v-slot:title="{ row }">
        <b v-if="!row.upper_id">{{ row.title }}</b>
        <span v-else>{{ row.title }}</span>
      </template>

      <template v-slot:pid="{ row }">
        <span>{{ !row.upper_id ? '' : row.upper_id }}</span>
      </template>

      <template #icon="{ row }">
        <i v-if="row.icon && row.icon.indexOf('el-icon') !== -1" :class="row.icon" style="font-size: 20px"> </i>
        <span v-else>{{ row.icon }}</span>
      </template>
      <template #actions>
        <el-table-column width="240" align="center">
          <template v-slot="{ row }">
            <el-button
              v-if="!row.upper_id"
              link
              class="success"
              @click="setAdupMenuMd({ state: true, pobj: row, type: 2 })"
            >
              添加子菜单
            </el-button>

            <el-button
              link
              class="primary"
              @click="setAdupMenuMd({ state: true, obj: row, type: !row.upper_id ? 1 : 2 })"
            >
              编辑
            </el-button>

            <el-button link class="danger" @click="delData(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </template>
    </BaseTable>

    <AdupMenuMd :mdData="adupMenuMd" @mdClose="setAdupMenuMd" @reloadDg="getTbList" />
  </div>
</template>
<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue';
import AdupMenuMd from './components/AdupMenuMd.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { MenuManageDg, AdupMenuMdProps } from './menuManage';
import { getSysModuleList, menuDelete, sysMenuTreeList, updateMenuSort } from '@/api/system/api/SysApi';

const loading = ref(false);
const dg = reactive<MenuManageDg>({
  // 表格数据
  list: [],
  ps: {
    // 排序字段
    orderField: 'id',
    // 排序方式
    order: 'desc',

    // 所属模块
    module_id: undefined
  },
  // 列表头
  thead: [
    { label: '中文名称', prop: 'title', slot: 'title' },
    { label: '英文名称', width: 200, prop: 'name' },
    { label: '排列序号', width: 100, prop: 'seq', align: 'center' },
    { label: '图标名称', width: 150, prop: 'icon', slot: 'icon' },
    { label: '上级菜单ID', prop: 'upper_id', align: 'center', slot: 'pid' },
    { label: '菜单ID', prop: 'id', align: 'center' }
  ],

  // 选中的行数据
  radioRow: null,
  // 菜单模块数组
  menuModuleArr: []
});
const adupMenuMd = reactive<AdupMenuMdProps>({ state: false });

// 选择单元框
function radioRow(row: any) {
  dg.radioRow = row;
}
/**
 * 获取列表数据
 */
function getTbList() {
  const ps = dg.ps;
  if (!ps.module_id) return;

  loading.value = true;
  sysMenuTreeList(ps).then(res => {
    loading.value = false;

    const { state, data } = res;
    if (state === 0 && data) {
      dg.list = data;
    }
  });
}
// 删除
function delData(row: any) {
  ElMessageBox.confirm(
    `<b class="c-red">删除菜单【${row.title}（${row.name}）】将会删除角色与此菜单关联的数据，请谨慎操作？</b>`,
    '删除提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-icon-check',
      cancelButtonClass: 'el-icon-close',
      closeOnClickModal: false,
      dangerouslyUseHTMLString: true,
      type: 'warning'
    }
  )
    .then(function () {
      loading.value = true;

      menuDelete([row.id]).then(res => {
        loading.value = false;

        const { state } = res;
        if (state === 0) {
          ElMessage.success('删除成功');
          getTbList();
        }
      });
    })
    .catch(e => console.error(e));
}

// 打开/关闭-新增/修改字典类型-弹框
function setAdupMenuMd(e: any) {
  if (e.state) {
    // 打开
    if (e?.type === 1) {
      // 添加/修改一级菜单
      adupMenuMd.obj = e?.obj || null;
    } else if (e?.type === 2) {
      // 添加/修改子级菜单
      adupMenuMd.pobj = e?.pobj || null;
      adupMenuMd.obj = e?.obj || null;
    } else {
      return;
    }

    // 菜单模块ID
    adupMenuMd.module_id = dg.ps.module_id;
    // 打开弹框
    adupMenuMd.state = true;
  } else {
    // 隐藏
    adupMenuMd.module_id = null;
    adupMenuMd.pobj = null;
    adupMenuMd.obj = null;

    // 关闭弹框
    adupMenuMd.state = false;
  }
}

/**
 * 上移/下移-菜单
 * @param way 1-上移 2-下移
 */
function updateSort(way: any) {
  const treeList = dg.list;
  const row = dg.radioRow;
  if (!row) {
    ElMessage.error('请选择一行数据');
    return;
  }

  let valList = [];
  if (!row.upper_id) {
    // 一级菜单
    valList = treeList;
  } else {
    // 子菜单
    // 找到当前选中行的同级数据
    const pmenu = treeList.find(it => it.id === row.upper_id);
    valList = pmenu?.children ?? [];
  }

  // 找到当前选中行在树型列表中的位置
  const index = valList.findIndex((it: any) => it.id === row.id);
  if (index === -1) {
    ElMessage.error('选中行不在列表中');
    return;
  }

  if (way === 1 && index === 0) {
    ElMessage.error('当前菜单已在同级第一行，不能再上移');
    return;
  } else if (way === 2 && index === valList.length - 1) {
    ElMessage.error('当前菜单已在同级最后一行，不能再下移');
    return;
  }

  // 目标菜单
  const nextRow = way === 1 ? valList[index - 1] : valList[index + 1];
  loading.value = true;
  updateMenuSort({ prevId: row.id, nextId: nextRow.id }).then(res => {
    loading.value = false;
    const { state } = res;
    if (state === 0) {
      ElMessage.success('菜单移动成功');
      getTbList();
    }
  });
}

onMounted(async () => {
  // 获取所有菜单模块列表
  const res = await getSysModuleList();
  if (res.state === 0 && res.data) {
    dg.menuModuleArr = res.data;
    // 默认选中第一个
    dg.ps.module_id = dg.menuModuleArr[0].id;
  }

  // 初始化表格数据
  getTbList();
});
</script>
<style lang="scss" scoped>
.top_search_box {
  justify-content: space-between;
}
</style>
