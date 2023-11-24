<template>
  <div class="app-wrapper">
    <div class="top_menu">
      <navbar />
    </div>
    <div style="padding-top: 55px; padding-bottom: 10px; box-sizing: border-box; height: 100%">
      <sidebar class="sidebar-container" />

      <!-- :style="{height:minHei+'px',overflow:'auto'}" -->
      <div class="app_content" id="appContent">
        <!-- <app-main /> -->
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import AppMain from './components/AppMain.vue';
import Navbar from './components/Navbar/NavbarMain.vue';
import Sidebar from './components/Sidebar/index.vue';
export default {
  name: 'LayoutPage',
  components: {
    AppMain,
    Navbar,
    Sidebar
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.scss';

.top_menu {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 45px;
  z-index: 200;
}
.app_content {
  // position: absolute;
  // left: 226px;
  // top: 55px;
  // right: 6px;
  // bottom: 10px;
  height: calc(100vh - 65px);
  overflow: auto;
  margin-left: 226px;
  background: #ffffff;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
