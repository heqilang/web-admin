<template>
  <section class="app-main">
    <router-view v-slot="{ Component }" :key="key">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup>
import UseTagsViewStore from '@/store/tagsView';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const cachedViews = computed(() => UseTagsViewStore().cachedViews);
const key = computed(() => route.path);
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  padding: 16px;
  box-sizing: border-box;

  /* 添加/修改/详情等非表格页面需要有滚动条 */
  :deep(.single-page) {
    height: calc(100% - 20px);
    overflow-y: auto;
  }
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
