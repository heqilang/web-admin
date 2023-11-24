<template>
  <ul v-if="menu1Name">
    <li
      v-for="(item, index) in permissionArr"
      :key="index"
      :class="menu1Name === item.name ? 'active' : ''"
      @click="changeMenu1(item)"
    >
      {{ item.title }}
    </li>
  </ul>
</template>
<script setup>
import UsePermissionStore from '@/store/permission';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const permissionArr = computed(() => UsePermissionStore().permissionArr);
const menu1Name = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title);
  const firstMenu = matched[0]?.name;
  return firstMenu;
});

function getMenu(_data) {
  //这里写死只有2层
  if (_data[0].children && _data[0].children.length > 0) {
    return _data[0].children[0].name;
  } else {
    return _data[0].name;
  }
}
function changeMenu1(item) {
  router.push({ name: getMenu(item.children) });
}
</script>
<style lang="less" scoped>
ul {
  display: flex;
  li {
    padding: 0 20px;
    line-height: 45px;
    cursor: pointer;
    white-space: nowrap;
  }
  li:hover,
  li.active {
    background-color: #3a8ee6;
  }
}
</style>
