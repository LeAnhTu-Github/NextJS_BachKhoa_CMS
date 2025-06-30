import React, { useState } from "react";
import { ExamStatus, STATUS_OPTIONS } from "@/types/Retake";
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
import { Edit, Trash2, Eye } from "lucide-react";
import axios from "axios";
import { ExamRequest } from "@/types/Retake";
import { changeStatusExam, deleteExam } from "@/services/retakeExamService";

interface ListExamProps {
  exam: ExamRequest[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (exam: ExamRequest) => void;
}

type SelectedExamAction = {
  exam: ExamRequest;
  action: "delete" | "detail" | "edit" | null;
} | null;

const ListExam = ({ exam, isLoading, onRefresh, onEdit }: ListExamProps) => {
  const [selectedExam, setSelectedExam] = useState<{
    id: number;
    newStatus: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedExamAction, setSelectedExamAction] =
    useState<SelectedExamAction>(null);

  const handleConfirmStatusChange = async (id: number, newStatus: string) => {
    try {
      await changeStatusExam(id, newStatus as ExamStatus);
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
    setSelectedExam(null);
    onRefresh();
  };

  const handleDelete = (examId: number) => {
    const examItem = exam.find((e) => e.id === examId);
    if (examItem) {
      setSelectedExamAction({ exam: examItem, action: "delete" });
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedExamAction?.exam) {
      try {
        await deleteExam(selectedExamAction.exam.id);
        toast.success("Xóa kỳ thi lại thành công");
        onRefresh();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Xóa kỳ thi lại thất bại"
          );
        } else {
          toast.error("Xóa kỳ thi lại thất bại");
        }
      }
      setIsDeleteDialogOpen(false);
      setSelectedExamAction(null);
    }
  };

  const handleDetail = (examId: number) => {
    const examDetail = exam.find((e) => e.id === examId);
    if (examDetail) {
      setSelectedExamAction({ exam: examDetail, action: "detail" });
      setIsDetailDialogOpen(true);
    }
  };

  const handleEdit = (examId: number) => {
    const examItem = exam.find((e) => e.id === examId);
    if (examItem) {
      onEdit(examItem);
    }
  };

