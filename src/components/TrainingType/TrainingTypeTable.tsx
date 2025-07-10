import { useState } from "react";
import React from "react";
import { TRAINING_STATUS_OPTIONS, TrainingType } from "@/types/TrainingType";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ConfirmDialog from "../ui/confirm-dialog";
import { Edit, Trash2 } from "lucide-react";
import { trainingTypeService } from "@/services/trainingtypeService";
import { toast } from "sonner";
interface TrainingTypeTableProps {
  trainingType: TrainingType[];
  onRefresh: () => void;
  onEdit: (trainingType: TrainingType) => void;
  onDelete: (trainingType: TrainingType) => void;
}

type SelectedTrainingTypeAction = {
  trainingType: TrainingType;
  action: "delete" | "edit" | null;
} | null;
const TrainingTypeTable = ({
  trainingType,
  onRefresh,
  onEdit,
  onDelete,
}: TrainingTypeTableProps) => {
  const [selectedTrainingType, setSelectedTrainingType] = useState<{
    id: number;
    newStatus: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrainingTypeAction, setSelectedTrainingTypeAction] =
    useState<SelectedTrainingTypeAction>(null);

  const handleStatusChange = (trainingTypeId: number, newStatus: string) => {
    setSelectedTrainingType({ id: trainingTypeId, newStatus });
    setIsDialogOpen(true);
  };
  const handleConfirmStatusChange = async () => {
    if (!selectedTrainingType) return;
    try {
      await trainingTypeService.changeStatusTrainingType(
        selectedTrainingType.id,
        selectedTrainingType.newStatus
      );
      toast.success("Cập nhật trạng thái thành công");
      setIsDialogOpen(false);
      setSelectedTrainingType(null);
      onRefresh();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái" + error);
    }
  };
  const StatusSelect = ({ trainingType }: { trainingType: TrainingType }) => (
    <Select
      value={trainingType.status}
      onValueChange={(value) => handleStatusChange(trainingType.id, value)}
    >
      <SelectTrigger
        size="xs"
        className={`w-auto px-3 rounded-lg text-white text-xs font-thin [&_svg]:text-white [&_svg]:size-5 ${
          trainingType.status === "ACTIVE" ? "bg-redberry" : "bg-[#9E9E9E]"
        }`}
      >
        <SelectValue placeholder="Chọn trạng thái" />
      </SelectTrigger>
      <SelectContent>
        {TRAINING_STATUS_OPTIONS.map((option) => (
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
        {trainingType.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          trainingType.map((training, idx) => (
            <div
              key={training.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Thông tin cấu hình email: ${training.name}`}
            >
              <div className="flex justify-between text-sm border-b">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0 flex items-center">
                  Mã loại hình đào tạo:
                </span>
                <span className="font-normal text-sm text-right ">
                  {training.code}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0">
                  Tên loại hình đào tạo:
                </span>
                <span className="text-gray-800 text-right">
                  {training.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Trạng thái</span>
                <StatusSelect trainingType={training} />
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="font-medium text-gray-600">Chức năng</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(training)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Chỉnh sửa"
                    tabIndex={0}
                  >
                    <Edit className="w-6 h-6 text-yellow-600 text-2xl" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTrainingTypeAction({
                        trainingType: training,
                        action: "delete",
                      });
                      setIsDeleteDialogOpen(true);
                    }}
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
                  Mã loại hình đào tạo
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Tên loại hình đào tạo:
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
            {trainingType.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {trainingType.map((training, idx) => (
              <TableRow key={training.id} className="hover:bg-gray-50 h-15">
                <TableCell className="text-sm text-gray-700 pl-2">
                  {idx + 1}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[250px] whitespace-normal">
                  <span className="font-normal">{training.code}</span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {training.name}
                </TableCell>
                <TableCell>
                  <StatusSelect trainingType={training} />
                </TableCell>
                <TableCell width={150}>
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => onEdit(training)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Chỉnh sửa"
                      tabIndex={0}
                    >
                      <Edit className="w-6 h-6 text-yellow-600 text-2xl" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTrainingTypeAction({
                          trainingType: training,
                          action: "delete",
                        });
                        setIsDeleteDialogOpen(true);
                      }}
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
              {selectedTrainingType?.newStatus === "ACTIVE"
                ? "Chưa kích hoạt"
                : "Kích hoạt"}
            </span>{" "}
            sang{" "}
            <span className="font-semibold text-red-700">
              {selectedTrainingType?.newStatus === "ACTIVE"
                ? "Kích hoạt"
                : "Chưa kích hoạt"}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmStatusChange}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xác nhận xóa"
        message={
          <p className="text-[16px] text-gray-600">
            Bạn có chắc chắn muốn xóa loại hình đào tạo{" "}
            <span className="font-semibold text-red-700">
              {selectedTrainingTypeAction?.trainingType.name}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={() => {
          if (selectedTrainingTypeAction?.trainingType) {
            onDelete(selectedTrainingTypeAction.trainingType);
          }
          setIsDeleteDialogOpen(false);
          setSelectedTrainingTypeAction(null);
        }}
      />
    </>
  );
};

export default TrainingTypeTable;
