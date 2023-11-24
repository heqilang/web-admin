import { OperationLogDTO } from '@/entity/system';

export interface LogVo {
  id?: string;
  /** 操作内容 */
  op_content?: string;
  /** 操作模块 */
  op_module_name?: string;
  /** 操作时间 */
  op_time?: string;
  /** 操作IP */
  op_user_ip?: string;
  /** 操作人 */
  user_name?: string;
}

export interface LogSelectVo extends OperationLogDTO {
  timeRange?: [DateModelType, DateModelType];
}
