<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect"
          ><span v-if="item.meta.belongTo">{{ item.meta.belongTo }} <i class="lala">/</i></span
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const levelList = ref(null);
watch(route, newValue => {
  if (newValue.path.startsWith('/redirect/')) {
    return;
  }
  getBreadcrumb();
});

function getBreadcrumb() {
  // only show routes with meta.title
  const matched = route.matched.filter(item => item.meta && item.meta.title);

  const newLevelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
  if (newLevelList.length >= 2) {
    levelList.value = newLevelList.slice(newLevelList.length - 2, newLevelList.length);
  } else {
    levelList.value = newLevelList;
  }
}

function handleLink(item) {
  const { redirect } = item;
  if (redirect) {
    router.push(redirect);
    return;
  }
  return;
}
</script>

<style lang="scss" scoped>
.lala {
  margin: 0 9px;
  font-weight: bold;
  color: #c0c4cc;
  font-style: normal;
  font-size: 20px;
  vertical-align: middle;
}
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
<style>
.el-breadcrumb__separator {
  font-weight: normal;
  color: #c0c4cc;
  font-size: 20px;
  vertical-align: middle;
}
</style>
