<template>
  <div class="table-list" :class="{ isclick: props.isclick }">
    <ElTable
      v-loading="props.loading"
      :data="props.tableData"
      :fit="true"
      :height="props.heightStyle"
      @row-click="onRowClick"
      @cell-click="onCellClick"
    >
      <ElTableColumn v-if="showIndex" type="index" align="center" label="序号" width="60"></ElTableColumn>
      <ElTableColumn
        v-for="(item, index) in data"
        :key="index"
        :prop="item.data"
        :label="item.name"
        :width="item.width"
        :align="item.align"
        :show-overflow-tooltip="item.overflow"
      >
        <template v-slot="scope">
          <span v-if="['phone', 'mobile', 'holderMobile'].includes(item.data)" class="flex">
            <PhoneUi
              :userInfo="{ mobile: scope.row[item.data], index: index + 1, desensitize: item.desensitize }"
            ></PhoneUi>
          </span>
          <span v-else-if="['id_card', 'idCard', 'id_no', 'idNo'].includes(item.data)" class="flex">
            <IdCardUi :userInfo="{ id_card: scope.row[item.data] }" :desensitize="item.desensitize"></IdCardUi>
          </span>
          <span v-else-if="item.slot">
            <slot :name="item.slot" :row="scope.row" :index="scope.$index"></slot>
          </span>
          <span v-else>{{ scope.row[item.data] }}</span>
        </template>
      </ElTableColumn>
    </ElTable>
    <div v-if="props.pagination" class="table-list__pagination example-pagination-block">
      <ElPagination
        background
        layout="total,prev, pager, next, jumper  "
        :total="props.total"
        :page-size="props.pageSize"
        :current-page="props.pageNum"
        @current-change="$emit('handleCurrentChange', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import PhoneUi from './PhoneUi.vue';
import IdCardUi from './IdCardUi.vue';
import { PropType, watch, ref } from 'vue';
const emits = defineEmits<{
  cellClick: [row: any, column: any, cell: any, event: any];
  rowClick: [row: any, column: any, event: any];
  handleCurrentChange: [currentPage: number];
}>();

const props = defineProps({
  tableData: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => []
  },
  tableHeadData: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => []
  },
  isclick: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 20
  },
  pageNum: {
    type: Number,
    default: 1
  },
  loading: {
    type: Boolean,
    default: false
  },
  heightStyle: {
    type: String,
    default: null
  },
  showIndex: {
    type: Boolean,
    default: false
  }
});
const data: any = ref([]);
// 数据改变后实时加载脱敏后的值
watch(
  () => props.tableData,
  () => {
    data.value = props.tableHeadData.map(x => {
      x.desensitize = true;
      return x;
    });
  },
  {
    deep: true,
    immediate: true
  }
);
function onCellClick(row: any, column: any, cell: any, event: any) {
  emits('cellClick', row, column, cell, event);
}
function onRowClick(row: any, column: any, event: any) {
  emits('rowClick', row, column, event);
}
</script>

<style lang="scss" scoped>
.table-list {
  border: 1px solid #42bddc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  :deep() {
    .el-table {
      color: #fff;
      border: none !important;
      background-color: transparent !important;

      th.el-table__cell,
      td.el-table__cell {
        border-bottom: 1px solid #1f66ad;
        background-color: transparent !important;
        padding: 8px 0 !important;
      }

      thead {
        color: #fff;
        background: linear-gradient(0deg, rgb(28, 59, 104), rgb(47, 61, 82));
        height: 40px;
        tr {
          background: linear-gradient(0deg, rgb(28, 59, 104), rgb(47, 61, 82));
        }
      }
      tbody {
        tr:nth-child(odd) {
          background: rgba(29, 113, 255, 0.08);
          color: #fff;
        }
        tr:nth-child(even) {
          background: rgb(28, 44, 70);
          color: #fff;
        }
        tr:hover {
          box-shadow: rgba(37, 166, 255, 0.8) 0 0 1.25rem inset;
          color: #fff !important;
          cursor: pointer;
        }
      }
      td.el-table__cell div {
        white-space: initial !important;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        cursor: pointer;
      }
      &::before {
        background-color: transparent;
      }
      .el-loading-mask {
        background-color: rgba(0, 0, 0, 0.6);
      }
      .el-table--border .el-table__inner-wrapper::after,
      .el-table--border::after,
      .el-table--border::before,
      .el-table__inner-wrapper::before {
        background-color: transparent;
      }
    }

    .el-table__empty-block {
      text-align: center;
      padding: 24px 0;
    }
  }
}

.table-list.isclick {
  :deep() {
    .el-table tbody tr:hover {
      box-shadow: rgba(#25a6ff, 0.8) 0px 0px 20px inset;
      color: #fff !important;
      cursor: pointer;
    }

    .el-table__row:hover .el-table__cell {
      background-color: rgba(#1d71ff, 0.08) !important;
      // border: none;
      color: #fff !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.table-list {
  // 分页样式处理
  //  分页
  .table-list__pagination {
    font-size: 26px !important;
    display: flex;
    justify-content: flex-end;
    padding: 6px;
  }
  :deep() {
    .pagination-wrap {
      display: flex;
      justify-content: flex-end;
    }
    .el-pagination {
      display: flex;
      align-items: center;
      white-space: nowrap;
      padding: 0.125rem 0.3125rem;
      color: #303133;
      font-weight: 700;
      font-size: 14px;
      margin-top: 8px;
    }

    .el-pager {
      // height: 60px !important;
      display: flex;
      align-items: center;
    }

    .el-pager li {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-width: 24px;
      height: 24px;
      margin: 0 !important;
      font-size: 14px !important;
      background-color: transparent !important;
      color: white !important;

      &.number {
        margin-top: 0px !important;
        font-family: D-DIN, sans-serif;
      }
      &.is-active {
        background-color: #1477ff !important;
        color: white !important;
        border-radius: 4px;
      }
    }

    .el-pager li:hover {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .el-pagination button {
      // width: 50px !important;
      // height: 50px;
    }

    .el-pagination .btn-next .el-icon,
    .el-pagination .btn-prev .el-icon {
    }

    .el-pagination__total {
      color: white !important;
      // height: 50px !important;
      display: flex !important;
      align-items: center !important;
    }

    .el-pagination button:disabled {
      background-color: transparent !important;
    }

    .el-pagination__jump {
      color: white !important;
      display: flex !important;
      align-items: center !important;
      margin-left: 0;

      .el-pagination__editor.el-input {
        border-color: rgba(20, 119, 255, 1);

        .el-input__inner {
          background: transparent;
          background-color: transparent;
          color: #ffffff;
        }
      }
    }
    .el-pagination__goto,
    .el-pagination__classifier {
      font-size: 14px;
      margin-right: 0;
    }
    .el-pagination .btn-next,
    .el-pagination .btn-prev {
      color: white;
      background-color: transparent !important;
      padding: 0;
      width: 20px !important;
      border: none;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        border: none;
        color: #409eff;
      }
    }
    .el-pagination .btn-prev {
      margin-left: 8px;
    }
    .el-pager li.btn-quicknext,
    .el-pager li.btn-quickprev {
      color: white;
    }

    .el-table .highlight-row {
      background-color: #337ff1 !important;
    }
    .el-input__wrapper {
      background: rgba(20, 31, 54, 1);
      width: 56px;
      height: 21px;
      box-sizing: border-box;
      margin: 0 9px;
      border: 1px solid #25a6ff;
      padding: 5px 8px;
      box-shadow: none;
      line-height: 21px;
      .el-input__inner {
        line-height: 21px;
      }
    }
  }
}
</style>
