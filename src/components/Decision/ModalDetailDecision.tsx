import { Decision } from "@/types/Decision";
import React from "react";
import ConfirmDialog from "../ui/confirm-dialog";
import { STATUS_OPTIONS } from "@/types/Decision";
interface ModalDetailDecisionProps {
  isOpen: boolean;
  onClose: () => void;
  decision: Decision;
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const ModalDetailDecision = ({
  isOpen,
  onClose,
  decision,
}: ModalDetailDecisionProps) => {
  const handleClose = () => {
    onClose();
  };
  const messageDetail = () => {
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
            <span className="font-medium text-base text-gray-600">
              Tên ban hành định mức:
            </span>
            <span className="text-base text-redberry truncate">
              {decision.name}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-base text-gray-600">Kỳ học:</span>
            <span className="text-base text-redberry break-words">
              {decision.semester.name}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex gap-2">
            <span className="font-medium text-base text-gray-600">
              Ngày ban hành:
            </span>
            <div className="flex gap-2 w-auto h-auto">
              <span className="text-base text-redberry break-words">
                {decision.timeInform}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex gap-2 items-center">
            <span className="font-medium text-base text-gray-600">
              Trạng thái:
            </span>
            <div className="flex gap-2 w-auto h-auto">
              <div
                className={`w-auto px-3 py-1 rounded-lg text-white text-xs font-thin ${
                  decision.status === "ACTIVE" ? "bg-redberry" : "bg-[#9E9E9E]"
                }`}
              >
                {getStatusLabel(decision.status)}
              </div>
            </div>
          </div>
        </div>
        <hr className="my-2" />
        <div className="flex items-center text-lg font-medium whitespace-nowrap">
          Danh sách người dùng
          <span className="ml-1 text-red-600 font-normal">
            ({decision.estimationFeeDtos.length || 0})
          </span>
        </div>
        <div className="block sm:hidden space-y-4 overflow-auto max-h-[45vh]">
          {decision.estimationFeeDtos.length === 0 ? (
            <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
              Không có dữ liệu
            </div>
          ) : (
            decision.estimationFeeDtos.map((estimation, idx) => (
              <div
                key={estimation.id}
                className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
                tabIndex={0}
                aria-label={`Thông tin cấu hình email: ${estimation.major.name}`}
              >
                <div className="flex justify-between text-sm border-b">
                  <span className="font-medium text-gray-600">STT</span>
                  <span className="text-gray-800">{idx + 1}</span>
                </div>
                <div className="flex justify-between gap-4 text-sm py-1 border-b">
                  <span className="font-medium text-gray-600 shrink-0 flex items-center">
                    Tên ngành:
                  </span>
                  <span className="font-normal text-sm text-right ">
                    {estimation.major.name}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-sm py-1 border-b">
                  <span className="font-medium text-gray-600 shrink-0">
                    Mã ngành:
                  </span>
                  <span className="text-gray-800 text-right">
                    {estimation.major.code}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-sm py-1 border-b">
                  <span className="font-medium text-gray-600 shrink-0">
                    Phí đào tạo:
                  </span>
                  <span className="text-gray-800 text-right">
                    {estimation.fee}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="w-full hidden sm:block rounded-lg border border-gray-200 bg-white mt-3 overflow-y-auto max-h-[50vh]">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-5 flex items-center justify-start pl-2">
                  <span className="text-sm font-semibold text-gray-700">
                    STT
                  </span>
                </TableHead>
                <TableHead>
                  <span className="text-sm font-semibold text-gray-700">
                    Tên ngành
                  </span>
                </TableHead>
                <TableHead>
                  <span className="text-sm font-semibold text-gray-700">
                    Mã ngành
                  </span>
                </TableHead>
                <TableHead>
                  <span className="text-sm font-semibold text-gray-700">
                    Phí
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decision.estimationFeeDtos.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {decision.estimationFeeDtos.map((estimation, idx) => (
                <TableRow key={estimation.id} className="hover:bg-gray-50 h-15">
                  <TableCell className="text-sm text-gray-700 pl-4 flex items-center justify-start">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 pl-2 max-w-[250px] whitespace-normal">
                    <span className="font-normal">
                      {estimation.major.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                    {estimation.major.code}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                    {estimation.fee}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };
  return (
    <ConfirmDialog
      isOpen={isOpen}
      large={true}
      hiddenConfirm={true}
      onOpenChange={onClose}
      title="Chi tiết định mức"
      message={messageDetail()}
      onConfirm={handleClose}
    />
  );
};

export default ModalDetailDecision;
