<template>
  <div class="navbar">
    <div class="left">
      <img src="/images/hz-cfc-logo.png" class="logo" width="30" height="30" alt="logo" />
      <span>{{ title }}</span>
    </div>
    <firstMenu></firstMenu>
    <div class="right">
      <rightPanel></rightPanel>
    </div>
  </div>
</template>

<script setup>
import firstMenu from './firstMenu.vue';
import rightPanel from './rightPanel.vue';

const title = import.meta.env.VITE_APP_SYSTEM_NAME;
</script>
<style lang="less" scoped>
.navbar {
  display: flex;
  align-items: center;
  font-size: 13px;
  min-height: 45px;
  color: #fff;
  background-color: #409eff;
  .left {
    width: 226px !important;
    white-space: nowrap;
    cursor: pointer;
  }
  .logo {
    vertical-align: middle;
    margin: 0 10px 0 16px;
    border-radius: 100%;
  }
  .right {
    position: absolute;
    right: 16px;
  }
}
</style>
