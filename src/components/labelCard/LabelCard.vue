<template>
  <div class="label-card">
    <div v-if="title" class="label-card-title">
      <div v-if="showReact" class="label-card-react" :style="{ backgroundColor: reactColor }"></div>
      <span>{{ title }}</span>
    </div>
    <div class="label-card-wrapper">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
export interface LabelCardProps {
  /**
   * 标题
   */
  title?: string;
  /** 展示react */
  showReact?: boolean;
  /** react颜色 */
  reactColor?: string;
}
withDefaults(defineProps<LabelCardProps>(), {
  title: '',
  showReact: true,
  reactColor: '#409eff'
});
</script>
<style scoped lang="scss">
.label-card {
  height: inherit;

  .label-card-title {
    display: flex;
    align-items: center;
    .label-card-react {
      width: 4px;
      height: 20px;
      background-color: #409eff;
    }
    span {
      font-size: 20px;
      font-weight: bold;
      margin-left: 8px;
    }
  }
  .label-card-wrapper {
    padding: 16px;
    box-sizing: border-box;
  }
}
</style>
