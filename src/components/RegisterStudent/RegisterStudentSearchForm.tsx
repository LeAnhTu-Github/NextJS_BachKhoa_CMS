import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, Plus } from "lucide-react";
import { Clazz, Exam, FEE_PAID_STATUS_OPTIONS, SEND_MAIL_STATUS_OPTIONS } from "@/types/RegisterStudentExam";
import ConfirmDialog from "../ui/confirm-dialog";

const formSchema = z.object({
  clazzId: z.number().optional(),
  examId: z.number().optional(),
  feePaidStatus: z.string().optional(),
  sendMailStatus: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface RegisterStudentSearchFormProps {
  userCount: number;
  onSearch?: (values: FormValues) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  onSendMailFee?: () => void;
  onSendMailRefused?: () => void;
  initialValues?: FormValues;
  classes: Clazz[];
  exams: Exam[];
}

const RegisterStudentSearchForm = ({
  userCount,
  onSearch,
  onRefresh,
  onAdd,
  onSendMailFee,
  onSendMailRefused,
  initialValues,
  classes,
  exams,
}: RegisterStudentSearchFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      clazzId: undefined,
      examId: undefined,
      feePaidStatus: undefined,
      sendMailStatus: undefined,
    },
  });

  const [isOpenSendMailFee, setIsOpenSendMailFee] = useState(false);
  const [isOpenSendMailRefused, setIsOpenSendMailRefused] = useState(false);
  useEffect(() => {
    if (initialValues) {
      form.reset({
        clazzId: initialValues.clazzId,
        examId: initialValues.examId,
        feePaidStatus: initialValues.feePaidStatus,
        sendMailStatus: initialValues.sendMailStatus,
      });
    }
  }, [initialValues, form]);

  const handleSearch = (values: FormValues) => {
    onSearch?.(values);
  };

  const handleRefresh = () => {
    form.reset({
      clazzId: undefined,
      examId: undefined,
      feePaidStatus: undefined,
      sendMailStatus: undefined,
    });
    onRefresh?.();
  };

  return (
    <div className="flex flex-col 2xl:flex-row gap-4 py-4">
      <div className="flex items-center text-lg font-medium whitespace-nowrap">
        Danh sách người dùng
        <span className="ml-1 text-red-600 font-normal">({userCount})</span>
      </div>

      <div className="w-full flex justify-start xl:justify-end flex-wrap gap-4">
        <form
          onSubmit={form.handleSubmit(handleSearch)}
          className="flex flex-col 2xl:flex-row gap-4 w-full"
        >
          <div className="flex flex-col md:flex-row gap-4 flex-1 justify-end">
            <Controller
              name="clazzId"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() || ""}
                >
                  <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                    <SelectValue placeholder="Lớp" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {classes.map((clazz) => (
                      <SelectItem key={clazz.id} value={clazz.id.toString()}>
                        {clazz.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="examId"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() || ""}
                >
                  <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                    <SelectValue placeholder="Đợt thi" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id.toString()}>
                          {exam.name}
                        </SelectItem>
                      ))}    
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="feePaidStatus"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                    <SelectValue placeholder="Trạng thái trả học phí" defaultValue={""} />
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_PAID_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
             <Controller
              name="sendMailStatus"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                    <SelectValue placeholder="Trạng thái gửi mail" defaultValue={""} />
                  </SelectTrigger>
                  <SelectContent>
                    {SEND_MAIL_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="h-10 w-10"
              aria-label="Làm mới"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 bg-[#A2212B]"
              aria-label="Tìm kiếm"
            >
              <Search className="h-5 w-5 text-white" />
            </Button>
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 bg-[#A2212B]"
              onClick={onAdd}
              aria-label="Thêm định mức"
            >
              <Plus className="h-5 w-5 text-white" />
            </Button>
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 bg-[#FFAE1F]"
              onClick={() => setIsOpenSendMailFee(true)}
              aria-label="Gửi email thông báo học phí"
            >
              <i className="mdi mdi-email-plus"></i>
            </Button>
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 bg-[#F44336]"
              onClick={() => setIsOpenSendMailRefused(true)}
              aria-label="Gửi email thông báo không đủ điều kiện"
            >
              <i className="mdi mdi-email-remove"></i>
            </Button>
          </div>
        </form>
      </div>
      <ConfirmDialog
        isOpen={isOpenSendMailFee}
        onOpenChange={setIsOpenSendMailFee}
        title="Thông báo"
        message="Gửi email thông báo được phép đóng phí bảo vệ lại"
        onConfirm={() => onSendMailFee?.()}
      />
      <ConfirmDialog
        isOpen={isOpenSendMailRefused}
        onOpenChange={setIsOpenSendMailRefused}
        title="Thông báo"
        message="Gửi email thông báo từ chối đăng kí bảo vệ lại"
        onConfirm={() => onSendMailRefused?.()}
      />
    </div>
  );
};

export default RegisterStudentSearchForm;
