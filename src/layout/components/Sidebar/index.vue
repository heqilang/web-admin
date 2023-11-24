<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!--  :default-openeds="['myZone']" 加了此效果会导致点击其他的不能展开-->
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.subMenuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="select_menu"
        :default-openeds="defaultOpeneds"
      >
        <div v-for="item in sideBar" :key="item.id">
          <el-menu-item v-if="item.children === null || item.children.length === 0" :index="item.name">
            <i :class="'iconfont icon' + item.icon"></i>
            <template #title>
              <span>{{ item.title }}</span>
            </template>
          </el-menu-item>
          <el-sub-menu v-else :index="item.name">
            <template #title>
              <i :class="'iconfont icon' + item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item-group v-for="cItem in item.children" :key="cItem.id">
              <el-menu-item :index="cItem.name">
                <i :class="'iconfont icon' + cItem.icon"></i>
                <template #title>
                  <span>{{ cItem.title }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import UsePermissionStore from '@/store/permission';
import variablesCss from '@/styles/variables.scss?inline';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const menu1Name = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title);
  const firstMenu = matched[0]?.name;
  return firstMenu;
});

watch(menu1Name, () => {
  UsePermissionStore().getSideBar();
});
onMounted(() => {
  UsePermissionStore().getSideBar();
});

const variables = computed(() => variablesCss);
const defaultOpeneds = ref(['civilizedPosition']);
const activeMenu = computed(() => {
  const { meta, name } = route;
  // 如果是二级路由，则选中父级菜单
  if (meta.pname) {
    return meta.pname;
  } else {
    if (meta.activeMenu) {
      return meta.activeMenu;
    }
    return name;
  }
});
const sideBar = computed({
  get() {
    return UsePermissionStore().sideBar;
  },
  set(val) {
    UsePermissionStore().sideBar = val;
  }
});

function select_menu(index) {
  router.push({ name: index });
}
</script>
<script>
export default {
  name: 'SideBar'
};
</script>
