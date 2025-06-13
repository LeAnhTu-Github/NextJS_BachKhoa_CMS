'use client'
import React, { useState, useEffect } from 'react'
import { User, UserListResponse } from '@/types/User'
import api from '@/services/api';
import ListUser from '@/components/user/ListUser';
import UserSearchForm from '@/components/user/UserSearchForm';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type FormValues = {
  fullName?: string;
  email?: string;
  status?: string;
}

const statusOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
]

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [loading, setLoading] = useState(false);

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
    setFullName(values.fullName || '');
    setEmail(values.email || '');
    setStatus(values.status || '');
    setPageIndex(1); // Reset to first page on new search
    fetchUsers(1, pageSize, values.fullName, values.email, values.status);
  }

  const handleRefresh = () => {
    setPageIndex(1);
    fetchUsers(1, pageSize);
  }

  const handleAdd = () => { 
    console.log('add');
  }

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
    fetchUsers(newPageIndex, pageSize, fullName, email, status);
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
      <ListUser users={users} isLoading={loading} />
      
      {totalPages > 1 && (
        <Pagination className="mt-4" >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(pageIndex - 1)}
                className={pageIndex === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === pageIndex}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(pageIndex + 1)}
                className={pageIndex === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default UserManagement