import { defineStore } from 'pinia';
import { SysManageState } from './storeType';
import { getSysDeptList, getSysJobList } from '@/api/system/api/SysApi';

const UseSysManageStore = defineStore('sysManage', {
  // state 初始值
  state: (): SysManageState => ({
    deptOption: [],
    jobOption: []
  }),
  actions: {
    async queryDeptOption() {
      try {
        const res = await getSysDeptList();
        const list = res.data || [];
        this.deptOption = list;
        return list;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async queryJobOption() {
      try {
        const res = await getSysJobList();
        const list = res.data || [];
        this.jobOption = list;
        return list;
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  }
});

export default UseSysManageStore;