  const messageDetail = (exam: ExamRequest) => {
    const getStatusLabel = (status: string) => {
      return (
        STATUS_OPTIONS.find((option) => option.value === status)?.label ||
        status
      );
    };

    return (
      <div className="w-full h-full gap-6 overflow-auto flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex gap-2">
            <span className="font-medium text-base text-gray-600 ">
              Tên kỳ đăng ký thi lại:
            </span>
            <span className="text-base text-redberry break-words">
              {exam.name}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-base text-gray-600">
              Mã kỳ đăng ký thi lại:
            </span>
            <span className="text-base text-redberry break-words">
              {exam.code}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex gap-2">
            <span className="font-medium text-base text-gray-600">Học kỳ:</span>
            <div className="flex gap-2 w-auto h-auto">
              <span className="text-base text-redberry break-words">
                {exam.semester?.name}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-base text-gray-600">
              Loại hình:
            </span>
            <div className="flex gap-2 w-auto h-auto">
              <span className="text-base text-redberry break-words">
                {exam.type === "RETAKE_EXAM" ? "Thi lại" : "Thi lần 2"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <div className="flex gap-2 items-center">
            <span className="font-medium text-base text-gray-600">
              Thời gian đăng ký:
            </span>
            <div className="flex gap-2 w-auto flex-col sm:flex-row h-auto">
              <p className="text-base text-redberry break-words">{exam.fromTime} ~</p>
              <p className="text-base text-redberry break-words">{exam.toTime}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="font-medium text-base text-gray-600">
              Trạng thái:
            </span>
            <div className="flex gap-2 w-auto h-auto">
              <div
                className={`w-auto px-3 py-1 rounded-lg text-white text-xs font-thin ${
                  exam.status === "ACTIVE" ? "bg-redberry" : "bg-[#9E9E9E]"
                }`}
              >
                {getStatusLabel(exam.status)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const handleStatusChange = (examId: number, newStatus: string) => {
    setSelectedExam({ id: examId, newStatus });
    setIsDialogOpen(true);
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

  const StatusSelect = ({ exam }: { exam: ExamRequest }) => (
    <Select
      value={exam.status}
      onValueChange={(value) => handleStatusChange(exam.id, value)}
    >
      <SelectTrigger
        size="xs"
        className={`w-auto px-3 rounded-lg text-white text-xs font-thin [&_svg]:text-white [&_svg]:size-5 ${
          exam.status === "ACTIVE" ? "bg-redberry" : "bg-[#9E9E9E]"
        }`}
      >
        <SelectValue placeholder="Chọn trạng thái" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
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
        {exam.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          exam.map((examItem, idx) => (
            <div
              key={examItem.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Thông tin cấu hình email: ${examItem.name}`}
            >
              <div className="flex justify-between text-sm border-b">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0 flex items-center">
                  Tên kỳ đăng ký thi lại:
                </span>
                <span className="font-normal text-sm text-right ">
                  {examItem.name}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0">
                  Mã kỳ đăng ký thi lại:
                </span>
                <span className="text-gray-800 text-right">
                  {examItem.code}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Học kỳ:</span>
                <span className="text-gray-800">{examItem.semester?.name}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Thời gian đăng ký:
                </span>
                <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                  <p>
                    {examItem.fromTime.match(/^\d{2}\/\d{2}\/\d{4}/)?.[0]} -
                  </p>
                  <p>{examItem.toTime.match(/^\d{2}\/\d{2}\/\d{4}/)?.[0]}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Trạng thái</span>
                <StatusSelect exam={examItem} />
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="font-medium text-gray-600">Chức năng</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDetail(examItem.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Xem chi tiết"
                    tabIndex={0}
                  >
                    <Eye className="w-6 h-6 text-blue-400 text-2xl" />
                  </button>
                  <button
                    onClick={() => handleEdit(examItem.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Chỉnh sửa"
                    tabIndex={0}
                  >
                    <Edit className="w-6 h-6 text-yellow-600 text-2xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(examItem.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Xóa"
                    tabIndex={0}
                  >
                    <Trash2 className="w-6 h-6 text-red-600 text-2xl" />
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
                <span className="text-xs font-semibold text-gray-700">Tên</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Mã kỳ đăng ký thi lại
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Học kỳ
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Thời gian đăng ký
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Trạng thái
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Chức năng
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exam.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {exam.map((examItem, idx) => (
              <TableRow key={examItem.id} className="hover:bg-gray-50 h-15">
                <TableCell className="text-sm text-gray-700 pl-2">
                  {idx + 1}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[250px] whitespace-normal">
                  <span className="font-normal">{examItem.name}</span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {examItem.code}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[300px] whitespace-normal">
                  {examItem.semester?.name}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                    <p>
                      {examItem.fromTime.match(/^\d{2}\/\d{2}\/\d{4}/)?.[0]} -
                    </p>
                    <p>{examItem.toTime.match(/^\d{2}\/\d{2}\/\d{4}/)?.[0]}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusSelect exam={examItem} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDetail(examItem.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Xem chi tiết"
                      tabIndex={0}
                    >
                      <Eye className="w-6 h-6 text-blue-400 text-2xl" />
                    </button>
                    <button
                      onClick={() => handleEdit(examItem.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Chỉnh sửa"
                      tabIndex={0}
                    >
                      <Edit className="w-6 h-6 text-yellow-600 text-2xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(examItem.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Xóa"
                      tabIndex={0}
                    >
                      <Trash2 className="w-6 h-6 text-red-600 text-2xl" />
                    </button>
                  </div>
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
              {selectedExam?.newStatus === "ACTIVE"
                ? "Chưa kích hoạt"
                : "Kích hoạt"}
            </span>{" "}
            sang{" "}
            <span className="font-semibold text-red-700">
              {selectedExam?.newStatus === "ACTIVE"
                ? "Kích hoạt"
                : "Chưa kích hoạt"}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={() =>
          handleConfirmStatusChange(
            selectedExam?.id || 0,
            selectedExam?.newStatus || ""
          )
        }
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xác nhận xóa"
        message={
          <p className="text-[16px] text-gray-600">
            Bạn có chắc chắn muốn xóa kỳ thi lại{" "}
            <span className="font-semibold text-red-700">
              {selectedExamAction?.exam.name}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmDelete}
      />
      <ConfirmDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        title="Chi tiết kỳ thi lại"
        message={
          selectedExamAction?.exam
            ? messageDetail(selectedExamAction.exam)
            : null
        }
        onConfirm={() => {}}
        hiddenConfirm={true}
      />
    </>
  );
};

export default ListExam;
