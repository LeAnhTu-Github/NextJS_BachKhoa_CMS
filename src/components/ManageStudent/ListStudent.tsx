import React, { useState } from "react";
import api from "@/services/api";
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
import ConfirmDialog from "../ui/confirm-dialog";
import { toast } from "sonner";
import { Student } from "@/types/Student";
import { STUDENT_STATUS_OPTIONS, DEGREE_TYPE_OPTIONS } from "@/types/Student";
import DetailStudent from "./DetailStudent";

interface ListStudentProps {
  students: Student[];
  isLoading: boolean;
  onRefresh: () => void;
  onDelete: (studentId: number) => void;
  onEdit: (student: Student) => void;
  onHistory: (student: Student) => void;
}

type SelectedStudentAction = {
  student: Student;
  action: "delete" | "detail" | "update" | null;
} | null;

const ListStudent = ({
  students,
  isLoading,
  onRefresh,
  onDelete,
  onEdit,
  onHistory,
}: ListStudentProps) => {
  const [selectedStudent, setSelectedStudent] = useState<{
    id: number;
    newStatus: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedStudentAction, setSelectedStudentAction] =
    useState<SelectedStudentAction>(null);

  const handleStatusChange = (userId: number, newStatus: string) => {
    setSelectedStudent({ id: userId, newStatus });
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: number) => {
    setSelectedStudentAction({ student: students.find(student => student.id === userId)!, action: "delete" });
    setIsDeleteDialogOpen(true);
  }
  const handleDetail = (studentId: number) => {
    setSelectedStudentAction({ student: students.find(student => student.id === studentId)!, action: "detail" });
    setIsDetailDialogOpen(true);
  }
  const handleConfirmDelete = () => {
    onDelete(selectedStudentAction?.student.id || 0);
    setIsDeleteDialogOpen(false);
  }
  const handleConfirmStatusChange = async () => {
    const reponse = await api.put(`/user/changeStatus/${selectedStudent?.id}`, {
      id: selectedStudent?.id,
      status: selectedStudent?.newStatus,
    });
    if (reponse.status >= 200 && reponse.status < 300) {
      toast.success("Cập nhật trạng thái thành công");
    } else {
      toast.error("Cập nhật trạng thái thất bại");
    }
    setIsDialogOpen(false);
    setSelectedStudent(null);
    onRefresh();
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
  const StatusSelect = ({ student }: { student: Student }) => (
    <Select
      value={student.status}
      onValueChange={(value) => handleStatusChange(student.id, value)}
    >
      <SelectTrigger
        size="xs"
        className={`w-auto px-3 rounded-lg text-white text-xs font-thin [&_svg]:text-white [&_svg]:size-5 ${
          STUDENT_STATUS_OPTIONS.find(
            (option) => option.value === student.status
          )?.color
        }`}
      >
        <SelectValue placeholder="Chọn trạng thái" />
      </SelectTrigger>
      <SelectContent>
        {STUDENT_STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <>
      <div className="block sm:hidden space-y-4">
        {students.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          students.map((student, idx) => (
            <div
              key={student.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Thông tin sinh viên: ${student.fullName}`}
            >
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Họ tên:</span>
                <div className="flex flex-col items-end justify-center gap-1 min-h-[48px]">
                  <span className="font-medium text-xs text-red-700">
                    {student.fullName || ""}
                  </span>
                  <div className="text-xs font-medium">
                    Mã số sinh viên:{" "}
                    <span className="font-medium text-xs text-red-700">
                      {student.code || ""}
                    </span>
                  </div>
                  <div className="text-xs font-medium">
                    Email:{" "}
                    <span className="font-medium text-xs text-red-700">
                      {" "}
                      {student.email || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Khoá</span>
                <span className="text-gray-800">
                  {student.course?.name || ""}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Lớp</span>
                <span className="text-gray-800">
                  {student.classes?.name || ""}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Hình thức đào tạo
                </span>
                <span className="text-gray-800">
                  {student.trainingMethod?.name || ""}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Bằng cấp</span>
                <span className="text-gray-800">
                  {
                    DEGREE_TYPE_OPTIONS.find(
                      (option) => option.value === student.degreeType
                    )?.label
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Địa điểm đào tạo
                </span>
                <span className="text-gray-800">
                  {student.trainingUnit?.name || ""}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Thời gian bắt đầu
                </span>
                <span className="text-gray-800">
                  {student.startOfTraining?.replace(
                    /(\d{2})\/(\d{2})\/(\d{4})/,
                    "$2/$3"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Thời gian kết thúc
                </span>
                <span className="text-gray-800">
                  {student.expiryDate?.replace(
                    /(\d{2})\/(\d{2})\/(\d{4})/,
                    "$2/$3"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Trạng thái</span>
                <StatusSelect student={student} />
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="font-medium text-gray-600">Chức năng</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {}}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Xem chi tiết"
                    tabIndex={0}
                  >
                    <i className="mdi mdi-eye w-6 h-6 text-blue-400 text-2xl"></i>
                  </button>
                  <button
                    onClick={() => {}}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Chỉnh sửa"
                    tabIndex={0}
                  >
                    <i className="mdi mdi-pencil w-6 h-6 text-[#FFAE1F] text-2xl"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Quản lý tài khoản"
                    tabIndex={0}
                  >
                    <i className="mdi mdi-table-account w-6 h-6 text-[#4CAF50] text-2xl"></i>
                  </button>
                  <button
                    onClick={() => {}}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Xóa"
                    tabIndex={0}
                  >
                    <i className="mdi mdi-trash-can w-6 h-6 text-[#F44336] text-2xl"></i>
                  </button>
                </div>
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
                <span className="text-xs font-semibold text-gray-700">Thông tin chung</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Khoá</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Lớp</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Hình thức đào tạo</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Bằng cấp</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Địa điểm đào tạo</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Thời gian bắt đầu</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Thời gian kết thúc</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Trạng thái</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Chức năng</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {students.map((student, idx) => (
              <TableRow key={student.id} className="hover:bg-gray-50 h-15">
                <TableCell className="text-sm text-gray-700 pl-2">
                  {idx + 1}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start justify-center gap-1 min-h-[48px]">
                    <span className="font-medium text-xs text-red-700">
                      {student.fullName || ""}
                    </span>
                    <div className="text-xs font-medium">
                      Mã số sinh viên:{" "}
                      <span className="font-medium text-xs text-red-700">
                        {student.code || ""}
                      </span>
                    </div>
                    <div className="text-xs font-medium">
                      Email:{" "}
                      <span className="font-medium text-xs text-red-700">
                        {" "}
                        {student.email || ""}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {student.course?.name}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {student.classes?.name}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {student.trainingMethod?.name}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {
                    DEGREE_TYPE_OPTIONS.find(
                      (option) => option.value === student.degreeType
                    )?.label
                  }
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {student.trainingUnit?.name}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {student.startOfTraining?.replace(
                    /(\d{2})\/(\d{2})\/(\d{4})/,
                    "$2/$3"
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {student.expiryDate?.replace(
                    /(\d{2})\/(\d{2})\/(\d{4})/,
                    "$2/$3"
                  )}
                </TableCell>
                <TableCell>
                  <StatusSelect student={student} />
                </TableCell>
                <TableCell>
                  <div className="flex">
                    <button
                      onClick={() => handleDetail(student.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full focus:outline-none"
                      aria-label="Xem chi tiết"
                      tabIndex={0}
                    >
                      <i className="mdi mdi-eye w-6 h-6 text-blue-400 text-2xl"></i>
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="w-8 h-8 flex items-center justify-center rounded-full focus:outline-none"
                      aria-label="Chỉnh sửa"
                      tabIndex={0}
                    >
                      <i className="mdi mdi-pencil w-6 h-6 text-[#FFAE1F] text-2xl"></i>
                    </button>
                    <button
                      onClick={() => onHistory(student)}
                      className="w-8 h-8 flex items-center justify-center rounded-full focus:outline-none"
                      aria-label="Quản lý tài khoản"
                      tabIndex={0}  
                    >
                      <i className="mdi mdi-table-account w-6 h-6 text-[#4CAF50] text-2xl"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full focus:outline-none"
                      aria-label="Xóa"
                      tabIndex={0}
                    >
                      <i className="mdi mdi-trash-can w-6 h-6 text-[#F44336] text-2xl"></i>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xác nhận"
        message={
          <p className="text-[16px] text-gray-600">
            Bạn có chắc chắn muốn xóa sinh viên{" "}
            <span className="font-semibold text-red-700">
              {selectedStudentAction?.student.fullName}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmDelete}
      />
      <ConfirmDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Xác nhận"
        message={
          <p className="text-[16px] text-gray-600">
            Bạn có chắc chắn muốn đổi trạng thái từ{" "}
            <span className="font-semibold text-red-700">
              {selectedStudent?.newStatus === "ACTIVE"
                ? "Chưa kích hoạt"
                : "Kích hoạt"}
            </span>{" "}
            sang{" "}
            <span className="font-semibold text-red-700">
              {selectedStudent?.newStatus === "ACTIVE"
                ? "Kích hoạt"
                : "Chưa kích hoạt"}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmStatusChange}
      />
      <ConfirmDialog 
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        title="Thông tin sinh viên chi tiết"
        message={<DetailStudent student={selectedStudentAction?.student!} />}
        hiddenConfirm={true}
        large={true}
        onConfirm={() => {}}
      />
    </>
  );
};

export default ListStudent;
