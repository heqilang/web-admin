<template>
  <div class="base-table" v-loading="loading">
    <el-table
      :size="tableSize"
      ref="tableRef"
      :border="border"
      row-key="id"
      :element-loading-background="loadingBGC"
      :stripe="isStripe"
      :data="tableData"
      style="width: 100%"
      :height="bodyHeight"
      @row-click="rowClick"
      @select="selectRow"
      :header-cell-style="headerStyle"
      :cell-style="cellStyle"
      @select-all="selectAllRow"
      @selection-change="selectionChange"
      :row-class-name="activeRowClassName"
      :tree-props="treeProp"
    >
      <el-table-column align="center" v-if="showCheckBox" type="selection" width="60" :selectable="judgeSelectable">
      </el-table-column>

      <el-table-column v-if="showTbNum" type="index" width="60" align="center" label="序号"> </el-table-column>

      <el-table-column label="单选" align="right" width="70" v-if="showRadio">
        <template v-slot="scope">
          <el-radio v-model="tableRadio" :label="scope.row['id']" @input="radioChange(scope.row)">
            {{ '' }}
          </el-radio>
        </template>
      </el-table-column>

      <el-table-column
        :align="item.align || 'left'"
        v-for="(item, i) in tableHead"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sort"
        :key="i"
        :show-overflow-tooltip="item.tooltip ?? true"
        :min-width="item.minWidth"
        :fixed="item.fixed"
        :width="item.width"
      >
        <template v-slot="scope">
          <div v-if="item.isButtons">
            <el-button
              size="small"
              @click.stop="handleClick(scope.row, btn.option)"
              :style="btn.style"
              link
              v-for="(btn, b) in item.buttons"
              :key="b"
            >
              {{ btn.text }}
            </el-button>
          </div>
          <!-- 小圆点 -->
          <div v-if="item.isDot" class="dot-box">
            <!-- 指定dotTypeMatch匹配className  -->
            <i class="dot" :class="[item.dotTypeMatch[scope.row[item.prop]]]"></i>
          </div>
          <div v-if="item.status || item.isTag" class="status-box">
            <span class="dot" :class="dotClass(item, scope.row)"></span>
            <span> {{ getNameByMap(item, scope.row) }} </span>
          </div>
          <div v-else-if="item.arr">
            <span :key="va" v-for="(it, va) in item.arr.filter(a => a.value === scope.row[item.prop])">
              {{ it.label }}
            </span>
          </div>
          <div v-else-if="item.isSvg" :style="{ color: svgColor(scope.row.flow_icon_color) }">
            <svg-icon :name="scope.row[item.prop]" :w="18" :h="18"></svg-icon>
          </div>
          <div v-else-if="item.isMoney" style="display: inline-block">
            <span>{{ scope.row[item.prop] }}</span>
          </div>
          <div v-else-if="item.isDate" style="display: inline-block">
            <span>{{ scope.row[item.prop] }}</span>
          </div>
          <div v-else-if="item.isDom" style="display: inline-block">
            <span v-html="scope.row[item.prop]"></span>
          </div>
          <div v-else-if="item.slot" style="display: inline-block">
            <slot :name="item.slot" :row="scope.row" :index="scope.$index"></slot>
          </div>
          <div v-else-if="item.isFile" style="display: inline-block">
            <el-button
              link
              :disabled="!(scope.row[item.prop] && scope.row[item.prop].length)"
              :class="!(scope.row[item.prop] && scope.row[item.prop].length) ? 'empty-file' : ''"
              size="mini"
              @click="showFiles(scope.row[item.prop])"
            >
              <svg-icon name="icon-file" :w="18" :h="18"></svg-icon>
            </el-button>
          </div>
          <div v-else style="display: inline-block">
            <span>{{ scope.row[item.prop] }}</span>
          </div>
        </template>
      </el-table-column>

      <slot name="actions"></slot>

      <div></div>
    </el-table>
    <div class="pagination-wrap">
      <el-pagination
        :background="hasBackground"
        v-if="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:current-page.sync="currPage"
        :page-sizes="pageSizes"
        :page-size="size"
        :layout="layout"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      append-to-body
      width="500px"
      v-model:visible.sync="showFileModal"
      title="附件"
      :close-on-click-modal="false"
    >
      <div style="min-height: 100px; width: 90%; margin: auto">
        <fileList :data="fileData" show-name :inline="false" show-index />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch, computed } from 'vue';
import fileList from '@/components/fileList.vue';
import { ElMessage } from 'element-plus';

