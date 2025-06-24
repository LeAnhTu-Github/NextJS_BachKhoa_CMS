import React from "react";
import { DEGREE_TYPE_OPTIONS, Student, STUDENT_STATUS_OPTIONS } from "@/types/Student";
import ToggleableField from "../ui/toggleDetail";

interface DetailStudentProps {
  student: Student;
}
const DetailStudent = ({ student }: DetailStudentProps) => {
  return (
    <div className="flex flex-col gap-3 w-full h-auto px-6 pb-5 overflow-y-auto max-h-[80vh]">
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full h-16 flex">
          <div className="border-l-[5px] border-[#A2212B] h-8 flex items-center justify-center">
            <p className="text-xl font-semibold text-black pl-2">
              Thông tin cá nhân
            </p>
          </div>
        </div>
        <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">Họ tên:</p>
            <p className="text-sm text-redberry">{student.fullName}</p>
          </div>
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">
              Mã số sinh viên:
            </p>
            <p className="text-sm text-redberry">{student.code}</p>
          </div>
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">Giới tính:</p>
            <p className="text-sm text-redberry">{student.gender}</p>
          </div>
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">CMND/CCCD:</p>
            <p className="text-sm text-redberry">{student.citizen}</p>
          </div>
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">Ngày sinh:</p>
            <p className="text-sm text-redberry">{student.birthday}</p>
          </div>
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">Nơi sinh:</p>
            <p className="text-sm text-redberry">{student.address}</p>
          </div>
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">
              Địa chỉ liên hệ:
            </p>
            <p className="text-sm text-redberry">{student.birthplace}</p>
          </div>
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">
              Email trường:
            </p>
            <p className="text-sm text-redberry">{student.email}</p>
          </div>
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">
              Email cá nhân:
            </p>
            <p className="text-sm text-redberry">{student.emailOther}</p>
          </div>
          <div className="flex gap-1 w-full">
            <p className="text-sm font-thin text-[#00000099]">Trú quán:</p>
            <p className="text-sm text-redberry">{student.homeTown}</p>
          </div>
          <div className="flex gap-1 w-full items-center">
            <p className="text-sm font-thin text-[#00000099]">Dân tộc:</p>
            <p className="text-sm text-redberry">{student.ethnicity}</p>
          </div>
          <div className="flex gap-1 items-center w-full">
            <p className="text-sm font-thin text-[#00000099]">Trạng thái:</p>
            <div
              className={`w-auto px-3 rounded-lg text-white text-xs font-thin [&_svg]:text-white [&_svg]:size-5 ${
                STUDENT_STATUS_OPTIONS.find(
                  (option) => option.value === student.status
                )?.color
              }`}
            >
              <p className="text-sm text-white">
                {
                  STUDENT_STATUS_OPTIONS.find(
                    (option) => option.value === student.status
                  )?.label
                }
              </p>
            </div>
          </div>
          <div className="flex gap-1 w-full items-center">
            <p className="text-sm font-thin text-[#00000099]">
              Số điện thoại:
            </p>
            <p className="text-sm text-redberry">{student.phone}</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full h-16 flex">
          <div className="border-l-[5px] border-[#A2212B] h-8 flex items-center justify-center">
            <p className="text-xl font-semibold text-black pl-2">
              Thông tin đào tạo
            </p>
          </div>
        </div>
        <div className="w-full h-auto grid grid-cols-1 gap-x-8 gap-y-1">
          <ToggleableField
            label="Địa điểm đào tạo"
            value={student.trainingUnit?.name || ""}
            codeLabel="Mã địa điểm đào tạo"
            codeValue={student.trainingUnit?.code || ""}
          />
          <ToggleableField
            label="Tên lớp"
            value={student.classes?.name || ""}
            codeLabel="Mã lớp"
            codeValue={student.classes?.code || ""}
          />
          <ToggleableField
            label="Tên khóa học"
            value={student.course?.name || ""}
            codeLabel="Mã khóa học"
            codeValue={student.course?.code || ""}
            codeLabel2="Thời gian"
            codeValue2={
              student.course?.fromTime && student.course?.toTime
                ? `${student.course.fromTime.split(" ")[0]} - ${student.course.toTime.split(" ")[0]}`
                : student.course?.fromTime ||
                  student.course?.toTime ||
                  "Chưa có thông tin"
            }
          />
          <ToggleableField
            label="Loại hình đào tạo"
            value={student.trainingType?.name || ""}
            codeLabel="Mã loại hình đào tạo"
            codeValue={student.trainingType?.code || ""}
          />
          <ToggleableField
            label="Hình thức đào tạo"
            value={student.trainingMethod?.name || ""}
            codeLabel="Mã hình thức đào tạo"
            codeValue={student.trainingMethod?.code || ""}
          />
          <ToggleableField
            label="Ngành"
            value={student.major?.name || ""}
            codeLabel="Mã ngành"
            codeValue={student.major?.code || ""}
          />
          <div className="w-full h-auto grid grid-cols-1 lg:grid-cols-3 gap-x-8 px-6 py-4">
            <div className="flex gap-1 w-full">
              <p className="text-base text-[#00000099]">Bằng cấp:</p>
              <p className="text-base text-redberry">{DEGREE_TYPE_OPTIONS.find(option => option.value === student.degreeType)?.label}</p>
            </div> 
            <div className="flex gap-1 w-full">
              <p className="text-base text-[#00000099]">Thời gian bắt đầu:</p>
              <p className="text-base text-redberry">{student.startOfTraining?.split('/').slice(1).join('/')}</p>
            </div>
            <div className="flex gap-1 w-full">
              <p className="text-base text-[#00000099]">Thời gian kết thúc:</p>
              <p className="text-base text-redberry">{student.expiryDate?.split('/').slice(1).join('/')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailStudent;
