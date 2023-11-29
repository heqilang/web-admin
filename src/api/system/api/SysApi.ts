import { SYS_API } from "@/utils/api/index"
import { ModuleUpdateDTO,ResultString,ModuleAddDTO,MenuSortDTO,ResultListModule,MenuUpdateDTO,MenuAddDTO,ResultListModuleMenuListVO,ResultModuleListVO,ResultListMenuListVO,UserUpdateDTO,UpdateUserPwdDTO,UpdateUserMobileDTO,UpdateUserBasicDTO,Result,UserListPageDTO,ResultPageResult,UserLoginBySmsDTO,UserAddDTO,ResultUserVO,ResultListTypeValueVO,RoleUpdateDTO,RoleAddDTO,ResultRoleVO,ResultListRoleVO,JobUpdateDTO,JobAddDTO,ResultJobListVO,ResultListJobIdNameVO,DeptUpdateDTO,DeptAddDTO,ResultListDeptListVO,ResultListDeptIdNameVO,UserResetPasswordDTO,ResultObject,UserLoginDTO,ResultUserLoginVO,UserLoginCodeDTO,UserLoginMiniDTO,OperationLogDTO,ResultListString } from "@/entity/system"

/** 编辑模块 */
export function moduleUpdate(data?: ModuleUpdateDTO): Promise<ResultString> {
  return SYS_API.connect("PUT", `/api/Sys/module`, data)
}

/** 新增模块 */
export function moduleAdd(data?: ModuleAddDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/module`, data)
}

/** 删除模块 */
export function moduleDelete(arr?: string[]): Promise<ResultString> {
  return SYS_API.connect("DELETE", `/api/Sys/module`, arr)
}

/** 模块排序更改 */
export function updateModuleSort(data?: MenuSortDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/updateModuleSort`, data)
}

/** 获取菜单模块列表 */
export function menuModuleList(): Promise<ResultListModule> {
  return SYS_API.connect("GET", `/api/Sys/menuModuleList`)
}

/** 编辑菜单 */
export function menuUpdate(data?: MenuUpdateDTO): Promise<ResultString> {
  return SYS_API.connect("PUT", `/api/Sys/menu`, data)
}

/** 新增菜单 */
export function menuAdd(data?: MenuAddDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/menu`, data)
}

/** 删除菜单 */
export function menuDelete(arr?: string[]): Promise<ResultString> {
  return SYS_API.connect("DELETE", `/api/Sys/menu`, arr)
}

/** 菜单排序更改 */
export function updateMenuSort(data?: MenuSortDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/updateMenuSort`, data)
}

/** 获取系统支持的权限全集（模块+菜单） */
export function getSysModuleList(): Promise<ResultListModuleMenuListVO> {
  return SYS_API.connect("POST", `/api/Sys/getSysModuleList`)
}

/** 获取登录用户可访问的功能权限列表（模块+菜单） */
export function getPermission(): Promise<ResultModuleListVO> {
  return SYS_API.connect("POST", `/api/Sys/getPermission`)
}

/** 获取模块下菜单树 */
export function sysMenuTreeList(query?: { module_id?: string }): Promise<ResultListMenuListVO> {
  return SYS_API.connect("GET", `/api/Sys/sysMenuTreeList`, undefined, query)
}

/** 编辑用户 */
export function updateSysUser(data?: UserUpdateDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/updateSysUser`, data)
}

/** 更新登录用户密码 */
export function updateLoginSysUserPwd(data?: UpdateUserPwdDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/updateLoginSysUserPwd`, data)
}

/** 更新登录用户手机号 */
export function updateLoginSysUserMobile(data?: UpdateUserMobileDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/updateLoginSysUserMobile`, data)
}

/** 更新登录用户基础信息 */
export function updateLoginSysUserBasic(data?: UpdateUserBasicDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/updateLoginSysUserBasic`, data)
}

/** 解除绑定的微信 */
export function unbindWechat(query?: { user_id?: string }): Promise<Result> {
  return SYS_API.connect("POST", `/api/Sys/unbindWechat`, undefined, query)
}

/** 获取用户列表（含用户所有字段，含禁用用户） */
export function getSysUserList(data?: UserListPageDTO): Promise<ResultPageResult> {
  return SYS_API.connect("POST", `/api/Sys/getSysUserList`, data)
}

/** 获取重置手机号或密码短信验证码(未登录状态和个人中心均支持) */
export function getResetSmsVerifyCode_1(query?: { user_mobile?: string }): Promise<ResultString> {
  return SYS_API.connect("GET", `/api/Sys/getResetSmsVerifyCode`, undefined, query)
}

/** 启用用户 */
export function enableSysUser(query?: { user_id?: string }): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/enableSysUser`, undefined, query)
}

/** 禁止用户 */
export function disableSysUser(query?: { user_id?: string }): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/disableSysUser`, undefined, query)
}

/** 删除用户 */
export function deleteSysUser(query?: { user_id?: string }): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/deleteSysUser`, undefined, query)
}

/** 验证重置手机号或密码短信验证码(个人中心) */
export function checkResetSmsVerifyCode(data?: UserLoginBySmsDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/checkResetSmsVerifyCode`, data)
}

