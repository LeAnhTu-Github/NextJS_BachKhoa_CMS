import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { User } from "@/types/User";
import { getListUser } from "@/services/groupService";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/ui/custom-pagination";
import { GroupResponse } from "@/types/GroupReponse";
import useDebounce from "@/hooks/useDebounce";

interface MessageAccountProps {
  groupDetail: GroupResponse | null;
  listUserSelected: number[];
  setListUserSelected: React.Dispatch<React.SetStateAction<number[]>>;

}

const MessageAccount = ({ groupDetail, listUserSelected, setListUserSelected }: MessageAccountProps) => {
  const [listUser, setListUser] = useState<User[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fullName, setFullName] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const debouncedFullName = useDebounce(fullName, 300);

  useEffect(() => {
    setListUserSelected(groupDetail?.users.map(user => user.id) || []);
  }, [groupDetail, setListUserSelected]);

  useEffect(() => {
    fetchListUser(pageIndex, pageSize, debouncedFullName);
  }, [pageIndex, pageSize, debouncedFullName]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };
  const fetchListUser = async (pageIndex: number, pageSize: number, fullName?: string) => {
    const response = await getListUser(pageIndex, pageSize, fullName);
    setListUser(response);
  };
  const isAllSelected = listUser.length > 0 && listUser.every(user => listUserSelected.includes(user.id));
  const handleSelectAll = () => {
    if (isAllSelected) {
      setListUserSelected(prev => prev.filter(id => !listUser.some(user => user.id === id)));
    } else {
      setListUserSelected(prev => [...new Set([...prev, ...listUser.map(user => user.id)])]);
    }
  };
  const handleSelectUser = (id: number) => {
    setListUserSelected(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
    fetchListUser(newPageIndex, pageSize, fullName);
  }

  const handleChangePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    fetchListUser(pageIndex, newPageSize, fullName);
  }
  return (
    <div>
      <div className="p-3 rounded-none h-16 flex gap-4 px-4 py-1 ">
        <div className="w-full flex gap-2 h-full">
          <div className="w-[30%] h-full flex items-center justify-start gap-1 truncate">
            Danh sách người dùng
            <span className="text-lg text-redberry">{`(${groupDetail?.users.length})`}</span>
            <div className="border-r border-gray-200 h-[80%] flex items-center pl-4"></div>
          </div>
          <div className="w-[70%] h-full flex items-center justify-end gap-1">
            <Input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full h-10 rounded-[4px] placeholder:text-lg"
              value={fullName}
              maxWidthClass="lg:max-w-[100%]"
              onChange={handleSearchChange}
              aria-label="Tìm kiếm tên người dùng"
            />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox 
                 className="bg-white data-[state=checked]:bg-redberry data-[state=checked]:border-none"
                 checked={isAllSelected}
                 onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>STT</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Chức vụ</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            listUser.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Không có dữ liệu</TableCell>
              </TableRow>
            ) : (
                listUser.map((user, idx) => (
                    <TableRow key={user.id}>
                    <TableCell>
                        <Checkbox checked={listUserSelected.some(id => id === user.id)}
                         className="bg-white data-[state=checked]:bg-redberry data-[state=checked]:border-none"
                         onCheckedChange={() => handleSelectUser(user.id)}
                        />
                    </TableCell>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell>
                        <span className="bg-redberry text-white rounded-full px-4 py-1">
                        Kích hoạt
                        </span>
                    </TableCell>
                    </TableRow>
                ))
            )
          }
        </TableBody>
      </Table>
      <CustomPagination
        currentPage={pageIndex}
        totalPages={totalPages}
        pageSize={pageSize}
        setTotalPages={setTotalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangePageSize}
      />
    </div>
  );
};

export default MessageAccount;
