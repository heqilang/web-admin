/**
 * 将类型下所有字段变为可选属性
 */
declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
