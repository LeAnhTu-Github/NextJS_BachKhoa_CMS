import React, { useState } from "react";
import {
  FEE_PAID_STATUS_OPTIONS,
  IS_LISTED_FOR_BANK_OPTIONS,
  SEND_MAIL_STATUS_OPTIONS,
} from "@/types/RegisterStudentExam";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConfirmDialog from "../ui/confirm-dialog";
import { toast } from "sonner";
import axios from "axios";
import {
  changeStatusRegister,
  UpdateApprovedCredit,
  UpdateApprovedTuitionFee,
  UpdateApprovedStudent
} from "@/services/RegisterStudentService";
import {
  RegisterStudentExam,
  RegisterStudentStatus,
  CreditStudentTuitionFeeManagement,
} from "@/types/RegisterStudentExam";
import RegisterActionDropdown from "./RegisterActionDropdown";
export const getCurrentAction = (registerStudent: RegisterStudentExam) => {
  const { creditManagement, tuitionFeeManagement, studentManagement } = registerStudent;
  if (creditManagement === CreditStudentTuitionFeeManagement.WAIT_CONFIRM) {
    return 'credit';
  }
  if (creditManagement !== CreditStudentTuitionFeeManagement.WAIT_CONFIRM && 
      tuitionFeeManagement === CreditStudentTuitionFeeManagement.WAIT_CONFIRM) {
    return 'tuitionFee';
  }
  if (creditManagement !== CreditStudentTuitionFeeManagement.WAIT_CONFIRM && 
      tuitionFeeManagement !== CreditStudentTuitionFeeManagement.WAIT_CONFIRM && 
      studentManagement === CreditStudentTuitionFeeManagement.WAIT_CONFIRM) {
    return 'student';
  }
  return 'completed';
};
interface RegisterStudentTableProps {
  registerStudent: RegisterStudentExam[];
  isLoading: boolean;
  onRefresh: () => void;
  onExportByCode: (code: number) => void;
  onDetail: (registerStudent: RegisterStudentExam) => void;
  onTableScore: (registerStudent: RegisterStudentExam) => void;
  onDelete: (code: number) => void;
}

type SelectedRegisterStudentAction = {
  registerStudent: RegisterStudentExam;
  action: "delete" | "detail"| null;
} | null;

const RegisterStudentTable = ({
  registerStudent,
  isLoading,
  onRefresh,
  onExportByCode,
  onDetail,
  onTableScore,
  onDelete,
}: RegisterStudentTableProps) => {
  const [selectedRegisterStudent, setSelectedRegisterStudent] = useState<{
    id: number;
    newStatus: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRegisterStudentAction, setSelectedRegisterStudentAction] =
    useState<SelectedRegisterStudentAction>(null);
  const handleConfirmStatusChange = async (id: number, newStatus: string) => {
    try {
      await changeStatusRegister(id, newStatus as RegisterStudentStatus);
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Cập nhật trạng thái thất bại"
        );
      } else {
        toast.error("Cập nhật trạng thái thất bại");
      }
    }
    setIsDialogOpen(false);
    setSelectedRegisterStudent(null);
    onRefresh();
  };

  const handleDelete = (registerStudentId: number) => {
    const registerStudentItem = registerStudent.find(
      (e) => e.id === registerStudentId
    );
    if (registerStudentItem) {
      setSelectedRegisterStudentAction({
        registerStudent: registerStudentItem,
        action: "delete",
      });
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRegisterStudentAction?.registerStudent) {
      onDelete(Number(selectedRegisterStudentAction.registerStudent.id));
      setIsDeleteDialogOpen(false);
      setSelectedRegisterStudentAction(null);
    }
  };

  const handleDetail = (registerStudentId: number) => {
    const registerStudentDetail = registerStudent.find(
      (e) => e.id === registerStudentId
    );
    if (registerStudentDetail) {
      onDetail(registerStudentDetail);
    }
  };

  console.log(1111, selectedRegisterStudent)

  // const handleEdit = (registerStudentId: number) => {
  //   const registerStudentItem = registerStudent.find(
  //     (e) => e.id === registerStudentId
  //   );
  //   if (registerStudentItem) {
  //     onEdit(registerStudentItem);
  //   }
  // };

  // const handleStatusChange = (registerStudentId: number, newStatus: string) => {
  //   setSelectedRegisterStudent({ id: registerStudentId, newStatus });
  //   setIsDialogOpen(true);
  // };

