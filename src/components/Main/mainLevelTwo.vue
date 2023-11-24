<template>
  <div style="height: calc(100% - 51px)">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'LayoutMain'
};
</script>
<style lang="less" scoped>
div {
  & > div {
    height: 100%;
  }
}
</style>
