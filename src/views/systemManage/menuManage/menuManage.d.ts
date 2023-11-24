import { MenuListVO } from '@/entity/system';
import { BaseTableColumn } from '@/types/common';

export interface QueryMenuManageDto {
  // 排序字段
  orderField: string;
  // 排序方式
  order: string;

  // 所属模块
  module_id?: string;
}
export interface MenuTableRaw {
  id: string;
}

export interface MenuListDTO extends MenuListVO {
  children?: MenuListDTO[];
}

export interface MenuManageDg {
  list: MenuListDTO[];
  ps: QueryMenuManageDto;
  thead: BaseTableColumn<keyof MenuListVO>[];
  radioRow?: Record<string, any> | null;
  menuModuleArr: Record<string, any>[];
}

export interface AdupMenuMdProps {
  state: boolean;
  obj?: Record<string, any> | null;
  pobj?: Record<string, any> | null;
  module_id?: string | null;
}
