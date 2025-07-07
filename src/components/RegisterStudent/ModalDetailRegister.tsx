import React from "react";
import {
  CREDIT_STUDENT_TUITION_FEE_MANAGEMENT_OPTIONS,
  MANAGEMENT_STATUS_OPTIONS,
  RegisterStudentExam,
} from "@/types/RegisterStudentExam";
import ConfirmDialog from "../ui/confirm-dialog";
import { FEE_PAID_STATUS_OPTIONS } from "@/types/RegisterStudentExam";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SEND_MAIL_STATUS_OPTIONS } from "@/types/RegisterStudentExam";

interface ModalDetailRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  registerStudent: RegisterStudentExam;
}
const ModalDetailRegister = ({
  isOpen,
  onClose,
  registerStudent,
}: ModalDetailRegisterProps) => {
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

  const getRegisterStudentStatus = (status: string) => {
    const label = CREDIT_STUDENT_TUITION_FEE_MANAGEMENT_OPTIONS.find(
      (option) => option.value === status
    )?.label;

    const colorClass =
      CREDIT_STUDENT_TUITION_FEE_MANAGEMENT_OPTIONS.find(
        (option) => option.value === status
      )?.color || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`inline-block px-3 text-white py-1 rounded-md text-xs font-medium whitespace-nowrap ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  const getManagementStatus = (status: string) => {
    const label = MANAGEMENT_STATUS_OPTIONS.find(
      (option) => option.value === status
    )?.label;
    const colorClass =
      MANAGEMENT_STATUS_OPTIONS.find((option) => option.value === status)
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
  const messageDetail = () => {
    return (
      <div className="px-2 flex flex-col">
        <div className="flex flex-col gap-2">
          <div className="mt-4 mb-3 flex gap-3 items-center">
            <div className="border-l-[5px] border-redberry w-1 h-8"></div>
            <span className="text-xl font-semibold">Thông tin cá nhân</span>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Họ tên:{" "}
                </span>
                <span className="text-sm font-normal text-redberry">
                  {registerStudent.fullName}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Mã số sinh viên:{" "}
                </span>
                <span className="text-sm font-normal text-redberry">
                  {registerStudent.studentCode}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Email trường:{" "}
                </span>
                <span className="text-sm font-normal text-redberry">
                  {registerStudent.email}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Khoá:{" "}
                </span>
                <span className="text-sm font-normal text-redberry">
                  {registerStudent.course.name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Lớp:{" "}
                </span>
                <span className="text-sm font-normal text-redberry">
                  {registerStudent.clazz.name}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Ngành:{" "}
                </span>
                <span className="text-sm font-normal text-redberry">
                  {registerStudent.major.name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Hình thức đào tạo:{" "}
                </span>
                <span className="text-sm font-normal text-redberry">
                  {registerStudent.clazz.trainingMethodName}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 mb-3 flex gap-3 items-center">
            <div className="border-l-[5px] border-redberry w-1 h-8"></div>
            <span className="text-xl font-semibold">Thông tin đăng ký</span>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Đợt bảo vệ:{" "}
                </span>
                <span className="text-sm font-normal text-redberry">
                  {registerStudent.exam.name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Thời gian đăng ký:{" "}
                </span>
                <span className="text-sm font-normal text-redberry">
                  {registerStudent.createTime}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Trạng thái:{" "}
                </span>
                {getRegisterStudentStatus(
                  registerStudent.registerStudentStatus
                )}
              </div>
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Trạng thái trả học phí:{" "}
                </span>
                {getFeePaidStatus(registerStudent.feePaidStatus)}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex gap-2">
                <span className="text-sm text-[#000000099] font-normal">
                  Trạng thái gửi mail:{" "}
                </span>
                {getSendMailStatus(registerStudent.sendMailStatus)}
              </div>
            </div>
          </div>
          <div className="mt-8 mb-3 flex gap-3 items-center">
            <div className="border-l-[5px] border-redberry w-1 h-8"></div>
            <span className="text-xl font-semibold">Thông tin duyệt đơn</span>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="text-sm text-[#000000099] font-normal">
                    Người duyệt:{" "}
                  </span>
                  <span className="text-sm font-normal text-redberry">
                    {registerStudent.creditApprovedFullName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-[#000000099] font-normal">
                    Email người duyệt:{" "}
                  </span>
                  <span className="text-sm font-normal text-redberry">
                    {registerStudent.creditApprovedEmail}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-[#000000099] font-normal">
                    Duyệt tín chỉ:{" "}
                  </span>
                  {getManagementStatus(registerStudent.creditManagement)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="text-sm text-[#000000099] font-normal">
                    Người duyệt:{" "}
                  </span>
                  <span className="text-sm font-normal text-redberry">
                    {registerStudent.tuitionApprovedFullName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-[#000000099] font-normal">
                    Email người duyệt:{" "}
                  </span>
                  <span className="text-sm font-normal text-redberry">
                    {registerStudent.tuitionApprovedEmail}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-[#000000099] font-normal">
                    Duyệt học phí:{" "}
                  </span>
                  {getManagementStatus(registerStudent.tuitionFeeManagement)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="text-sm text-[#000000099] font-normal">
                    Người duyệt:{" "}
                  </span>
                  <span className="text-sm font-normal text-redberry">
                    {registerStudent.studentApprovedFullName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-[#000000099] font-normal">
                    Email người duyệt:{" "}
                  </span>
                  <span className="text-sm font-normal text-redberry">
                    {registerStudent.studentApprovedEmail}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-[#000000099] font-normal">
                    Duyệt sinh viên:{" "}
                  </span>
                  {getManagementStatus(registerStudent.studentManagement)}
                </div>
              </div>
            </div>
          </div>
          <div className="font-semibold text-base text-black  mt-4">
            Danh sách học phần đăng ký{" "}
            <span className="text-[#991B1B]">
              ({registerStudent.registerStudentTerms.length || 0})
            </span>
          </div>
          <>
            <div className="block sm:hidden space-y-4">
              {registerStudent.registerStudentTerms.length === 0 ? (
                <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
                  Không có dữ liệu
                </div>
              ) : (
                registerStudent.registerStudentTerms.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
                    tabIndex={0}
                    aria-label={`Học phần: ${item.term.name}`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-2">
                      <span className="font-medium text-gray-600">STT</span>
                      <span className="text-gray-800">{idx + 1}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b py-1">
                      <span className="font-medium text-gray-600">
                        Mã học phần:
                      </span>
                      <span className="text-gray-800">{item.term.code}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b py-1">
                      <span className="font-medium text-gray-600">
                        Tên học phần:
                      </span>
                      <span className="text-gray-800">{item.term.name}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b py-1">
                      <span className="font-medium text-gray-600">
                        Định mức:
                      </span>
                      <span className="text-gray-800">
                        {item.term.creditTraining}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b py-1">
                      <span className="font-medium text-gray-600">
                        Số tín chỉ học phí:
                      </span>
                      <span className="text-gray-800">{item.feeDecision}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="font-medium text-gray-600">
                        Thành tiền:
                      </span>
                      <span className="text-gray-800">{item.fee}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="hidden sm:block mt-3 w-full rounded-lg border border-gray-200 bg-white overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Mã học phần</TableHead>
                    <TableHead>Tên học phần</TableHead>
                    <TableHead>Định mức</TableHead>
                    <TableHead>Số tín chỉ học phí</TableHead>
                    <TableHead>Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registerStudent.registerStudentTerms.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-6 text-gray-500"
                      >
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    registerStudent.registerStudentTerms.map((item, idx) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{item.term.code}</TableCell>
                        <TableCell>{item.term.name}</TableCell>
                        <TableCell>{item.feeDecision}</TableCell>
                        <TableCell>{item.term.creditTraining}</TableCell>
                        <TableCell>{item.fee}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
          <div className="w-full flex justify-end items-center mt-4">
            <span className="font-normal text-sm text-[#00000099]">
              Tổng tiền:{" "}
            </span>
            <span className="text-[#991B1B] font-normal">
                {registerStudent.totalFee} VNĐ
              </span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={onClose}
      title="Chi tiết đăng ký"
      large={true}
      hiddenConfirm={true}
      onConfirm={() => {}}
      message={messageDetail()}
    />
  );
};

export default ModalDetailRegister;
