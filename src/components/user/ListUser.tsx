import React, { useState } from "react";
import api from "@/services/api";
import { User } from "@/types/User";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserActionsDropdown from "./UserActionsDropdown";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import NextImage from "next/image";
import { ArrowUpDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListUserProps {
  users: User[];
  isLoading: boolean;
  onRefresh: () => void;
  onDelete: (userId: number) => void;
  onEdit: (userId: number) => void;
}

const statusOptions = [
  { label: "Kích hoạt", value: "ACTIVE" },
  { label: "Chưa kích hoạt", value: "INACTIVE" },
];

type SelectedUserAction = {
  user: User;
  action: "delete" | "detail" | "resetPassword" | null;
} | null;

type SortConfig = {
  key: keyof User | null;
  direction: "asc" | "desc" | "none";
};

const ListUser = ({
  users,
  isLoading,
  onRefresh,
  onDelete,
  onEdit,
}: ListUserProps) => {
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    newStatus: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [selectedUserAction, setSelectedUserAction] =
    useState<SelectedUserAction>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const handleStatusChange = (userId: number, newStatus: string) => {
    setSelectedUser({ id: userId, newStatus });
    setIsDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    const reponse = await api.put(`/user/changeStatus/${selectedUser?.id}`, {
      id: selectedUser?.id,
      status: selectedUser?.newStatus,
    });
    if (reponse.status >= 200 && reponse.status < 300) {
      toast.success("Cập nhật trạng thái thành công");
    } else {
      toast.error("Cập nhật trạng thái thất bại");
    }
    setIsDialogOpen(false);
    setSelectedUser(null);
    onRefresh();
  };

  const handleDelete = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUserAction({ user, action: "delete" });
      setIsDeleteDialogOpen(true);
    }
  };

  const openResetPasswordDialog = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUserAction({ user, action: "resetPassword" });
      setIsResetPasswordDialogOpen(true);
    }
  };
  const handleConfirmResetPassword = async () => {
    if (selectedUserAction?.user) {
      const reponse = await api.put(
        `/user/resetPassword/${selectedUserAction.user.id}`
      );
      if (reponse.status >= 200 && reponse.status < 300) {
        toast.success("Reset mật khẩu thành công");
      } else {
        toast.error("Reset mật khẩu thất bại");
      }
    }
  };
  const handleConfirmDelete = () => {
    if (selectedUserAction?.user) {
      onDelete(selectedUserAction.user.id);
      setIsDeleteDialogOpen(false);
      setSelectedUserAction(null);
    }
  };
  const handleDetail = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUserAction({ user, action: "detail" });
      setIsDetailDialogOpen(true);
    }
  };
  const messageDetail = (user: User) => {
    return (
      <div className="w-full h-full flex flex-col gap-4 overflow-auto">
        <div className="w-full h-[200px] flex justify-center items-center mb-4">
          <NextImage
            src={user.avatar || "/images/avatar.png"}
            alt={user.fullName}
            width={200}
            height={200}
            className="rounded-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2 flex gap-2">
            <span className="font-medium text-sm text-gray-600">Họ tên:</span>
            <span className="text-sm text-redberry">{user.fullName}</span>
          </div>
          <div className="w-full lg:w-1/2 flex gap-2">
            <span className="font-medium text-sm text-gray-600">
              Số điện thoại:
            </span>
            <span className="text-sm text-redberry">{user.phone}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex gap-2 w-full lg:w-1/2">
            <span className="font-medium text-sm text-gray-600">Email:</span>
            <span className="text-sm text-redberry">{user.email}</span>
          </div>
          <div className="flex gap-2 w-full lg:w-1/2">
            <span className="font-medium text-sm text-gray-600">Chức vụ:</span>
            <span className="text-sm text-redberry">{user.position}</span>
          </div>
        </div>
        <div className="flex gap-2 w-full items-center">
          <span className="font-medium text-sm text-gray-600">Trạng thái:</span>
          <div className="flex gap-2 w-auto h-auto p-2 rounded-sm bg-redberry">
            <span className="text-xs text-white">
              {user.status === "ACTIVE" ? "Kích hoạt" : "Chưa kích hoạt"}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full items-center">
          <span className="font-medium text-sm text-gray-600">
            Nhóm người dùng:
          </span>
          <div className="flex gap-2 p-2">
            <span className="text-sm text-redberry">
              {user.groups.map((group) => group.groupName).join(", ")}
            </span>
          </div>
        </div>
      </div>
    );
  };
  const handleSort = (key: keyof User) => {
    setSortConfig((currentSort) => {
      if (currentSort.key !== key) {
        return { key, direction: "asc" };
      }
      
      switch (currentSort.direction) {
        case "asc":
          return { key, direction: "desc" };
        case "desc":
          return { key: null, direction: "none" };
        default:
          return { key, direction: "asc" };
      }
    });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key || sortConfig.direction === "none") return users;

    return [...users].sort((a, b) => {
      let aValue: string | number | null;
      let bValue: string | number | null;

      if (sortConfig.key === 'groups') {
        aValue = a.groups[0]?.groupName || '';
        bValue = b.groups[0]?.groupName || '';
      } else if (sortConfig.key === 'status') {
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
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [users, sortConfig]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span
          className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"
          aria-label="Đang tải..."
        />
      </div>
    );
  }
  const StatusSelect = ({ user }: { user: User }) => (
    <Select
      value={user.status}
      onValueChange={(value) => handleStatusChange(user.id, value)}
    >
      <SelectTrigger
        size="xs"
        className={`w-auto px-3 rounded-lg text-white text-xs font-thin [&_svg]:text-white [&_svg]:size-5 ${
          user.status === "ACTIVE" ? "bg-redberry" : "bg-[#9E9E9E]"
        }`}
      >
        <SelectValue placeholder="Chọn trạng thái" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: keyof User | 'groups' | 'status' }) => {
    const isSorted = sortConfig.key === sortKey;
    const isAsc = sortConfig.direction === "asc";
    return (
      <Button
        variant="ghost"
        onClick={() => handleSort(sortKey)}
        className="h-8 px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 group relative"
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

  return (
    <>
      <div className="block sm:hidden space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          users.map((user, idx) => (
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
                  <Avatar className="w-[48px] h-[48px]">
                    <AvatarImage
                      src={user.avatar || "/images/avatar.png"}
                      alt={user.fullName}
                      width={60}
                      height={60}
                    />
                  </Avatar>
                  <span className="font-semibold text-red-700 text-lg">
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
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Nhóm người dùng
                </span>
                <span className="text-gray-800">
                  {user.groups.map((group) => group.groupName).join(", ")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Trạng thái</span>
                <StatusSelect user={user} />
              </div>
              <div className="flex justify-between items-center text-sm py-1 ">
                <span className="font-medium text-gray-600">Chức năng</span>
                <UserActionsDropdown
                  onDetail={() => handleDetail(user.id)}
                  onAssignClass={() => {}}
                  onPermission={() => {}}
                  onManageClass={() => {}}
                  onUpdate={() => onEdit(user.id)}
                  onResetPassword={() => openResetPasswordDialog(user.id)}
                  onDelete={() => handleDelete(user.id)}
                  trigger={
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Chức năng"
                      tabIndex={0}
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="text-gray-600"
                        aria-hidden="true"
                      >
                        <circle cx="10" cy="4" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="10" cy="16" r="1.5" />
                      </svg>
                    </button>
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="w-full hidden sm:block rounded-lg border border-gray-200 bg-white mt-3 overflow-y-auto">
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
                <SortableHeader label="Nhóm người dùng" sortKey="groups" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Trạng thái" sortKey="status" />
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Chức năng</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {sortedUsers.map((user, idx) => (
              <TableRow key={user.id} className="hover:bg-gray-50 h-15">
                <TableCell className="text-sm text-gray-700 pl-2">{idx + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-h-[48px]">
                    <Avatar className="w-[48px] h-[48px] shrink-0">
                      <AvatarImage
                        src={user.avatar || "/images/avatar.png"}
                        alt={user.fullName}
                      />
                    </Avatar>
                    <span className="font-semibold text-red-700">
                      {user.fullName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">{user.email}</TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">{user.phone}</TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">{user.position}</TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {user.groups.map((group) => group.groupName).join(", ")}
                </TableCell>
                <TableCell>
                  <StatusSelect user={user} />
                </TableCell>
                <TableCell>
                  <UserActionsDropdown
                    onDetail={() => handleDetail(user.id)}
                    onAssignClass={() => {}}
                    onPermission={() => {}}
                    onManageClass={() => {}}
                    onUpdate={() => onEdit(user.id)}
                    onResetPassword={() => openResetPasswordDialog(user.id)}
                    onDelete={() => handleDelete(user.id)}
                    trigger={
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                        aria-label="Chức năng"
                        tabIndex={0}
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="text-gray-600"
                          aria-hidden="true"
                        >
                          <circle cx="10" cy="4" r="1.5" />
                          <circle cx="10" cy="10" r="1.5" />
                          <circle cx="10" cy="16" r="1.5" />
                        </svg>
                      </button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Xác nhận"
        message={
          <p className="text-[16px] text-gray-600">
            Bạn có chắc chắn muốn đổi trạng thái từ{" "}
            <span className="font-semibold text-red-700">
              {selectedUser?.newStatus === "ACTIVE"
                ? "Chưa kích hoạt"
                : "Kích hoạt"}
            </span>{" "}
            sang{" "}
            <span className="font-semibold text-red-700">
              {selectedUser?.newStatus === "ACTIVE"
                ? "Kích hoạt"
                : "Chưa kích hoạt"}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmStatusChange}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xác nhận xóa"
        message={
          <p className="text-[16px] text-gray-600">
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <span className="font-semibold text-red-700">
              {selectedUserAction?.user.fullName}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmDelete}
      />
      <ConfirmDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        title="Chi tiết người dùng"
        message={
          selectedUserAction?.user
            ? messageDetail(selectedUserAction.user)
            : null
        }
        onConfirm={() => {}}
        hiddenConfirm={true}
      />
      <ConfirmDialog
        isOpen={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
        title="Xác nhận"
        message={
          <p className="text-[16px] text-gray-600">
            Bạn có chắc chắn muốn reset mật khẩu về
            <span className="font-semibold text-redberry"> 123@123a</span> của
            người dùng{" "}
            <span className="font-semibold text-redberry">
              {selectedUserAction?.user.fullName}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmResetPassword}
      />
    </>
  );
};

export default ListUser;