const prop = defineProps({
  /* 勾选行的id */
  selectIds: { type: Array },
  /* 是否展示checkBox */
  showCheckBox: { type: Boolean, default: false },
  /* 是否展示radio */
  showRadio: { type: Boolean, default: false },
  /* 是否展示序号 */
  showIndex: { type: Boolean, default: true },
  /* 是否展示分页 */
  pagination: { type: Boolean, default: false },
  /* 是否带边框 */
  border: { type: Boolean, default: false },
  /* 斑马纹 */
  isStripe: { type: Boolean, default: true },
  /* 分页展示条数数组 */
  pageSizes: { type: Array, default: () => [10, 20, 50, 100, 200] },
  /* 分页组件布局 */
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  /* 分页展示条数数组 */
  size: { type: Number, default: 10 },
  /* 分页总条数 */
  total: { type: Number, default: 0 },
  /* 分页当前页 */
  page: { type: Number },
  /* 表头 */
  tableHead: { type: Array, required: true },
  /* 表格数据 */
  tableData: { type: Array, required: true },
  /* 表格size */
  tableSize: { type: String, default: '' },
  /* 表格宽度 */
  tableWidth: { type: String, default: 'width: 100%' },
  /* 表格补充高度 */
  bcHeight: { type: Number, default: 0 },
  /* 表格高度 */
  tableHeight: { type: String, default: '' },
  /* loading */
  loading: { type: Boolean, default: false },
  /* 是否显示背景 */
  hasBackground: { type: Boolean, default: false },
  /* 警情处置id */
  activeId: { type: [Number, String], default: 0 },
  /* loading样式 */
  loadingBGC: { type: String, default: '' },
  /* 表格高度可传入 */
  heightStyle: { type: String, default: null },
  treeProp: { type: Object, default: () => ({}) },
  /* 是否显示列表编号 */
  showTbNum: { type: Boolean, default: false }
});
const emit = defineEmits(['btnEvn', 'paginationEvn', 'rowClick', 'on-select', 'selectionData', 'radioData']);

const bodyHeight = ref(400);
const currPage = ref(1);
const headerStyle = ref({
  'background-color': '#F3F6FA',
  color: '#555',
  padding: '6px 0'
});
const cellStyle = ref({ padding: '4px 0' });
const fileData = ref([]);
const showFileModal = ref(false);
const tableRadio = ref(null);
const tableRef = ref(null);
// 状态dot class 匹配不上不展示dot圆点
const dotClass = computed(() => {
  return function (item, data) {
    const { statusMap, prop, prop2 } = item;
    if (!statusMap) return 'none';
    return statusMap[data[prop2 || prop]] || 'none';
  };
});
// 显示字段映射 不存在则使用原始值
const getNameByMap = computed(() => {
  return function (item, data) {
    const { nameMap, prop } = item;
    if (!data[prop] && data[prop] !== 0) return '';
    if (!nameMap) return data[prop];
    return nameMap[data[prop]] || data[prop];
  };
});

onMounted(() => {
  // 页面第一次加载执行一次
  setDgHeight();
  // 浏览器大小改变时执行
  window.onresize = () => {
    setDgHeight();
  };
});

watch(prop.tableData, () => {
  tableRef.value.doLayout();
});
watch(
  () => prop.page,
  newValue => {
    currPage.value = newValue || 1;
  },
  { deep: true, immediate: true }
);

