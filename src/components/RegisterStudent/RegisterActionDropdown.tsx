import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  CreditStudentTuitionFeeManagement,
  RegisterStudentExam,
} from "@/types/RegisterStudentExam";
import React, { ReactNode } from "react";

type RegisterActionDropdownProps = {
  registerStudent: RegisterStudentExam;
  onDetail: () => void;
  onConfirmTuitionFee: () => void;
  onRefuseTuitionFee: () => void;
  onExportByCode: () => void;
  onDelete: () => void;
  onTableScore: () => void;
  trigger: ReactNode;
};

const RegisterActionDropdown: React.FC<RegisterActionDropdownProps> = ({
  registerStudent,
  onDetail,
  onConfirmTuitionFee,
  onRefuseTuitionFee,
  onExportByCode,
  onDelete,
  onTableScore,
  trigger,
}) => {
  const isShowAction = registerStudent.creditManagement === CreditStudentTuitionFeeManagement.WAIT_CONFIRM || registerStudent.tuitionFeeManagement === CreditStudentTuitionFeeManagement.WAIT_CONFIRM || registerStudent.studentManagement === CreditStudentTuitionFeeManagement.WAIT_CONFIRM;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-0 rounded-lg shadow-lg">
        <DropdownMenuItem
          onClick={onDetail}
          className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer flex items-center"
          tabIndex={0}
          aria-label="Chi tiết"
        >
          <i className="w-5 h-5 text-[#00BCD4] mdi mdi-eye text-2xl mb-2"></i>
          <span className="text-sm ">Chi tiết</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onExportByCode}
          className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer flex items-center"
          tabIndex={0}
          aria-label="Xuất file đăng ký"
        >
          <i className="w-5 h-5 text-redberry mdi mdi-microsoft-excel text-2xl mb-2"></i>
          <span className="text-sm ">Xuất file đăng ký</span>
        </DropdownMenuItem>
        {isShowAction && (
          <>
            <DropdownMenuItem
              onClick={onConfirmTuitionFee}
              className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer flex items-center"
              tabIndex={0}
              aria-label="Duyệt tín chỉ"
            >
              <i className="w-5 h-5 text-redberry mdi mdi-check-circle text-2xl mb-2"></i>
              <span className="text-sm ">Duyệt tín chỉ</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onRefuseTuitionFee}
              className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer flex items-center"
              tabIndex={0}
              aria-label="Từ chối"
            >
              <i className="w-5 h-5 text-redberry mdi mdi-cancel text-2xl mb-2"></i>
              <span className="text-sm ">Từ chối</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onClick={onTableScore}
          className="gap-3 text-gray-800 focus:bg-gray-100 cursor-pointer flex items-center"
          tabIndex={0}
          aria-label="Bảng điểm"
        >
          <i className="w-5 h-5 text-[#9c27b0] mdi mdi-table text-2xl mb-2"></i>
          <span className="text-sm ">Bảng điểm</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="gap-3 text-red-600 focus:bg-red-50 cursor-pointer flex items-center"
          tabIndex={0}
          aria-label="Xóa"
        >
          <i className="w-5 h-5 text-red-600 mdi mdi-trash-can text-2xl mb-2"></i>
          <span className="text-sm ">Xóa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RegisterActionDropdown;
