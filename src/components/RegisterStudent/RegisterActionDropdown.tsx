import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import {
    Eye,
    LayoutGrid,
    UserCog,
    Notebook,
    Pencil,
    RefreshCcw,
    Trash2,
  } from "lucide-react";
  import React, { ReactNode } from "react";
  
  type RegisterActionDropdownProps = {
    onDetail: () => void;
    onAssignClass: () => void;
    onPermission: () => void;
    onManageClass: () => void;
    onUpdate: () => void;
    onResetPassword: () => void;
    onDelete: () => void;
    trigger: ReactNode;
  };
  
  const RegisterActionDropdown: React.FC<RegisterActionDropdownProps> = ({
    onDetail,
    onAssignClass,
    onPermission,
    onManageClass,
    onUpdate,
    onResetPassword,
    onDelete,
    trigger,
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0 rounded-lg shadow-lg">
        <DropdownMenuItem
          onClick={onDetail}
          className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer"
          tabIndex={0}
          aria-label="Chi tiết"
        >
          <Eye className="text-[#00BCD4] w-5 h-5" />
          Chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onAssignClass}
          className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer"
          tabIndex={0}
          aria-label="Gán lớp sinh viên"
        >
          <LayoutGrid className="text-[#00BCD4] w-5 h-5" />
          Gán lớp sinh viên
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onPermission}
          className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer"
          tabIndex={0}
          aria-label="Phân quyền duyệt đơn"
        >
          <UserCog className="text-[#00BCD4] w-5 h-5" />
          Phân quyền duyệt đơn
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onManageClass}
          className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer"
          tabIndex={0}
          aria-label="Lớp quản lý"
        >
          <Notebook className="text-[#4CAF50] w-5 h-5" />
          Lớp quản lý
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onUpdate}
          className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer"
          tabIndex={0}
          aria-label="Cập nhật"
        >
          <Pencil className="text-[#FFC107] w-5 h-5" />
          Cập nhật
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onResetPassword}
          className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer"
          tabIndex={0}
          aria-label="Reset mật khẩu"
        >
          <RefreshCcw className="text-[#00BCD4] w-5 h-5" />
          Reset mật khẩu
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="gap-3 text-red-600 focus:bg-red-50 cursor-pointer"
          tabIndex={0}
          aria-label="Xóa"
        >
          <Trash2 className="text-red-600 w-5 h-5" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  export default RegisterActionDropdown;