/** 设置-列表高度 */
function setDgHeight() {
  if (prop.tableHeight) {
    bodyHeight.value = prop.tableHeight;
    return;
  }
  const bch = prop.bcHeight;
  nextTick(() => {
    // 表格
    const tbDom = tableRef.value;
    if (tbDom) {
      // 根元素 #app元素

      // app-main元素
      const appMainDom = document.querySelector('.app-main');
      // 不允许最外层区域有滚动条
      appMainDom.style.overflowY = 'hidden';

      // 获取路由面包屑高度，固定高度52px
      const breadcrumbDomHeight = 52;

      // 获取列表框顶部工具栏对象
      const tbToolDom = document.querySelector('.top_search_box');
      // 获取列表框顶部工具栏高度
      const tbToolDomHeight = tbToolDom?.offsetHeight || 0;

      // 获取列表框顶部额外按钮对象（新增、导出、导入）
      const tbExtraDom = document.querySelector('.top_extra_btn');
      // 获取列表框顶部额外按钮高度
      const tbExtraDomHeight = tbExtraDom?.offsetHeight || 0;

      // 获取列表框顶部区域对象
      const tbTopDom = document.querySelector('.top_dom');
      // 获取列表框顶部区域对象高度
      const tbTopDomHeight = tbTopDom?.offsetHeight || 0;

      // 获取列表框顶部tab元素对象
      const tbTabDom = document.querySelector('.el-tabs');
      // 获取列表框顶部tab元素高度
      const tbTabDomHeight = tbTabDom?.offsetHeight || 0;

      // 重新计算表格的高度
      bodyHeight.value =
        document.documentElement.clientHeight -
        110 -
        breadcrumbDomHeight -
        tbToolDomHeight -
        tbExtraDomHeight -
        tbTopDomHeight -
        tbTabDomHeight -
        bch;
    }
  });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function selectionRow(selectIds) {
  prop.tableData.forEach(item => {
    // selectIds为已选数据
    nextTick(() => {
      prop.selectIds.find(obj => {
        // userData 表单数据
        if (item.id === obj) {
          tableRef.value.toggleRowSelection(item, true);
        }
      });
    });
  });
}
function showFiles(data) {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  fileData.value = data || [];
  if (!fileData.value.length) {
    ElMessage.info('无附件');
    return;
  }
  showFileModal.value = true;
}
/* 按钮点击事件 */
function handleClick(row, btn) {
  emit('btnEvn', { row, btn });
}
/* 切换size事件 */
function handleSizeChange(data, type = 'size') {
  emit('paginationEvn', { data, type });
}

/* 分页点击事件 */
function handleCurrentChange(data, type = 'page') {
  emit('paginationEvn', { data, type });
  // tableRef.value.bodyWrapper.scrollTop = 0;
  tableRef.value.setScrollTop(0);
}

/* 行点击事件 */
function rowClick(row, column, event) {
  emit('rowClick', { row, column, event });
}

function selectRow(selection, _row) {
  handleSelect(selection);
}
function selectAllRow(selection) {
  handleSelect(selection);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleSelect(selection) {
  const selectedRowArr = [];
  selection.forEach(item => {
    selectedRowArr.push(item.id);
  });
  // if (true || selectedRowArr.length > 0) {
  emit('on-select', selectedRowArr);
  // }
}
function activeRowClassName({ row, _rowIndex }) {
  if (row.id === prop.activeId) {
    return 'active-row';
  }
  if (row.status === '异常') {
    return 'error-row';
  }
  return 'table-row';
}
// 勾选事件
function selectionChange(array) {
  emit('selectionData', array);
  // this.selectionData = array
}
function radioChange(array) {
  emit('radioData', array);
  // this.selectionData = array
}
function judgeSelectable(_row, _index) {
  return true;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setString(data) {
  data === 'undefined' && (data = '');
  return data.toString();
}
/* 清空用户选择 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clearSelection() {
  tableRef.value.clearSelection();
}
/* 获取已选中行 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAllSelRow() {
  // this.$emit('getAllSel',  this.$refs.table.selection)
  return tableRef.value.selection;
}
function svgColor(str = '') {
  return str.startsWith('#') ? str : `#${str}`;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toggleRowSelection(data, status = true) {
  data.map(it => {
    const row = prop.tableData.find(i => i.id === it);
    row && tableRef.value.toggleRowSelection(row, status);
  });
}
</script>

<style lang="scss" scoped>
.base-table {
  width: 100%;
  height: 100%;

  .active-row {
    background: #0079dc;
  }
  .dot-box {
    .dot {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-color: #ccc;
      border-radius: 50%;
    }
    .normal {
      background-color: #00ff00;
    }
    .success {
      background-color: #67c23a;
    }
    .primary {
      background-color: #409eff;
    }
    .danger {
      background-color: #e00065;
    }
  }

  .status-box {
    span {
      vertical-align: middle;
    }
    .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      background-color: #409eff;
      margin-right: 3px;
      border-radius: 50%;
    }
    .none {
      display: none !important;
    }
    .primary {
      background-color: #409eff;
    }
    .success {
      background-color: #67c23a;
    }
    .warning {
      background-color: #ffb92f;
    }
    .info {
      background-color: #ccc;
    }
    .error,
    .danger {
      background-color: #e00065;
    }
  }
  .empty-file {
    color: #666;
  }

  /* 覆盖样式 */
  :deep() {
    .el-table__indent {
      padding-left: 0 !important;
    }

    .table-header {
      background-color: #edf5fc;
      height: 50px;
    }
    .el-table th {
      background-color: #f3f6fa;
    }
    // 行高亮
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #e1e8f6;
    }
    .el-table__body tr.hover-row > td {
      background-color: #e1e8f6;
    }
    // 普通行样式
    .table-row {
      color: #666;
    }
    .el-table .error-row {
      background-color: #f1abca !important;
    }
    .pagination-wrap {
      display: flex;
      justify-content: flex-end;
      .el-pagination {
        padding: 10px 5px;
      }
    }
  }
}
</style>
