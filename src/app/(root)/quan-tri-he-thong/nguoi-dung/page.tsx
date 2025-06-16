'use client'
import React, { useState, useEffect } from 'react'
import { User, UserListResponse } from '@/types/User'
import api from '@/services/api';
import ListUser from '@/components/user/ListUser';
import UserSearchForm from '@/components/user/UserSearchForm';
import CustomPagination from '@/components/ui/custom-pagination';
import ModalCreateUser from '@/components/user/ModalCreateUser';
import { toast } from 'sonner';
import ModalEditUser from '@/components/user/ModalEditUser';

type FormValues = {
  fullName?: string;
  email?: string;
  status?: string;
}


const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async (pageIndex: number, pageSize: number, fullName?: string, email?: string, status?: string) => {
    setLoading(true);
    try {
      const res = await api.get<{ data: UserListResponse }>('/user/list', {
        params: { pageIndex, pageSize, fullName, email, status }
      });
      const { data, totalPages, totalRecords } = res.data.data;
      setUsers(data);
      setTotalPages(totalPages);
      setTotalRecords(totalRecords);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (values: FormValues) => {
    const searchPayload = Object.entries(values).reduce((acc, [key, value]) => {
      if (value && value !== "") {
        acc[key as keyof FormValues] = value;
      }
      return acc;
    }, {} as FormValues);

    setFullName(searchPayload.fullName || '');
    setEmail(searchPayload.email || '');
    setStatus(searchPayload.status || '');
    setPageIndex(1);
    fetchUsers(pageIndex, pageSize, searchPayload.fullName, searchPayload.email, searchPayload.status);
  }

  const handleRefresh = () => {
    setPageIndex(1);
    fetchUsers(pageIndex, pageSize);
  }

  const handleAdd = () => { 
    setOpenCreateModal(true);
  }

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
    fetchUsers(newPageIndex, pageSize, fullName, email, status);
  }

  const handleChangePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    fetchUsers(pageIndex, newPageSize, fullName, email, status);
  }

  const handleDelete = async (userId: number) => {
    const reponse = await api.delete(`/user/${userId}`);
    if (reponse.status >= 200 && reponse.status < 300) {
      toast.success("Xóa người dùng thành công");
    } else {
      toast.error("Xóa người dùng thất bại");
    }
    handleRefresh();
  }

  const handleEdit = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setOpenEditModal(true);
    }
  }

  useEffect(() => {
    fetchUsers(pageIndex, pageSize);
    return () => {
      setUsers([]);
    }
  }, [pageIndex, pageSize]);

  return (
    <div className='p-3 flex flex-col gap-3'>
      <UserSearchForm userCount={totalRecords} onSearch={handleSearch} onRefresh={handleRefresh} onAdd={handleAdd} />
      <ListUser users={users} isLoading={loading} onRefresh={handleRefresh} onDelete={handleDelete} onEdit={handleEdit} />
      
      <CustomPagination
        currentPage={pageIndex}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangePageSize}
      />

      <ModalCreateUser open={openCreateModal} onOpenChange={setOpenCreateModal} onRefresh={handleRefresh} />
      {
        selectedUser && (
          <ModalEditUser open={openEditModal} onOpenChange={setOpenEditModal} onRefresh={handleRefresh} user={selectedUser} />
        )
      }
    </div>
  )
}

export default UserManagement