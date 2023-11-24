<template>
  <div>
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in list"
        :key="index"
        :timestamp="item.timestamp"
        color="#25A6FF"
        placement="top"
      >
        <div class="content">
          {{ item.content }}
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  list: {
    type: Array,
    default: () => {
      return [];
    }
  }
});
</script>

<style scoped lang="scss">
:deep .el-timeline-item__tail {
  border-left: 2px solid #a5daff;
}
:deep .el-timeline-item__timestamp {
  font-size: 16px;
  font-family: Alibaba PuHuiTi 2;
  font-weight: normal;
  color: #ffffff;
}
.content {
  height: 40px;
  background: linear-gradient(90deg, #0e488c 0%, rgba(14, 72, 140, 0) 100%);
  border-radius: 20px 0px 0px 20px;
  line-height: 40px;
  padding: 0 10px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi 2;
  font-weight: normal;
  color: #ffffff;
}
:deep .el-timeline {
  li:last-child {
    .el-timeline-item__node {
      background: linear-gradient(0deg, #ffe500 0%, #ff8d00 100%) !important;
    }
  }
}
</style>