/** 新增用户 */
export function addSysUser(data?: UserAddDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/addSysUser`, data)
}

/** 获取用户 */
export function getSysUser(query?: { user_id?: string }): Promise<ResultUserVO> {
  return SYS_API.connect("GET", `/api/Sys/getSysUser`, undefined, query)
}

/** 获取当前登录用户基本信息（主要是id） */
export function getLoginUserInfo(): Promise<ResultListTypeValueVO> {
  return SYS_API.connect("GET", `/api/Sys/getLoginUserInfo`)
}

/** 更新角色 */
export function updateSysRole(data?: RoleUpdateDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/updateSysRole`, data)
}

/** 删除角色 */
export function deleteSysRole(query?: { role_id?: string }): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/deleteSysRole`, undefined, query)
}

/** 新增角色 */
export function addSysRole(data?: RoleAddDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/addSysRole`, data)
}

/** 获取角色 */
export function getSysRole(query?: { role_id?: string }): Promise<ResultRoleVO> {
  return SYS_API.connect("GET", `/api/Sys/getSysRole`, undefined, query)
}

/** 获取角色列表 */
export function getSysRoleList(): Promise<ResultListRoleVO> {
  return SYS_API.connect("GET", `/api/Sys/getSysRoleList`)
}

/** 更新岗位 */
export function updateSysJob(data?: JobUpdateDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/updateSysJob`, data)
}

/** 删除岗位 */
export function deleteSysJob(query?: { job_id?: string }): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/deleteSysJob`, undefined, query)
}

/** 新增岗位 */
export function addSysJob(data?: JobAddDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/addSysJob`, data)
}

/** 获取岗位树（岗位只有1个一级岗位），用于系统管理显示岗位树 */
export function getTopSysJob(): Promise<ResultJobListVO> {
  return SYS_API.connect("GET", `/api/Sys/getTopSysJob`)
}

/** 获取扁平化岗位列表（子岗位显示为 /一级岗位/二级岗位/三级岗位），用于表单选择岗位 */
export function getSysJobList(): Promise<ResultListJobIdNameVO> {
  return SYS_API.connect("GET", `/api/Sys/getSysJobList`)
}

/** 更新部门 */
export function updateSysDept(data?: DeptUpdateDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/updateSysDept`, data)
}

/** 删除部门 */
export function deleteSysDept(query?: { dept_id?: string }): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/deleteSysDept`, undefined, query)
}

/** 新增部门 */
export function addSysDept(data?: DeptAddDTO): Promise<ResultString> {
  return SYS_API.connect("POST", `/api/Sys/addSysDept`, data)
}

/** 获取一级部门列表（每个一级部门是一棵树），用于系统管理显示部门列表 */
export function getTopSysDeptList(): Promise<ResultListDeptListVO> {
  return SYS_API.connect("GET", `/api/Sys/getTopSysDeptList`)
}

/** 获取扁平化部门列表（子部门显示为 /一级部门/二级部门/三级部门），用于表单选择部门 */
export function getSysDeptList(): Promise<ResultListDeptIdNameVO> {
  return SYS_API.connect("GET", `/api/Sys/getSysDeptList`)
}

/** 忘记密码后直接重置密码(未登录状态) */
export function resetUserPassword(data?: UserResetPasswordDTO): Promise<ResultObject> {
  return SYS_API.connect("POST", `/api/Sys/resetUserPassword`, data)
}

/** 手机号密码登录(未登录状态) */
export function login(data?: UserLoginDTO): Promise<ResultUserLoginVO> {
  return SYS_API.connect("POST", `/api/Sys/login`, data)
}

/** 手机号密码+验证码登录(未登录状态) */
export function loginWithCode(data?: UserLoginCodeDTO): Promise<ResultUserLoginVO> {
  return SYS_API.connect("POST", `/api/Sys/loginWithCode`, data)
}

/** 微信登录:手机号密码(手机号自动绑定微信) */
export function loginMini(data?: UserLoginMiniDTO): Promise<ResultUserLoginVO> {
  return SYS_API.connect("POST", `/api/Sys/loginMini`, data)
}

/** 手机号短信验证码登录(未登录状态) */
export function loginBySms(data?: UserLoginBySmsDTO): Promise<ResultUserLoginVO> {
  return SYS_API.connect("POST", `/api/Sys/loginBySms`, data)
}

/** 获取重置手机号或密码短信验证码(未登录状态和个人中心均支持) */
export function getResetSmsVerifyCode(query?: { user_mobile?: string }): Promise<Result> {
  return SYS_API.connect("POST", `/api/Sys/getResetSmsVerifyCode`, undefined, query)
}

/** 获取登录短信验证码(未登录状态) */
export function getLoginSmsVerifyCode(query?: { user_mobile?: string }): Promise<Result> {
  return SYS_API.connect("POST", `/api/Sys/getLoginSmsVerifyCode`, undefined, query)
}

/** 获取图片验证码 */
export function verifyCodeImg(query?: { uuid?: string }): Promise<any> {
  return SYS_API.connect("GET", `/api/Sys/verifyCodeImg`, undefined, query)
}

/** 获取openid返给前端token */
export function loginWithCodeSys(code?: string): Promise<ResultUserLoginVO> {
  return SYS_API.connect("GET", `/api/Sys/loginWithCode/${code}`)
}

/** 日志分页 */
export function getLogPage(data?: OperationLogDTO): Promise<ResultPageResult> {
  return SYS_API.connect("POST", `/api/Sys/getLogPage`, data)
}

/** 操作模块列表 */
export function getLogModule(): Promise<ResultListString> {
  return SYS_API.connect("POST", `/api/Sys/getLogModule`)
}