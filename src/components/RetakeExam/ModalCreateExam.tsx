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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Status } from "@/types/Email";
import { ExamRequest, Semester, STATUS_OPTIONS } from "@/types/Retake";
import { createExam } from "@/services/retakeExamService";
import { convertDateTimeFormat } from "@/lib/ConvertDate";
const formSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên kì thi lại" }),
  code: z.string().min(1, { message: "Vui lòng nhập mã kì thi lại" }),
  semesterId: z.string().min(1, { message: "Vui lòng chọn học kỳ" }),
  fromTime: z.string().min(1, { message: "Vui lòng nhập thời gian bắt đầu" }),
  toTime: z.string().min(1, { message: "Vui lòng nhập thời gian kết thúc" }),
  status: z.string().min(1, { message: "Vui lòng chọn Trạng thái" }),
});

type FormValues = z.infer<typeof formSchema>;

type ModalCreateExamProps = {
  open: boolean;
  listSemester: Semester[];
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
};

const ModalCreateExam: React.FC<ModalCreateExamProps> = ({
  open,
  listSemester,
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
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      semesterId: "",
      fromTime: "",
      toTime: "",
      status: Status.ACTIVE,
    },
  });
  const handleResetForm = () => {
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      fromTime: convertDateTimeFormat(data.fromTime),
      toTime: convertDateTimeFormat(data.toTime),
      type: "RETAKE_EXAM",
      semester: [],
    };
    setIsLoading(true);
    try {
      await createExam(payload as unknown as ExamRequest);
      toast.success("Thêm kỳ thi lại thành công");
      onRefresh();
      onOpenChange(false);
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
              Thêm mới kỳ thi lại
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
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="name">
                      Tên kỳ thi lại <span className="text-redberry">(*)</span>
                    </Label>
                    <Input
                      id="name"
                      maxWidthClass="lg:max-w-[100%]"
                      className={`h-10 w-full  ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder="Tên kỳ thi lại"
                      aria-label="Tên kỳ thi lại"
                      tabIndex={0}
                      {...register("name", {
                        required: "Vui lòng nhập Tên kỳ thi lại",
                      })}
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
                    <Label htmlFor="code">
                      Mã kỳ thi lại <span className="text-redberry">(*)</span>
                    </Label>
                    <Input
                      id="code"
                      maxWidthClass="lg:max-w-[100%]"
                      className={`h-10 w-full  ${
                        errors.code ? "border-red-500" : ""
                      }`}
                      placeholder="Mã kỳ thi lại"
                      aria-label="Mã kỳ thi lại"
                      tabIndex={0}
                      {...register("code", {
                        required: "Vui lòng nhập Mã kỳ thi lại",
                      })}
                      value={watch("code")}
                    />
                    <div className="flex h-3">
                      {errors.code && (
                        <span className="text-red-500 text-sm">
                          {errors.code.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="code">
                      Học kỳ <span className="text-redberry">(*)</span>
                    </Label>
                    <Select
                      value={watch("semesterId")}
                      onValueChange={(value) =>
                        setValue("semesterId", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger
                        id="status"
                        className={`w-full h-10 ${
                          errors.semesterId ? "border-red-500" : ""
                        }`}
                        aria-label="Học kỳ"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Học kỳ" />
                      </SelectTrigger>
                      <SelectContent>
                        {listSemester.map((option) => (
                          <SelectItem
                            key={option.id}
                            className="text-[#A2212B] caret-[#A2212B]"
                            value={option.id.toString()}
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex h-3">
                      {errors.semesterId && (
                        <span className="text-red-500 text-sm">
                          {errors.semesterId.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="code">
                      Thời gian bắt đầu đăng ký{" "}
                      <span className="text-redberry">(*)</span>
                    </Label>
                    <Input
                      id="fromTime"
                      maxWidthClass="lg:max-w-[100%]"
                      className={`h-10 w-full  ${
                        errors.fromTime ? "border-red-500" : ""
                      }`}
                      type="datetime-local"
                      placeholder="Thời gian bắt đầu đăng ký"
                      aria-label="Thời gian bắt đầu đăng ký"
                      tabIndex={0}
                      {...register("fromTime", {
                        required: "Vui lòng nhập Thời gian bắt đầu đăng ký",
                      })}
                      value={watch("fromTime")}
                    />
                    <div className="flex h-3">
                      {errors.fromTime && (
                        <span className="text-red-500 text-sm">
                          {errors.fromTime.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="code">
                      Thời gian kết thúc đăng ký{" "}
                      <span className="text-redberry">(*)</span>
                    </Label>
                    <Input
                      id="toTime"
                      maxWidthClass="lg:max-w-[100%]"
                      className={`h-10 w-full  ${
                        errors.toTime ? "border-red-500" : ""
                      }`}
                      type="datetime-local"
                      placeholder="Thời gian kết thúc đăng ký"
                      aria-label="Thời gian kết thúc đăng ký"
                      tabIndex={0}
                      {...register("toTime", {
                        required: "Vui lòng nhập Thời gian kết thúc đăng ký",
                      })}
                      value={watch("toTime")}
                    />
                    <div className="flex h-3">
                      {errors.toTime && (
                        <span className="text-red-500 text-sm">
                          {errors.toTime.message}
                        </span>
                      )}
                    </div>
                  </div>
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

export default ModalCreateExam;
