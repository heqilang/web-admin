import { PageResult, RoleVO, UserListPageDTO, UserVO } from '@/entity/system';

export interface UserData {
  search: UserListPageDTO;
  echoSearch: UserListPageDTO;
  adjustForm: UserVO;
  roleList: RoleVO[];
  userTable: PageResult;
}
