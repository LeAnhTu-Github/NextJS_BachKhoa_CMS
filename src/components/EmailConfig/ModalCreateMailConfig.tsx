import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Editor } from "primereact/editor";
import type { EditorTextChangeEvent } from "primereact/editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createEmailConfig } from "@/services/emailService";
import {
  ACTION_SEND_TYPE_OPTIONS,
  EXAM_TYPE_OPTIONS,
  SEND_TYPE_OPTIONS,
  Status,
  STATUS_OPTIONS,
} from "@/types/Email";
import { EmailConfig } from "@/types/Email";

const formSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập Tên" }),
  content: z.string().min(1, { message: "Vui lòng nhập Nội dung" }),
  actionSendType: z.string().min(1, { message: "Vui lòng chọn Hành động" }),
  sendType: z.string().min(1, { message: "Vui lòng chọn Đối tượng gửi mail" }),
  title: z.string().min(1, { message: "Vui lòng nhập Tiêu đề" }),
  type: z.string().min(1, { message: "Vui lòng chọn Mục tiêu" }),
  status: z.string().min(1, { message: "Vui lòng chọn Trạng thái" }),
});

type FormValues = z.infer<typeof formSchema>;

type ModalCreateMailConfigProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
};

const ModalCreateMailConfig: React.FC<ModalCreateMailConfigProps> = ({
  open,
  onOpenChange,
  onRefresh,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      actionSendType: "",
      sendType: "",
      title: "",
      type: "",
      status: Status.ACTIVE,
    },
  });

  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (e: EditorTextChangeEvent) => {
    setEditorContent(e.htmlValue ?? "");
    setValue("content", e.htmlValue ?? "", { shouldValidate: true });
  };

  const handleResetForm = () => {
    reset();
    setEditorContent("");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = getValues();
    setIsLoading(true);
    try {
      await createEmailConfig(data as EmailConfig);
      toast.success("Thêm cấu hình email thành công");
      onOpenChange(false);
      onRefresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi thêm cấu hình email"
        );
      } else {
        toast.error("Có lỗi xảy ra khi thêm cấu hình email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-[90vw] p-0 rounded-lg border-none sm:w-[80vw] sm:max-w-[80vw] md:w-[70vw] md:max-w-[70vw] lg:w-[1000px] lg:max-w-[1000px] overflow-auto"
      >
        <div className="flex flex-col w-full h-full">
          <DialogHeader className="bg-[#A52834] border-none rounded-t-lg px-8 py-4">
            <DialogTitle className="text-white text-2xl font-semibold">
              Thêm cấu hình email
            </DialogTitle>
            <DialogClose
              className="absolute right-6 top-3 text-white text-2xl"
              aria-label="Đóng"
              tabIndex={0}
              onClick={() => {
                handleResetForm();
              }}
            >
              ×
            </DialogClose>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <div
              className={`flex flex-col lg:flex-row bg-white px-8 py-4 gap-4 lg:gap-8 flex-1`}
            >
              <form
                id="create-mail-config-form"
                className={`w-full flex flex-col gap-4`}
                onSubmit={onSubmit}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="name">
                      Tên <span className="text-redberry">(*)</span>
                    </Label>
                    <Input
                      id="name"
                      maxWidthClass="lg:max-w-[100%]"
                      className={`h-10 w-full  ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder="Tên"
                      aria-label="Tên"
                      tabIndex={0}
                      {...register("name", { required: "Vui lòng nhập Tên" })}
                      value={watch("name")}
                    />
                    <div className="flex h-3">
                      {errors.name && (
                        <span className="text-red-500 text-sm">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="sendType">
                      Đối tượng gửi mail{" "}
                      <span className="text-redberry">(*)</span>
                    </Label>
                    <Select
                      value={watch("sendType")}
                      onValueChange={(value) =>
                        setValue("sendType", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger
                        id="sendType"
                        className={`w-full h-10 ${
                          errors.sendType ? "border-red-500" : ""
                        }`}
                        aria-label="Đối tượng gửi mail"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn đối tượng" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEND_TYPE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            className="text-[#A2212B] caret-[#A2212B]"
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex h-3">
                      {errors.sendType && (
                        <span className="text-red-500 text-sm">
                          {errors.sendType.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="type">
                      Loại gửi <span className="text-redberry">(*)</span>
                    </Label>
                    <Select
                      value={watch("type")}
                      onValueChange={(value) =>
                        setValue("type", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger
                        id="type"
                        className={`w-full h-10 ${
                          errors.type ? "border-red-500" : ""
                        }`}
                        aria-label="Mục tiêu"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn mục tiêu" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXAM_TYPE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            className="text-[#A2212B] caret-[#A2212B]"
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex h-3">
                      {errors.type && (
                        <span className="text-red-500 text-sm">
                          {errors.type.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="actionSendType">
                      Loại hành động <span className="text-redberry">(*)</span>
                    </Label>
                    <Select
                      value={watch("actionSendType")}
                      onValueChange={(value) =>
                        setValue("actionSendType", value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger
                        id="actionSendType"
                        className={`w-full h-10 ${
                          errors.actionSendType ? "border-red-500" : ""
                        }`}
                        aria-label="Hành động"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn hành động" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTION_SEND_TYPE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            className="text-[#A2212B] caret-[#A2212B]"
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex h-3">
                      {errors.actionSendType && (
                        <span className="text-red-500 text-sm">
                          {errors.actionSendType.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="status">
                      Trạng thái <span className="text-redberry">(*)</span>
                    </Label>
                    <Select
                      value={watch("status")}
                      onValueChange={(value) =>
                        setValue("status", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger
                        id="status"
                        className={`w-full h-10 ${
                          errors.status ? "border-red-500" : ""
                        }`}
                        aria-label="Trạng thái"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            className="text-[#A2212B] caret-[#A2212B]"
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex h-3">
                      {errors.status && (
                        <span className="text-red-500 text-sm">
                          {errors.status.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col lg:col-span-2 gap-1">
                    <Label htmlFor="content">
                      Nội dung <span className="text-redberry">(*)</span>
                    </Label>
                    <Editor
                      id="content"
                      aria-label="Nội dung"
                      tabIndex={0}
                      value={editorContent}
                      onTextChange={handleEditorChange}
                    />
                    <div className="flex h-3">
                      {errors.content && (
                        <span className="text-red-500 text-sm">
                          {errors.content.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <hr />
          <DialogFooter className="flex flex-row justify-end gap-2 bg-white px-8 py-4 rounded-b-xl">
            <DialogClose
              className="max-w-[100px] h-9 px-2 py-2 rounded bg-white border border-[#A52834] text-[#A52834] font-semibold hover:bg-[#F8D7DA] transition flex items-center gap-2"
              aria-label="Đóng"
              tabIndex={0}
              onClick={() => {
                handleResetForm();
              }}
            >
              Đóng
              <i className="mdi mdi-close text-xs"></i>
            </DialogClose>
            <button
              type="submit"
              form="create-mail-config-form"
              className="max-w-[100px] h-9 px-2 py-2 rounded bg-[#A52834] text-white font-semibold hover:bg-[#7C1C25] transition flex items-center gap-2"
              aria-label="Lưu"
              tabIndex={0}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Lưu
                  <Loader className="w-4 h-4 animate-spin ml-2" />
                </>
              ) : (
                <>
                  Lưu
                  <i className="mdi mdi-content-save-outline text-xs"></i>
                </>
              )}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateMailConfig;
