export type Group = {
  createBy: number;
  createTime: string;
  description: string;
  groupName: string;
  id: number;
  status: number;
  updateBy: number;
  updateTime: string;
};
export type UserStatus = 'INACTIVE' | 'ACTIVE';

export type User = {
  avatar: string;
  createBy: number; 
  createTime: string;
  email: string;
  fullName: string;
  fullNameNotMark: string;
  groups: Group[];
  id: number;
  password: string;
  phone: string;
  position: string;
  status: UserStatus;
  updateBy: number;
  updateTime: string;
};

