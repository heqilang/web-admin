import { DeptIdNameVO, JobIdNameVO } from '@/entity/system';

/**
 * pinia使用的数据接口
 */
export interface PermissionState {
  permissionArr: any[];
  sideBar: any[];
  menu1Name: string;
  sideActive: string;
}
export interface TagsViewState {
  visitedViews: Record<string, any>[];
  cachedViews: Record<string, any>[];
}

export interface SysManageState {
  deptOption: DeptIdNameVO[];
  jobOption: JobIdNameVO[];
}
