import { GroupResponse } from '@/types/GroupReponse';
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/types/User';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp } from 'lucide-react';

interface TableAccountProps {
  groupDetail: GroupResponse | null;
}
const TableAccount = ({ groupDetail }: TableAccountProps) => {
  const users = React.useMemo(() => groupDetail?.users || [], [groupDetail?.users]);

  type SortConfig = {
    key: keyof User | null;
    direction: 'asc' | 'desc' | 'none';
  };
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof User) => {
    setSortConfig((currentSort) => {
      if (currentSort.key !== key) {
        return { key, direction: 'asc' };
      }
      switch (currentSort.direction) {
        case 'asc':
          return { key, direction: 'desc' };
        case 'desc':
          return { key: null, direction: 'none' };
        default:
          return { key, direction: 'asc' };
      }
    });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key || sortConfig.direction === 'none') return users;
    return [...users].sort((a, b) => {
      let aValue: string | number | null;
      let bValue: string | number | null;
      if (sortConfig.key === 'status') {
        aValue = a.status === 'ACTIVE' ? 'Kích hoạt' : 'Chưa kích hoạt';
        bValue = b.status === 'ACTIVE' ? 'Kích hoạt' : 'Chưa kích hoạt';
      } else {
        const value = a[sortConfig.key as keyof User];
        aValue = typeof value === 'string' || typeof value === 'number' ? value : null;
        const value2 = b[sortConfig.key as keyof User];
        bValue = typeof value2 === 'string' || typeof value2 === 'number' ? value2 : null;
      }
      if (aValue === bValue) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [users, sortConfig]);

  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: keyof User }) => {
    const isSorted = sortConfig.key === sortKey;
    const isAsc = sortConfig.direction === 'asc';
    return (
      <Button
        variant="ghost"
        onClick={() => handleSort(sortKey)}
        className="h-8 px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 group relative"
        tabIndex={0}
        aria-label={`Sắp xếp theo ${label}`}
        aria-sort={isSorted ? (isAsc ? 'ascending' : 'descending') : 'none'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleSort(sortKey);
        }}
      >
        <span className="pr-6">{label}</span>
        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isSorted ? (
            <div className={`transform transition-transform duration-200 ${isAsc ? 'rotate-0' : 'rotate-180'}`}>
              <ArrowUp className="h-4 w-4" />
            </div>
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </div>
      </Button>
    );
  };

  const renderMobile = () => {
    if (!users.length) {
      return (
        <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
          Không có dữ liệu
        </div>
      );
    }
    return (
      <div className="block sm:hidden space-y-4">
        {users.map((user: User, idx: number) => (
          <div
            key={user.id}
            className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
            tabIndex={0}
            aria-label={`Thông tin người dùng: ${user.fullName}`}
          >
            <div className="flex justify-between text-sm py-1 border-b">
              <span className="font-medium text-gray-600">STT</span>
              <span className="text-gray-800">{idx + 1}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-1 border-b">
              <span className="font-medium text-gray-600">Họ tên:</span>
              <div className="h-full flex items-center justify-center gap-3 mb-2">
                <span className="font-medium text-gray-600">
                  {user.fullName}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm py-1 border-b">
              <span className="font-medium text-gray-600">Email</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm py-1 border-b">
              <span className="font-medium text-gray-600">Số điện thoại</span>
              <span className="text-gray-800">{user.phone}</span>
            </div>
            <div className="flex justify-between text-sm py-1 border-b">
              <span className="font-medium text-gray-600">Chức vụ</span>
              <span className="text-gray-800">{user.position}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-1">
              <span className="font-medium text-gray-600">Trạng thái</span>
              <div className={`w-auto h-[24px] rounded-lg text-white text-xs font-thin flex items-center justify-center px-3 ${user.status === "ACTIVE" ? "bg-[#A2122B]" : "bg-[#9E9E9E]"}`}>
                {user.status === "ACTIVE" ? "Kích hoạt" : "Chưa kích hoạt"}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const renderDesktop = () => {
    if (!users.length) {
      return (
        <div className="hidden sm:block text-center py-6 text-gray-500 border rounded-lg bg-white">
          Không có dữ liệu
        </div>
      );
    }
    return (
      <div className="w-full hidden sm:block rounded-lg bg-white mt-3 max-h-[550px] overflow-y-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[50px]">
                <span className="text-xs font-semibold text-gray-700">STT</span>
              </TableHead>
              <TableHead>
                <SortableHeader label="Họ tên" sortKey="fullName" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Email" sortKey="email" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Số điện thoại" sortKey="phone" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Chức vụ" sortKey="position" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Trạng thái" sortKey="status" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user: User, idx: number) => (
              <TableRow key={user.id} className="hover:bg-gray-50 h-15">
                <TableCell className="text-sm text-gray-700 pl-2">{idx + 1}</TableCell>
                <TableCell>
                  <span className="font-medium text-gray-600 ">{user.fullName}</span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">{user.email}</TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">{user.phone}</TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">{user.position}</TableCell>
                <TableCell>
                  <div className={`w-auto h-[24px] rounded-lg text-white text-xs font-thin flex items-center justify-center ${user.status === "ACTIVE" ? "bg-[#A2122B]" : "bg-[#9E9E9E]"}`}>
                    {user.status === "ACTIVE" ? "Kích hoạt" : "Chưa kích hoạt"}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <>
      {renderMobile()}
      {renderDesktop()}
    </>
  );
}

export default TableAccount