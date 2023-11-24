export type ModuleUpdateDTO = {
  /** 模块ID */
  id?: string;
  /** 模块英文名称 */
  name?: string;
  /** 模块中文名称 */
  title?: string;
  /** 模块图标名称 */
  icon?: string;
};
export type ResultString = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: string;
};
export type MenuUpdateDTO = {
  /** 菜单ID */
  id?: string;
  /** 所属模块ID */
  module_id?: string;
  /** 菜单英文名称 */
  name?: string;
  /** 菜单中文名称 */
  title?: string;
  /** 菜单图标名称 */
  icon?: string;
};
export type UserUpdateDTO = {
  /** 用户ID */
  id?: string;
  /** 用户名称 */
  user_name?: string;
  /** 手机号 */
  user_mobile?: string;
  /** 部门ID */
  dept_id?: string;
  /** 岗位ID */
  job_id?: string;
  /** 角色ID列表 */
  user_role_id_list?: string[];
};
/** 下属菜单列表 */
export type MenuListVO = {
  /** 菜单ID */
  id?: string;
  /** 模块ID */
  module_id?: string;
  /** 菜单英文名称 */
  name?: string;
  /** 菜单中文名称 */
  title?: string;
  /** 菜单图标名称 */
  icon?: string;
  /** 菜单排列序号 */
  seq?: number;
  /** 上级菜单ID */
  upper_id?: string;
  /** 支持快捷入口标记,0-否,1-是 */
  quick_mark?: number;
};
/** 下属菜单列表 */
export type ModuleMenuListVO = {
  /** 模块id */
  id?: string;
  /** 模块英文名称 */
  name?: string;
  /** 模块中文名称 */
  title?: string;
  /** 模块图标名称 */
  icon?: string;
  /** 模块排列序号 */
  seq?: number;
  /** 下属菜单列表 */
  children?: MenuListVO[];
};
export type RoleUpdateDTO = {
  /** 角色ID */
  id?: string;
  /** 角色名称 */
  role_name?: string;
  /** 角色描述 */
  role_desc?: string;
  /** 下属菜单列表 */
  module_list?: ModuleMenuListVO[];
};
export type JobUpdateDTO = {
  /** 岗位ID */
  id?: string;
  /** 岗位名称 */
  job_name?: string;
  /** 备注 */
  job_comment?: string;
  /** 上级岗位ID */
  upper_id?: string;
};
export type DeptUpdateDTO = {
  /** 部门ID */
  id?: string;
  /** 部门名称 */
  dept_name?: string;
  /** 备注 */
  dept_comment?: string;
  /** 上级部门ID */
  upper_id?: string;
};
export type MenuSortDTO = {
  /** 被交换的菜单ID */
  nextId?: string;
  /** 选中的菜单ID */
  prevId?: string;
};
export type UpdateUserPwdDTO = {
  /** 密码 */
  user_pwd?: string;
};
export type UpdateUserMobileDTO = {
  /** 用户手机号 */
  user_mobile?: string;
};
export type UpdateUserBasicDTO = {
  /** 姓名 */
  user_name?: string;
  /** 头像url */
  user_avatar_url?: string;
  /** 备注 */
  user_comment?: string;
};
export type Result = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: any;
};
export type UserResetPasswordDTO = {
  /** 用户手机号 */
  user_mobile?: string;
  /** 密码 */
  user_pwd?: string;
  /** 短信验证码 */
  verify_code?: string;
};
export type ResultObject = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: any;
};
export type ModuleAddDTO = {
  /** 模块英文名称 */
  name?: string;
  /** 模块中文名称 */
  title?: string;
  /** 模块图标名称 */
  icon?: string;
};
export type MenuAddDTO = {
  /** 所属模块ID */
  module_id?: string;
  /** 菜单英文名称 */
  name?: string;
  /** 菜单中文名称 */
  title?: string;
  /** 菜单图标名称 */
  icon?: string;
  /** 上级菜单ID */
  upper_id?: string;
};
export type UserLoginDTO = {
  /** 用户手机号 */
  user_mobile?: string;
  /** 密码 */
  user_pwd?: string;
};
export type ResultUserLoginVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  data?: UserLoginVO;
};
/** 数据 */
export type UserLoginVO = {
  /** 用户token */
  access_token?: string;
};
export type UserLoginCodeDTO = {
  /** 用户手机号 */
  user_mobile?: string;
  /** 密码 */
  user_pwd?: string;
  /** 生成验证码时传入的uuid */
  uuid?: string;
  /** 验证码不能为空 */
  code?: string;
};
export type UserLoginMiniDTO = {
  /** 用户手机号 */
  user_mobile?: string;
  /** 密码 */
  user_pwd?: string;
  /** open_id */
  open_id?: string;
};
export type UserLoginBySmsDTO = {
  /** 用户手机号 */
  user_mobile?: string;
  /** 短信验证码 */
  verify_code?: string;
};
export type UserListPageDTO = {
  /** 页码 */
  page_num?: number;
  /** 每页条数 */
  page_size?: number;
  /** 角色ID */
  role_id?: string;
  /** 姓名 */
  user_name?: string;
};
/** 数据 */
export type PageResult = {
  /** 总记录数 */
  rows_count?: number;
  /** 当前页数据集合 */
  row_list?: any[];
};
export type ResultPageResult = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  data?: PageResult;
};
export type ResultListModuleMenuListVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: ModuleMenuListVO[];
};
/** 数据 */
export type ModuleListVO = {
  module_list?: ModuleMenuListVO[];
};
export type ResultModuleListVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  data?: ModuleListVO;
};
export type OperationLogDTO = {
  /** 页码 */
  page_num?: number;
  /** 每页条数 */
  page_size?: number;
  /** 用户ID */
  user_name?: string;
  /** 操作模块 */
  module?: string;
  /** 操作内容容 */
  content?: string;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
};
export type ResultListString = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: string[];
};
export type UserAddDTO = {
  /** 用户名称 */
  user_name?: string;
  /** 手机号 */
  user_mobile?: string;
  /** 部门ID */
  dept_id?: string;
  /** 岗位ID */
  job_id?: string;
  /** 角色ID列表 */
  user_role_id_list?: string[];
};
export type RoleAddDTO = {
  /** 角色名称 */
  role_name?: string;
  /** 角色描述 */
  role_desc?: string;
  /** 下属菜单列表 */
  module_list?: ModuleMenuListVO[];
};
export type JobAddDTO = {
  /** 岗位名称 */
  job_name?: string;
  /** 备注 */
  job_comment?: string;
  /** 上级岗位ID */
  upper_id?: string;
};
export type DeptAddDTO = {
  /** 部门名称 */
  dept_name?: string;
  /** 备注 */
  dept_comment?: string;
  /** 上级部门ID */
  upper_id?: string;
};
export type ResultListMenuListVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: MenuListVO[];
};
/** 模块管理 */
export type Module = {
  /** 模块ID */
  id?: string;
  /** 模块英文名称 */
  name?: string;
  /** 模块中文名称 */
  title?: string;
  /** 模块图标名称 */
  icon?: string;
  /** 模块排列序号 */
  seq?: number;
};
export type ResultListModule = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: Module[];
};
/** 数据 */
export type JobListVO = {
  /** 岗位ID */
  id?: string;
  /** 岗位名称 */
  job_name?: string;
  /** 岗位备注 */
  job_comment?: string;
  /** 上级岗位ID */
  upper_id?: string;
  /** 下级岗位列表 */
  sub_job_list?: JobListVO[];
};
export type ResultJobListVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  data?: JobListVO;
};
/** 数据 */
export type DeptListVO = {
  /** 部门ID */
  id?: string;
  /** 部门名称 */
  dept_name?: string;
  /** 部门备注 */
  dept_comment?: string;
  /** 上级部门ID */
  upper_id?: string;
  /** 下级部门列表 */
  sub_dept_list?: DeptListVO[];
};
export type ResultListDeptListVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: DeptListVO[];
};
export type ResultUserVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  data?: UserVO;
};
/** 数据 */
export type UserVO = {
  /** 后台用户ID */
  id?: string;
  /** 姓名 */
  user_name?: string;
  /** 手机号 */
  user_mobile?: string;
  /** 邮箱 */
  user_email?: string;
  /** 密码 */
  user_pwd?: string;
  /** 头像url */
  user_avatar_url?: string;
  /** 备注 */
  user_comment?: string;
  /** 微信openid */
  user_wechat_openid?: string;
  /** QQopenid */
  user_qq_openid?: string;
  /** 创建时间 */
  created_time?: string;
  /** 上次登录时间 */
  logined_time?: string;
  /** 状态标记,0-禁止,1-启用 */
  status_mark?: number;
  /** 删除标记,0-未删除,1-逻辑删除 */
  delete_mark?: number;
  /** 部门ID */
  dept_id?: string;
  /** 岗位ID */
  job_id?: string;
  /** 微信unionid */
  user_wechat_unionid?: string;
  /** 部门名称 */
  dept_name?: string;
  /** 岗位名称 */
  job_name?: string;
  /** 角色 */
  user_role_list_str?: string;
  /** 角色ID */
  user_role_id_list?: string[];
};
export type ResultRoleVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  data?: RoleVO;
};
/** 数据 */
export type RoleVO = {
  /** 角色ID */
  id?: string;
  /** 角色类型,0-系统内置角色,1-自定义角色 */
  role_type?: number;
  /** 角色名称 */
  role_name?: string;
  /** 角色描述 */
  role_desc?: string;
  /** 创建时间 */
  created_time?: string;
  /** 下属菜单列表 */
  module_list?: ModuleMenuListVO[];
};
export type ResultListRoleVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: RoleVO[];
};
/** 数据 */
export type JobIdNameVO = {
  /** 岗位ID */
  job_id?: string;
  /** 岗位名称 */
  job_list_name?: string;
};
export type ResultListJobIdNameVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: JobIdNameVO[];
};
/** 数据 */
export type DeptIdNameVO = {
  /** 部门ID */
  dept_id?: string;
  /** 部门名称 */
  dept_list_name?: string;
};
export type ResultListDeptIdNameVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: DeptIdNameVO[];
};
export type ResultListTypeValueVO = {
  /** 状态码 */
  state?: number;
  /** 说明 */
  msg?: string;
  /** 数据 */
  data?: TypeValueVO[];
};
/** 数据 */
export type TypeValueVO = {
  /** Type */
  Type?: string;
  /** Value */
  Value?: string;
};
