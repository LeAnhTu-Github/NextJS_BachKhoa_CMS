import React, { useState } from "react";
import {
  EmailConfig,
  STATUS_OPTIONS,
  ACTION_SEND_TYPE_OPTIONS,
  EXAM_TYPE_OPTIONS,
  SEND_TYPE_OPTIONS,
  SendType,
  ExamType,
  ActionSendType,
} from "@/types/Email";
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
import { ArrowUpDown, ArrowUp, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExpandableText from "./ExpandableText";
import { changeStatusEmailConfig, deleteEmailConfig } from "@/services/emailService";
import axios from "axios";

interface EmailListProps {
  emailConfigs: EmailConfig[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (emailConfig: EmailConfig) => void;
}

type SelectedEmailAction = {
  emailConfig: EmailConfig;
  action: "delete" | "detail" | "edit" | null;
} | null;

type SortConfig = {
  key: keyof EmailConfig | null;
  direction: "asc" | "desc" | "none";
};

const EmailList = ({
  emailConfigs,
  isLoading,
  onRefresh,
  onEdit,
}: EmailListProps) => {
  const [selectedEmail, setSelectedEmail] = useState<{
    id: number;
    newStatus: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedEmailAction, setSelectedEmailAction] =
    useState<SelectedEmailAction>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const handleStatusChange = (emailId: number, newStatus: string) => {
    setSelectedEmail({ id: emailId, newStatus });
    setIsDialogOpen(true);
  };

  const handleConfirmStatusChange = async (id: number, newStatus: string) => {
    try {
      await changeStatusEmailConfig(id, newStatus);
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
      } else {
        toast.error("Cập nhật trạng thái thất bại");
      }
    }
    setIsDialogOpen(false);
    setSelectedEmail(null);
    onRefresh();
  };

  const handleDelete = (emailId: number) => {
    const emailConfig = emailConfigs.find((e) => e.id === emailId);
    if (emailConfig) {
      setSelectedEmailAction({ emailConfig, action: "delete" });
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedEmailAction?.emailConfig) {
      try {
        await deleteEmailConfig(selectedEmailAction.emailConfig.id);
        toast.success("Xóa cấu hình email thành công");
        onRefresh();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Xóa cấu hình email thất bại");
        } else {
          toast.error("Xóa cấu hình email thất bại");
        }
      }
      setIsDeleteDialogOpen(false);
      setSelectedEmailAction(null);
    }
  };

  const handleDetail = (emailId: number) => {
    const emailConfig = emailConfigs.find((e) => e.id === emailId);
    if (emailConfig) {
      setSelectedEmailAction({ emailConfig, action: "detail" });
      setIsDetailDialogOpen(true);
    }
  };

  const handleEdit = (emailId: number) => {
    const emailConfig = emailConfigs.find((e) => e.id === emailId);
    if (emailConfig) {
      onEdit(emailConfig);
    }
  };

  const getActionSendTypeLabel = (actionSendType: string) => {
    const actionSendTypeColor = {
      [ActionSendType.REJECT]: "bg-[#F44336] text-white",
      [ActionSendType.CONFIRM]: "bg-[#8BC34A] text-white",
      [ActionSendType.REMIND_PAY]: "bg-[#FFAE1F] text-white",
      [ActionSendType.PAY_SUCCESS]: "bg-[#4CAF50] text-white",
      [ActionSendType.SCHEDULE]: "bg-[#2196F3] text-white",
      [ActionSendType.RESULT]: "bg-[#009688] text-white",
      [ActionSendType.OTP]: "bg-[#00BCD4] text-white",
    };
    const label =
      ACTION_SEND_TYPE_OPTIONS.find((option) => option.value === actionSendType)
        ?.label || actionSendType;
    const colorClass =
      actionSendTypeColor[actionSendType as ActionSendType] ||
      "bg-gray-100 text-gray-800";

    return (
      <span
        className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  const getExamTypeLabel = (examType: string) => {
    const examTypeColor = {
      [ExamType.RETAKE_EXAM]: "bg-[#2196F3] text-white",
      [ExamType.RETAKE_COURSES]: "bg-[#4CAF50] text-white",
      [ExamType.REASSESSMENT]: "bg-[#009688] text-white",
      [ExamType.SHARED_DIRECTORY]: "bg-[#FF9800] text-white",
    };
    const label =
      EXAM_TYPE_OPTIONS.find((option) => option.value === examType)?.label ||
      examType;
    const colorClass =
      examTypeColor[examType as ExamType] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  const getSendTypeLabel = (sendType: string) => {
    const sendTypeColor = {
      [SendType.SV]: "bg-[#2196F3] text-white",
      [SendType.CBQL]: "bg-[#4CAF50] text-white",
      [SendType.GV]: "bg-[#009688] text-white",
    };

    const label =
      SEND_TYPE_OPTIONS.find((option) => option.value === sendType)?.label ||
      sendType;
    const colorClass =
      sendTypeColor[sendType as SendType] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  const messageDetail = (emailConfig: EmailConfig) => {
    const getStatusLabel = (status: string) => {
      return (
        STATUS_OPTIONS.find((option) => option.value === status)?.label ||
        status
      );
    };

    return (
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-auto">
        <div className="flex flex-col gap-2 lg:col-span-2">
          <div className="flex gap-2">
            <span className="font-medium text-sm text-gray-600 ">Tên:</span>
            <span className="text-sm text-redberry break-words">{emailConfig.name}</span>
          </div>
        </div>

        {/* Row 2: Action Type and Exam Type */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="font-medium text-sm text-gray-600">
              Đối tượng gửi mail:
            </span>
            <div className="flex gap-2 w-auto h-auto">
                {getSendTypeLabel(emailConfig.sendType)}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="font-medium text-sm text-gray-600">
              Mục tiêu:
            </span>
            <div className="flex gap-2 w-auto h-auto">
                {getExamTypeLabel(emailConfig.type)}
            </div>
          </div>
        </div>

        {/* Row 3: Send Type and Status */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="font-medium text-sm text-gray-600">
                Hành động:
            </span>
            <div className="flex gap-2 w-auto h-auto">
                {getActionSendTypeLabel(emailConfig.actionSendType)}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="font-medium text-sm text-gray-600">Trạng thái:</span>
            <div className="flex gap-2 w-auto h-auto">
                <div className={`w-auto px-3 py-1 rounded-lg text-white text-xs font-thin ${
                    emailConfig.status === "ACTIVE" ? "bg-redberry" : "bg-[#9E9E9E]"
                }`}>
                    {getStatusLabel(emailConfig.status)}
                </div>
            </div>
          </div>
        </div>

        {/* Row 4: Content - Full width */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          <span className="font-medium text-sm text-gray-600">Nội dung:</span>
            <div 
                dangerouslySetInnerHTML={{
                    __html: emailConfig.content
                }}
                className="text-sm text-gray-800 whitespace-pre-wrap"
            ></div>
        </div>
      </div>
    );
  };

  const handleSort = (key: keyof EmailConfig) => {
    setSortConfig((currentSort) => {
      if (currentSort.key !== key) {
        return { key, direction: "asc" };
      }

      switch (currentSort.direction) {
        case "asc":
          return { key, direction: "desc" };
        case "desc":
          return { key: null, direction: "none" };
        default:
          return { key, direction: "asc" };
      }
    });
  };

  const sortedEmailConfigs = React.useMemo(() => {
    if (!sortConfig.key || sortConfig.direction === "none") return emailConfigs;

    return [...emailConfigs].sort((a, b) => {
      const value = a[sortConfig.key as keyof EmailConfig];
      const aValue: string | number | null =
        typeof value === "string" || typeof value === "number" ? value : null;
      const value2 = b[sortConfig.key as keyof EmailConfig];
      const bValue: string | number | null =
        typeof value2 === "string" || typeof value2 === "number"
          ? value2
          : null;

      if (aValue === bValue) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [emailConfigs, sortConfig]);

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

  const StatusSelect = ({ emailConfig }: { emailConfig: EmailConfig }) => (
    <Select
      value={emailConfig.status}
      onValueChange={(value) => handleStatusChange(emailConfig.id, value)}
    >
      <SelectTrigger
        size="xs"
        className={`w-auto px-3 rounded-lg text-white text-xs font-thin [&_svg]:text-white [&_svg]:size-5 ${
          emailConfig.status === "ACTIVE" ? "bg-redberry" : "bg-[#9E9E9E]"
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

  const SortableHeader = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: keyof EmailConfig;
  }) => {
    const isSorted = sortConfig.key === sortKey;
    const isAsc = sortConfig.direction === "asc";
    return (
      <Button
        variant="ghost"
        onClick={() => handleSort(sortKey)}
        className="h-8 px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 group relative"
      >
        <span className="pr-6">{label}</span>
        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isSorted ? (
            <div
              className={`transform transition-transform duration-200 ${
                isAsc ? "rotate-0" : "rotate-180"
              }`}
            >
              <ArrowUp className="h-4 w-4" />
            </div>
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </div>
      </Button>
    );
  };

  return (
    <>
      <div className="block sm:hidden space-y-4">
        {emailConfigs.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          emailConfigs.map((emailConfig, idx) => (
            <div
              key={emailConfig.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Thông tin cấu hình email: ${emailConfig.name}`}
            >
              <div className="flex justify-between text-sm border-b">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0 flex items-center">Tên:</span>
                <span className="font-normal text-sm text-right ">
                  {emailConfig.name}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-sm py-1 border-b">
                <span className="font-medium text-gray-600 shrink-0">
                  Đối tượng gửi mail:
                </span>
                <span className="text-gray-800 text-right">
                  {getSendTypeLabel(emailConfig.sendType)}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">
                  Loại cấu hình gửi mail:
                </span>
                <span className="text-gray-800">
                  {getActionSendTypeLabel(emailConfig.actionSendType)}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Loại hành động:</span>
                <span className="text-gray-800">
                  {getExamTypeLabel(emailConfig.type)}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600 whitespace-nowrap flex items-start">Nội dung:</span>
                <span className="text-gray-800 pl-2">
                  <div className="max-w-[550px]">
                    <ExpandableText htmlContent={emailConfig.content} />
                  </div>
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Trạng thái</span>
                <StatusSelect emailConfig={emailConfig} />
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="font-medium text-gray-600">Chức năng</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDetail(emailConfig.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Xem chi tiết"
                    tabIndex={0}
                  >
                    <Eye className="w-6 h-6 text-blue-400 text-2xl" />
                  </button>
                    <button
                      onClick={() => handleEdit(emailConfig.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Chỉnh sửa"
                      tabIndex={0}
                    >
                      <Edit className="w-6 h-6 text-yellow-600 text-2xl" />
                    </button>
                  <button
                    onClick={() => handleDelete(emailConfig.id)}
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
                <SortableHeader label="Tên" sortKey="name" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Đối tượng gửi mail" sortKey="sendType" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Loại cấu hình gửi mail" sortKey="type" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Loại hành động" sortKey="actionSendType" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Nội dung" sortKey="content" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Trạng thái" sortKey="status" />
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                  Chức năng
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmailConfigs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {sortedEmailConfigs.map((emailConfig, idx) => (
              <TableRow key={emailConfig.id} className="hover:bg-gray-50 h-15">
                <TableCell className="text-sm text-gray-700 pl-2">
                  {idx + 1}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[250px] whitespace-normal">
                  <span className="font-normal">{emailConfig.name}</span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                  {getSendTypeLabel(emailConfig.sendType)}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[300px] whitespace-normal">
                  {getExamTypeLabel(emailConfig.type)}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {getActionSendTypeLabel(emailConfig.actionSendType)}
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  <div className="max-w-[550px]">
                    <ExpandableText htmlContent={emailConfig.content} />
                  </div>
                </TableCell>
                <TableCell>
                  <StatusSelect emailConfig={emailConfig} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDetail(emailConfig.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Xem chi tiết"
                      tabIndex={0}
                    >
                      <Eye className="w-6 h-6 text-blue-400 text-2xl" />
                    </button>
                    <button
                      onClick={() => handleEdit(emailConfig.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Chỉnh sửa"
                      tabIndex={0}
                    >
                      <Edit className="w-6 h-6 text-yellow-600 text-2xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(emailConfig.id)}
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
              {selectedEmail?.newStatus === "ACTIVE"
                ? "Không hoạt động"
                : "Đang hoạt động"}
            </span>{" "}
            sang{" "}
            <span className="font-semibold text-red-700">
              {selectedEmail?.newStatus === "ACTIVE"
                ? "Đang hoạt động"
                : "Không hoạt động"}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={() => handleConfirmStatusChange(selectedEmail?.id || 0, selectedEmail?.newStatus || "")}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xác nhận xóa"
        message={
          <p className="text-[16px] text-gray-600">
            Bạn có chắc chắn muốn xóa cấu hình email{" "}
            <span className="font-semibold text-red-700">
              {selectedEmailAction?.emailConfig.name}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmDelete}
      />
      <ConfirmDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        title="Chi tiết cấu hình email"
        message={
          selectedEmailAction?.emailConfig
            ? messageDetail(selectedEmailAction.emailConfig)
            : null
        }
        onConfirm={() => {}}
        hiddenConfirm={true}
      />
    </>
  );
};

export default EmailList;
