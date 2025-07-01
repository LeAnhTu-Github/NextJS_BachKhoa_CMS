import React, { useState } from "react";
import { STATUS_OPTIONS } from "@/types/Decision";
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
import {
  changeStatusDecision,
  deleteDecision,
  getFileExportByDecisionId,
} from "@/services/decisionService";
import { Decision, DecisionStatus } from "@/types/Decision";

interface DecisionTableProps {
  decision: Decision[];
  isLoading: boolean;
  onRefresh: () => void;
  onDetail: (decision: Decision) => void;
  onEdit: (decision: Decision) => void;
}

type SelectedDecisionAction = {
  decision: Decision;
  action: "delete" | "detail" | "edit" | null;
} | null;

const DecisionTable = ({
  decision,
  isLoading,
  onRefresh,
  onDetail,
  onEdit,
}: DecisionTableProps) => {
  const [selectedDecision, setSelectedDecision] = useState<{
    id: number;
    newStatus: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDecisionAction, setSelectedDecisionAction] =
    useState<SelectedDecisionAction>(null);

  const handleConfirmStatusChange = async (id: number, newStatus: string) => {
    try {
      await changeStatusDecision(id, newStatus as DecisionStatus);
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
    setSelectedDecision(null);
    onRefresh();
  };

  const handleDelete = (decisionId: number) => {
    const decisionItem = decision.find((e) => e.id === decisionId);
    if (decisionItem) {
      setSelectedDecisionAction({ decision: decisionItem, action: "delete" });
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDecisionAction?.decision) {
      try {
        await deleteDecision(selectedDecisionAction.decision.id);
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
      setSelectedDecisionAction(null);
    }
  };

  const handleDetail = (decisionId: number) => {
    const decisionDetail = decision.find((e) => e.id === decisionId);
    if (decisionDetail) {
      onDetail(decisionDetail);
    }
  };

  const handleEdit = (decisionId: number) => {
    const decisionItem = decision.find((e) => e.id === decisionId);
    if (decisionItem) {
      onEdit(decisionItem);
    }
  };

  const handleStatusChange = (decisionId: number, newStatus: string) => {
    setSelectedDecision({ id: decisionId, newStatus });
    setIsDialogOpen(true);
  };

  const handleExport = async (decisionId: number) => {
    try {
      const decisionItem = decision.find((e) => e.id === decisionId);
      if (decisionItem) {
        const response = await getFileExportByDecisionId(decisionId);
        const fileUrl = response.url;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Xuất file thành công");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Tải file thất bại");
      } else {
        toast.error("Tải file thất bại");
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

  const StatusSelect = ({ decision }: { decision: Decision }) => (
    <Select
      value={decision.status}
      onValueChange={(value) => handleStatusChange(decision.id, value)}
    >
      <SelectTrigger
        size="xs"
        className={`w-auto px-3 rounded-lg text-white text-xs font-thin [&_svg]:text-white [&_svg]:size-5 ${
          decision.status === "ACTIVE" ? "bg-redberry" : "bg-[#9E9E9E]"
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
        {decision.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          decision.map((decisionItem, idx) => (
            <div
              key={decisionItem.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Thông tin cấu hình email: ${decisionItem.name}`}
            >
              <div className="flex justify-between text-sm border-b">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0 flex items-center">
                  Tên ban hành định mức:
                </span>
                <span className="font-normal text-sm text-right ">
                  {decisionItem.name}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0">
                  Kỳ học:
                </span>
                <span className="text-gray-800 text-right">
                  {decisionItem.semester.name}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  File ban hành:
                </span>
                <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                  {decisionItem.fileInform ? (
                    <a
                      href={decisionItem.fileInform}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex hover:bg-rose-300 items-center justify-center rounded-full focus:outline-none transition-colors text-redberry"
                      aria-label="Tải file ban hành"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          window.open(decisionItem.fileInform!, "_blank");
                        }
                      }}
                    >
                      <i className="notranslate mdi mdi-file-download-outline text-gray-400 text-2xl"></i>
                    </a>
                  ) : (
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-full cursor-not-allowed"
                      aria-label="Không có file ban hành"
                      tabIndex={-1}
                      disabled
                    >
                      <i className="notranslate mdi mdi-file-download-outline text-redberry text-2xl"></i>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Trạng thái</span>
                <StatusSelect decision={decisionItem} />
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="font-medium text-gray-600">Chức năng</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDetail(decisionItem.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Xem chi tiết"
                    tabIndex={0}
                  >
                    <Eye className="w-6 h-6 text-blue-400 text-2xl" />
                  </button>
                  <button
                    onClick={() => handleExport(decisionItem.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Tải file Excel"
                    tabIndex={0}
                  >
                    <i className="notranslate mdi mdi-microsoft-excel text-green-500 text-2xl"></i>
                  </button>
                  <button
                    onClick={() => handleEdit(decisionItem.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Chỉnh sửa"
                    tabIndex={0}
                  >
                    <Edit className="w-6 h-6 text-yellow-600 text-2xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(decisionItem.id)}
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
                <span className="text-xs font-semibold text-gray-700">
                  Tên ban hành định mức
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Kỳ học
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  File ban hành
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Ngày ban hành
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Trạng thái
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
            {decision.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {decision.map((decisionItem, idx) => (
              <TableRow key={decisionItem.id} className="hover:bg-gray-50 h-15">
                <TableCell className="text-sm text-gray-700 pl-2">
                  {idx + 1}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[250px] whitespace-normal">
                  <span className="font-normal">{decisionItem.name}</span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {decisionItem.semester.name}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                    {decisionItem.fileInform ? (
                      <a
                        href={decisionItem.fileInform}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex hover:bg-rose-300 items-center justify-center rounded-full focus:outline-none transition-colors text-redberry"
                        aria-label="Tải file ban hành"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            window.open(decisionItem.fileInform!, "_blank");
                          }
                        }}
                      >
                        <i className="notranslate mdi mdi-file-download-outline text-redberry"></i>
                      </a>
                    ) : (
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-full cursor-not-allowed"
                        aria-label="Không có file ban hành"
                        tabIndex={-1}
                        disabled
                      >
                        <i className="notranslate mdi mdi-file-download-outline text-gray-400"></i>
                      </button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[300px] whitespace-normal">
                  {decisionItem.timeInform.split(" ")[0]}
                </TableCell>
                <TableCell>
                  <StatusSelect decision={decisionItem} />
                </TableCell>
                <TableCell width={150}>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDetail(decisionItem.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Xem chi tiết"
                      tabIndex={0}
                    >
                      <Eye className="w-6 h-6 text-blue-400 text-2xl" />
                    </button>
                    <button
                      onClick={() => handleExport(decisionItem.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Xem chi tiết"
                      tabIndex={0}
                    >
                      <i className="notranslate mdi mdi-microsoft-excel text-green-500 text-2xl"></i>
                    </button>
                    <button
                      onClick={() => handleEdit(decisionItem.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Chỉnh sửa"
                      tabIndex={0}
                    >
                      <Edit className="w-6 h-6 text-yellow-600 text-2xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(decisionItem.id)}
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
              {selectedDecision?.newStatus === "ACTIVE"
                ? "Chưa kích hoạt"
                : "Kích hoạt"}
            </span>{" "}
            sang{" "}
            <span className="font-semibold text-red-700">
              {selectedDecision?.newStatus === "ACTIVE"
                ? "Kích hoạt"
                : "Chưa kích hoạt"}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={() =>
          handleConfirmStatusChange(
            selectedDecision?.id || 0,
            selectedDecision?.newStatus || ""
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
              {selectedDecisionAction?.decision.name}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default DecisionTable;
