import React from "react";
import { RegisterStudentExam } from "@/types/RegisterStudentExam";
import ConfirmDialog from "../ui/confirm-dialog";
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
    console.log(1111, registerStudent)
  const messageDetail = () => {
    return (
      <div className="px-2 flex flex-col">
        <div className="flex flex-col gap-2">
          <div className="mt-8 mb-3 flex gap-3 items-center">
            <div className="border-l-[5px] border-redberry w-1 h-8"></div>
            <span className="text-xl font-semibold">Thông tin cá nhân</span>
          </div>
          <div className="w-full flex flex-col gap-2">
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
            <div className="flex gap-2">
              <span className="text-sm text-[#000000099] font-normal">
                Email trường:{" "}
              </span>
              <span className="text-sm font-normal text-redberry">
                {registerStudent.email}
              </span>
            </div>
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
                {registerStudent.birthday}
              </span>
            </div>
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
