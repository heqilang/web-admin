import { defineStore } from 'pinia';
import { PermissionState } from './storeType';
import router from '@/router';
import { getPermission } from '@/api/system/api/SysApi';

const UsePermissionStore = defineStore('permissionStore', {
  state: (): PermissionState => ({
    permissionArr: [],
    sideBar: [],
    menu1Name: '',
    sideActive: ''
  }),
  actions: {
    SET_PERMISSION(arr: any[]) {
      this.permissionArr = arr;
    },
    SET_MENU1(txt: string) {
      this.menu1Name = txt;
    },
    SET_BAR(arr: any[]) {
      this.sideBar = arr;
    },
    getSideBar() {
      const menuAll = this.permissionArr;
      const thisRoute = router.currentRoute.value;
      if (thisRoute.name) {
        const matched = thisRoute.matched.filter(item => item.meta?.title);
        if (matched[0]) {
          const firstMenu = matched[0].name;
          const sidebar = menuAll.find(item => item.name === firstMenu);
          if (sidebar) {
            this.sideBar = sidebar.children;
          }
        }
      }
    },
    async generateRoutes() {
      const response = await getPermission();
      const { data } = response || {};
      if (data?.module_list && data.module_list.length > 0) {
        const filterList = data.module_list;
        this.permissionArr = filterList;
        this.getSideBar();
        return filterList;
      } else {
        throw new Error('当前用户没有分配菜单');
      }
    }
  }
});

export default UsePermissionStore;
