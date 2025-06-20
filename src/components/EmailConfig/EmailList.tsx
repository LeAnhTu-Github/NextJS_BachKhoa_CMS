import React, { useState } from "react";
import api from "@/services/api";
import { Email } from "@/types/Email";
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
import EmailActionsDropdown from "./EmailActionsDropdown";
import ConfirmDialog from "../ui/confirm-dialog";
import { toast } from "sonner";
import { ArrowUpDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailListProps {
  emails: Email[];
  isLoading: boolean;
  onRefresh: () => void;
  onDelete: (emailId: number) => void;
  onEdit: (emailId: number) => void;
}

const statusOptions = [
  { label: "Kích hoạt", value: "ACTIVE" },
  { label: "Chưa kích hoạt", value: "INACTIVE" },
];

type SelectedEmailAction = {
  email: Email;
  action: "delete" | "detail" | null;
} | null;

type SortConfig = {
  key: keyof Email | null;
  direction: "asc" | "desc" | "none";
};

const EmailList = ({
  emails,
  isLoading,
  onRefresh,
  onDelete,
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

  const handleConfirmStatusChange = async () => {
    const response = await api.put(`/email/changeStatus/${selectedEmail?.id}`, {
      id: selectedEmail?.id,
      status: selectedEmail?.newStatus,
    });
    if (response.status >= 200 && response.status < 300) {
      toast.success("Cập nhật trạng thái thành công");
    } else {
      toast.error("Cập nhật trạng thái thất bại");
    }
    setIsDialogOpen(false);
    setSelectedEmail(null);
    onRefresh();
  };

  const handleDelete = (emailId: number) => {
    const email = emails.find((e) => e.id === emailId);
    if (email) {
      setSelectedEmailAction({ email, action: "delete" });
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedEmailAction?.email) {
      onDelete(selectedEmailAction.email.id);
      setIsDeleteDialogOpen(false);
      setSelectedEmailAction(null);
    }
  };

  const handleDetail = (emailId: number) => {
    const email = emails.find((e) => e.id === emailId);
    if (email) {
      setSelectedEmailAction({ email, action: "detail" });
      setIsDetailDialogOpen(true);
    }
  };

  const messageDetail = (email: Email) => {
    return (
      <div className="w-full h-full flex flex-col gap-4 overflow-auto">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2 flex gap-2">
            <span className="font-medium text-sm text-gray-600">Tên:</span>
            <span className="text-sm text-redberry">{email.name}</span>
          </div>
          <div className="w-full lg:w-1/2 flex gap-2">
            <span className="font-medium text-sm text-gray-600">
              Đối tượng gửi mail:
            </span>
            <span className="text-sm text-redberry">
              {email.targetAudience.join(", ")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex gap-2 w-full lg:w-1/2">
            <span className="font-medium text-sm text-gray-600">
              Loại cấu hình gửi mail:
            </span>
            <span className="text-sm text-redberry">
              {email.configType.join(", ")}
            </span>
          </div>
          <div className="flex gap-2 w-full lg:w-1/2">
            <span className="font-medium text-sm text-gray-600">
              Loại hành động:
            </span>
            <span className="text-sm text-redberry">
              {email.actionType.join(", ")}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <span className="font-medium text-sm text-gray-600">Nội dung:</span>
          <div className="flex-1">
            <span className="text-sm text-redberry break-words">
              {email.content}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full items-center">
          <span className="font-medium text-sm text-gray-600">Trạng thái:</span>
          <div className="flex gap-2 w-auto h-auto p-2 rounded-sm bg-redberry">
            <span className="text-xs text-white">
              {email.status === "ACTIVE" ? "Kích hoạt" : "Chưa kích hoạt"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const handleSort = (key: keyof Email) => {
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

  const sortedEmails = React.useMemo(() => {
    if (!sortConfig.key || sortConfig.direction === "none") return emails;

    return [...emails].sort((a, b) => {
      let aValue: string | number | null;
      let bValue: string | number | null;

      if (sortConfig.key === 'targetAudience' || sortConfig.key === 'configType' || sortConfig.key === 'actionType') {
        aValue = a[sortConfig.key].join(", ");
        bValue = b[sortConfig.key].join(", ");
      } else if (sortConfig.key === 'status') {
        aValue = a.status === 'ACTIVE' ? 'Kích hoạt' : 'Chưa kích hoạt';
        bValue = b.status === 'ACTIVE' ? 'Kích hoạt' : 'Chưa kích hoạt';
      } else {
        const value = a[sortConfig.key as keyof Email];
        aValue = typeof value === 'string' || typeof value === 'number' ? value : null;
        const value2 = b[sortConfig.key as keyof Email];
        bValue = typeof value2 === 'string' || typeof value2 === 'number' ? value2 : null;
      }

      if (aValue === bValue) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [emails, sortConfig]);

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

  const StatusSelect = ({ email }: { email: Email }) => (
    <Select
      value={email.status}
      onValueChange={(value) => handleStatusChange(email.id, value)}
    >
      <SelectTrigger
        size="xs"
        className={`w-auto px-3 rounded-lg text-white text-xs font-thin [&_svg]:text-white [&_svg]:size-5 ${
          email.status === "ACTIVE" ? "bg-redberry" : "bg-[#9E9E9E]"
        }`}
      >
        <SelectValue placeholder="Chọn trạng thái" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const SortableHeader = ({ 
    label, 
    sortKey 
  }: { 
    label: string; 
    sortKey: keyof Email | 'targetAudience' | 'configType' | 'actionType' | 'status' 
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
            <div className={`transform transition-transform duration-200 ${isAsc ? 'rotate-0' : 'rotate-180'}`}>
              <ArrowUp className="h-4 w-4" />
            </div>
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </div>
      </Button>
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <>
      <div className="block sm:hidden space-y-4">
        {emails.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          emails.map((email, idx) => (
            <div
              key={email.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Thông tin email: ${email.name}`}
            >
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Tên:</span>
                <span className="text-redberry font-semibold">{email.name}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Đối tượng gửi mail</span>
                <span className="text-gray-800">{email.targetAudience.join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Loại cấu hình gửi mail</span>
                <span className="text-gray-800">{email.configType.join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Loại hành động</span>
                <span className="text-gray-800">{email.actionType.join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Nội dung</span>
                <span className="text-gray-800">{truncateText(email.content, 50)}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Trạng thái</span>
                <StatusSelect email={email} />
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="font-medium text-gray-600">Chức năng</span>
                <EmailActionsDropdown
                  onDetail={() => handleDetail(email.id)}
                  onUpdate={() => onEdit(email.id)}
                  onDelete={() => handleDelete(email.id)}
                  trigger={
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                      aria-label="Chức năng"
                      tabIndex={0}
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="text-gray-600"
                        aria-hidden="true"
                      >
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
                <SortableHeader label="Tên" sortKey="name" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Đối tượng gửi mail" sortKey="targetAudience" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Loại cấu hình gửi mail" sortKey="configType" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Loại hành động" sortKey="actionType" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Nội dung" sortKey="content" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Trạng thái" sortKey="status" />
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">Chức năng</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmails.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {sortedEmails.map((email, idx) => (
              <TableRow key={email.id} className="hover:bg-gray-50 h-15">
                <TableCell className="text-sm text-gray-700 pl-2">{idx + 1}</TableCell>
                <TableCell>
                  <span className="font-semibold text-red-700">{email.name}</span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[150px]">
                  <div className="flex flex-wrap gap-1">
                    {email.targetAudience.map((audience, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[150px]">
                  <div className="flex flex-wrap gap-1">
                    {email.configType.map((config, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md"
                      >
                        {config}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[150px]">
                  <div className="flex flex-wrap gap-1">
                    {email.actionType.map((action, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-md"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2 max-w-[200px]">
                  <div className="truncate" title={email.content}>
                    {truncateText(email.content, 100)}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusSelect email={email} />
                </TableCell>
                <TableCell>
                  <EmailActionsDropdown
                    onDetail={() => handleDetail(email.id)}
                    onUpdate={() => onEdit(email.id)}
                    onDelete={() => handleDelete(email.id)}
                    trigger={
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                        aria-label="Chức năng"
                        tabIndex={0}
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="text-gray-600"
                          aria-hidden="true"
                        >
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
          <p className="text-[16px] text-gray-600">
            Bạn có chắc chắn muốn đổi trạng thái từ{" "}
            <span className="font-semibold text-red-700">
              {selectedEmail?.newStatus === "ACTIVE"
                ? "Chưa kích hoạt"
                : "Kích hoạt"}
            </span>{" "}
            sang{" "}
            <span className="font-semibold text-red-700">
              {selectedEmail?.newStatus === "ACTIVE"
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
            Bạn có chắc chắn muốn xóa email{" "}
            <span className="font-semibold text-red-700">
              {selectedEmailAction?.email.name}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        title="Chi tiết email"
        message={
          selectedEmailAction?.email
            ? messageDetail(selectedEmailAction.email)
            : null
        }
        onConfirm={() => {}}
        hiddenConfirm={true}
      />
    </>
  );
};

export default EmailList;