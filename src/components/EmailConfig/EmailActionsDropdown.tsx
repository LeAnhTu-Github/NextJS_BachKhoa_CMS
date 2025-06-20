import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import React, { ReactNode } from "react";

interface EmailActionsDropdownProps {
  onDetail: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  trigger: ReactNode;
}

const EmailActionsDropdown: React.FC<EmailActionsDropdownProps> = ({
  onDetail,
  onUpdate,
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
        onClick={onUpdate}
        className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer"
        tabIndex={0}
        aria-label="Cập nhật"
      >
        <Pencil className="text-[#FFC107] w-5 h-5" />
        Cập nhật
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

export default EmailActionsDropdown;