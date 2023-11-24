import { MenuListVO, ModuleMenuListVO, RoleVO } from '@/entity/system';

interface CheckedType {
  checked?: boolean;
}

interface MenuListCheckedVO extends MenuListVO, CheckedType {
  children?: MenuListCheckedVO[];
}
interface ModuleMenuListCheckedVO extends ModuleMenuListVO, CheckedType {
  children?: MenuListCheckedVO[];
}

export interface RoleCheckedVO extends RoleVO, CheckedType {
  module_list?: ModuleMenuListCheckedVO[];
}

export interface RoleData {
  prop: any;
  sysModuleList: ModuleMenuListCheckedVO[];
  baseInfo: RoleDto;
}
