import api from './api';
import { GroupResponse } from '@/types/GroupReponse';
import { Group, User } from '@/types/User';
import { PageRole } from '@/types/pageRole';
import { RoleData } from '@/types/pageRole';


export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get('/auth/group');
  return response.data.data;
};
export const getPageRoles = async (): Promise<{ pages: PageRole[]; roles: RoleData[] }> => {
  const response = await api.get('/auth/page');
  return response.data.data;
};

export const getGroupDetail = async (groupId: number): Promise<GroupResponse> => {
  const response = await api.get(`/auth/group/${groupId}`);
  return response.data.data;
};

export const getListUser = async (pageIndex: number, pageSize: number, fullName?: string): Promise<User[]> => {
  const response = await api.get('/user/list', {
    params: {
      pageIndex,
      pageSize,
      fullName,
    },
  });
  return response.data.data.data;
};
export const updateListUser = async (groupId: number, userIds: number[]) => {
  const strUserIds = userIds.join(',');
  const response = await api.put(`/auth/group/user/${groupId}`, {
    userIds: strUserIds,
  });
  return response.data.data;
};
export const createGroup = async (data: {
  groupName: string;
  description: string;
  groupPage?: string;
  status?: number;
}) => {
  const response = await api.post('/auth/group', data);
  return response.data.data;
};

export const updateGroup = async (groupId: number, data: {
  groupName: string;
  description: string;
  groupPage: string;
  status?: number;
}) => {
  const response = await api.put(`/auth/group/${groupId}`, data);
  return response.data.data;
};

export const deleteGroup = async (groupId: number) => {
  return api.delete(`/auth/group/${groupId}`);
};


