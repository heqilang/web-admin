<template>
  <div style="padding: 0 16px 16px 16px; height: 100%; box-sizing: border-box">
    <!-- 所有二层路由指向 需要写配置的面包屑，我的地盘/状态/详情-->
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb/BaseBreadcrumb.vue';
</script>