const handleConfirmTuitionFee = async (registerStudentId: number, status: CreditStudentTuitionFeeManagement) => {
  try {
    const registerStudentItem = registerStudent.find(item => item.id === registerStudentId);
    if (!registerStudentItem) return;
    const currentAction = getCurrentAction(registerStudentItem);
    switch (currentAction) {
      case 'credit':
        await UpdateApprovedCredit(registerStudentId, status);
        break;
      case 'tuitionFee':
        await UpdateApprovedTuitionFee(registerStudentId, status);
        break;
      case 'student':
        await UpdateApprovedStudent(registerStudentId, status);
        break;
      default:
        return;
    }
    
    toast.success("Cập nhật trạng thái thành công");
    onRefresh();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  }
};

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

  const getFeePaidStatus = (status: string) => {
    const label = FEE_PAID_STATUS_OPTIONS.find(
      (option) => option.value === status
    )?.label;

    const colorClass =
      FEE_PAID_STATUS_OPTIONS.find((option) => option.value === status)
        ?.color || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`inline-block px-3 text-white py-1 rounded-md text-xs font-medium whitespace-nowrap ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  const getIsListedForBank = (status: string) => {
    const label = IS_LISTED_FOR_BANK_OPTIONS.find(
      (option) => option.value === status
    )?.label;

    const colorClass =
      IS_LISTED_FOR_BANK_OPTIONS.find((option) => option.value === status)
        ?.color || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`inline-block px-3 text-white py-1 rounded-md text-xs font-medium whitespace-nowrap ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  const getSendMailStatus = (status: string) => {
    const label = SEND_MAIL_STATUS_OPTIONS.find(
      (option) => option.value === status
    )?.label;

    const colorClass =
      SEND_MAIL_STATUS_OPTIONS.find((option) => option.value === status)
        ?.color || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`inline-block px-3 text-white py-1 rounded-md text-xs font-medium whitespace-nowrap ${colorClass}`}
      >
        {label}
      </span>
    );
  };
  return (
    <>
      <div className="block sm:hidden space-y-4">
        {registerStudent.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          registerStudent.map((registerStudentItem, idx) => (
            <div
              key={registerStudentItem.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Thông tin cấu hình email: ${registerStudentItem.id}`}
            >
              <div className="flex justify-between text-sm border-b">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0 flex items-center">
                  Thông tin sinh viên:
                </span>
                <div className="flex flex-col gap-2">
                  <span className="font-normal text-sm text-right text-redberry ">
                    {registerStudentItem.fullName}
                  </span>
                  <div className="flex flex-wrap justify-end">
                    <span className="font-normal text-sm text-right">
                      Mã số sinh viên:
                    </span>
                    <span className="font-normal text-sm text-right text-redberry">
                      {registerStudentItem.studentCode}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-end">
                    <span className="font-normal text-sm text-right">Lớp:</span>
                    <span className="font-normal text-sm text-right">
                      {registerStudentItem.clazz.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0">
                  Đợt bảo vệ:
                </span>
                <span className="text-gray-800 text-right">
                  {registerStudentItem.exam.name}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Học phần đăng ký:
                </span>
                <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                  <span className="font-normal text-sm text-right">
                    {registerStudentItem.term.name}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Mã đơn đăng ký:
                </span>
                <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                  <span className="font-normal text-sm text-right">
                    {registerStudentItem.code}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Thời gian đăng ký:
                </span>
                <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                  <span className="font-normal text-sm text-right">
                    {registerStudentItem.createTime}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Tổng học phí:</span>
                <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                  <span className="font-normal text-sm text-right">
                    {registerStudentItem.totalFee}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Trạng thái trả học phí:
                </span>
                <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                  <span className="font-normal text-sm text-right">
                    {getFeePaidStatus(registerStudentItem.feePaidStatus)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  TT thêm DS ngân hàng:
                </span>
                <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                  <span className="font-normal text-sm text-right">
                    {getIsListedForBank(registerStudentItem.isListedForBank)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Trạng thái gửi email:
                </span>
                <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                  <span className="font-normal text-sm text-right">
                    {getSendMailStatus(registerStudentItem.sendMailStatus)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="font-medium text-gray-600">Chức năng</span>
                <RegisterActionDropdown
                  registerStudent={registerStudentItem}
                  onDetail={() => handleDetail(registerStudentItem.id)}
                  onConfirmTuitionFee={() => handleConfirmTuitionFee(registerStudentItem.id, CreditStudentTuitionFeeManagement.CONFIRMED)}
                  onRefuseTuitionFee={() => handleConfirmTuitionFee(registerStudentItem.id, CreditStudentTuitionFeeManagement.REFUSED)}
                  onExportByCode={() => onExportByCode(registerStudentItem.id)}
                  onDelete={() => handleDelete(registerStudentItem.id)}
                  onTableScore={() => onTableScore(registerStudentItem)}
                  trigger={
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Chức năng"
                      tabIndex={0}
                    >
                      <svg width="20" height="20" fill="currentColor">
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
                <span className="text-xs font-semibold text-gray-700">
                  Thông tin sinh viên
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Đợt bảo vệ
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Học phần đăng ký
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Mã đơn đăng ký
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Thời gian đăng ký
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Tổng học phí
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Trạng thái trả học phí
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  TT thêm DS ngân hàng
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Trạng thái gửi email
                </span>
              </TableHead>
              <TableHead className="flex justify-center items-center">
                <span className="text-xs font-semibold text-gray-700">
                  Chức năng
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registerStudent.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center py-6 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {registerStudent.map((registerStudentItem, idx) => (
              <TableRow
                key={registerStudentItem.id}
                className="hover:bg-gray-50 h-15"
              >
                <TableCell className="text-sm text-gray-700 pl-2">
                  {idx + 1}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[250px] whitespace-normal">
                  <span className="font-normal">
                    {registerStudentItem.fullName}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {registerStudentItem.exam.name}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                    {registerStudentItem.term.name}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {registerStudentItem.code}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {registerStudentItem.createTime}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {registerStudentItem.totalFee}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {getFeePaidStatus(registerStudentItem.feePaidStatus)}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {getIsListedForBank(registerStudentItem.isListedForBank)}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {getSendMailStatus(registerStudentItem.sendMailStatus)}
                </TableCell>
                <TableCell className="flex justify-center items-center">
                  <RegisterActionDropdown
                    registerStudent={registerStudentItem}
                    onDetail={() => handleDetail(registerStudentItem.id)}
                    onConfirmTuitionFee={() => handleConfirmTuitionFee(registerStudentItem.id, CreditStudentTuitionFeeManagement.CONFIRMED)}
                    onRefuseTuitionFee={() => handleConfirmTuitionFee(registerStudentItem.id, CreditStudentTuitionFeeManagement.REFUSED)}
                    onExportByCode={() => onExportByCode(registerStudentItem.id)}
                    onDelete={() => handleDelete(registerStudentItem.id)}
                    onTableScore={() => onTableScore(registerStudentItem)}
                    trigger={
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                        aria-label="Chức năng"
                        tabIndex={0}
                      >
                        <svg width="20" height="20" fill="currentColor">
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
          // <p className="text-[16px] text-gray-600">
          //   Bạn có chắc chắn muốn đổi trạng thái từ{" "}
          //   <span className="font-semibold text-red-700">
          //     {selectedRegisterStudentAction? === "ACTIVE"
          //       ? "Chưa kích hoạt"
          //       : "Kích hoạt"}
          //   </span>{" "}
          //   sang{" "}
          //   <span className="font-semibold text-red-700">
          //     {selectedDecision?.newStatus === "ACTIVE"
          //       ? "Kích hoạt"
          //       : "Chưa kích hoạt"}
          //   </span>{" "}
          //   không?
          // </p>
          <p className="text-[16px] text-gray-600">Ahihi</p>
        }
        onConfirm={() =>
          handleConfirmStatusChange(
            selectedRegisterStudentAction?.registerStudent?.id || 0,
            selectedRegisterStudentAction?.registerStudent?.feePaidStatus || ""
          )
        }
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xác nhận xóa"
        message={
          <p className="text-[16px] text-gray-600">
            Xác nhận xóa sinh viên đăng ký{" "}
            <span className="font-semibold text-red-700">
              {selectedRegisterStudentAction?.registerStudent.fullName}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default RegisterStudentTable;
