import { DeptIdNameVO, DeptListVO, DeptUpdateDTO, JobIdNameVO, JobListVO, JobUpdateDTO } from '@/entity/system';

export interface OrginizationState {
  topSysDeptList: DeptListVO[];
  topSysJobList: JobListVO[];
  sysDeptList: DeptIdNameVO[];
  sysJobList: JobIdNameVO[];
}

export interface OrginizationForm {
  deptForm: DeptUpdateDTO;
  jobForm: JobUpdateDTO;
}
