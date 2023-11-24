export type Page = {
  page_num: number;
  page_size: number;
};

export type BaseTableColumn<T extends string> = {
  label: string;
  prop: T;
  width?: number;
  align?: 'left' | 'center' | 'right';
  slot?: string;
  sort?: boolean | string;
  tooltip?: boolean;
  minWidth?: number;
  fixed?: boolean;
  isButtons?: boolean;
  buttons?: any[];
  isDot?: boolean;
  dotTypeMatch?: Record<string, string>;
  isTag?: boolean;
  status?: boolean | string;
  arr?: any[];
  isSvg?: boolean;
  isMoney?: boolean;
  isDate?: boolean;
  isDom?: boolean;
  isFile?: boolean;
};

/**
 * vue使用reactive定义表格类型
 */
export type TableReactive<T> = {
  page: Page & { total: number };
  list: Array<T>;
  tableHead: BaseTableColumn<keyof T>[];
};

export interface CondRow {
  key: string;
  operator: '=' | '!=' | 'like' | '>=' | '>' | '<' | '<=';
  value: any;
}

/**
 * 通用搜索
 * conditionWhereType 0并且 1或者
 */
export interface BaseSearch {
  pageNum: number;
  pageSize: number;
  /** 0所有条件同时满足  1条件任意满足一项 */
  conditionWhereType?: 0 | 1;
  condList: CondRow[];
}

// 枚举是否
export enum EnumType {
  是 = 1,
  否 = 0
}

/**
 * 操作类型
 */
export enum OperateType {
  新增 = 'add',
  编辑 = 'edit',
  删除 = 'delete',
  详情 = 'detail',
  导出 = 'export',
  导入 = 'import',
  下载 = 'download'
}
// 操作类型key
export type ActionTypeStr = keyof typeof OperateType;
// 操作类型value
export type ActionType = `${OperateType}`;
