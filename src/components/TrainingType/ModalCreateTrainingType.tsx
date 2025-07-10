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
import { trainingTypeService } from "@/services/trainingtypeService";
import {    
    TRAINING_STATUS_OPTIONS,
    TrainingStatus,
    TrainingTypeCreate
} from "@/types/TrainingType";

const formSchema = z.object({
  code: z.string().min(1, {message: "Vui lòng nhập Mã loại hình đào tạo"}),
  name: z.string().min(1, { message: "Vui lòng nhập Tên loại hình đào tạo" }),
  status: z.string().min(1, { message: "Vui lòng chọn Trạng thái" }),
});

type FormValues = z.infer<typeof formSchema>;

type ModalCreateTrainingTypeProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
};

const ModalCreateTrainingType: React.FC<ModalCreateTrainingTypeProps> = ({
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
      code: "",
      name: "",
      status: TrainingStatus.ACTIVE,
    },
  });
  const handleResetForm = () => {
    reset();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = getValues();
    setIsLoading(true);
    try {
      await trainingTypeService.createTrainingType(data as TrainingTypeCreate);
      toast.success("Thêm loại hình đào tạo thành công");
      onOpenChange(false);
      onRefresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi thêm loại hình đào tạo"
        );
      } else {
        toast.error("Có lỗi xảy ra khi thêm loại hình đào tạo");
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
              Thêm loại hình đào tạo
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
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="code">
                      Mã loại hình đào tạo <span className="text-redberry">(*)</span>
                    </Label>
                    <Input
                      id="name"
                      maxWidthClass="lg:max-w-[100%]"
                      className={`h-10 w-full  ${
                        errors.code ? "border-red-500" : ""
                      }`}
                      placeholder="Mã loại hình đào tạo"
                      aria-label="Mã loại hình đào tạo"
                      tabIndex={0}
                      {...register("code", { required: "Vui lòng nhập Mã loại hình đào tạo" })}
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
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="name">
                      Tên loại hình đào tạo <span className="text-redberry">(*)</span>
                    </Label>
                    <Input
                      id="name"
                      maxWidthClass="lg:max-w-[100%]"
                      className={`h-10 w-full  ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder="Tên loại hình đào tạo"
                      aria-label="Tên loại hình đào tạo"
                      tabIndex={0}
                      {...register("name", { required: "Vui lòng nhập Tên loại hình đào tạo" })}
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
                </div>
                <div className="grid grid-cols-1 gap-2">
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
                        {TRAINING_STATUS_OPTIONS.map((option) => (
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

export default ModalCreateTrainingType;
