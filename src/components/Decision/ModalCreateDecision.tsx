import React, { useEffect, useState } from "react";
import ConfirmDialog from "../ui/confirm-dialog";
import { Checkbox } from "../ui/checkbox";
import {
  CreateDecisionRequest,
  DecisionStatus,
  Major,
  Semester,
} from "@/types/Decision";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Controller } from "react-hook-form";
import { convertDateForSearch } from "@/lib/ConvertDate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getMajorsList, uploadFile } from "@/services/decisionService";
import { toast } from "sonner";
export const formSchema = z.object({
  name: z.string().min(1, "Tên định mức là bắt buộc"),
  semesterId: z.number().min(1, "Kỳ học là bắt buộc"),
  defaultFee: z.number().min(1, "Phí đào tạo là bắt buộc"),
  fileInform: z.string().optional(),
  timeInform: z.string().min(1, "Ngày ban hành là bắt buộc"),
  status: z.string().min(1, "Trạng thái là bắt buộc"),
  estimationRequests: z.array(
    z.object({
      majorId: z.number().optional(),
      fee: z.number().optional(),
      educationProgram: z.string().optional(),
      name: z.string().optional(),
    })
  ),
});

interface ModalCreateDecisionProps {
  semesters: Semester[];
  isOpen: boolean;
  onSubmit: (data: CreateDecisionRequest) => void;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}
const ModalCreateDecision = ({
  isOpen,
  onOpenChange,
  semesters,
  onSubmit,
  isLoading = false,
}: ModalCreateDecisionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      semesterId: 0,
      defaultFee: 0,
      fileInform: "",
      timeInform: "",
      status: DecisionStatus.ACTIVE,
      estimationRequests: [],
    },
  });
  const {
    formState: { errors },
    setValue,
    control,
  } = form;

  const [majors, setMajors] = useState<Major[]>([]);
  const [isAllMajorChecked, setIsAllMajorChecked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      estimationRequests: values.estimationRequests.map((item) => ({
        ...item,
        fee: Number(item.fee),
        educationProgram: item.educationProgram,
        name: item.name,
      })),
      timeInform: convertDateForSearch(values.timeInform),
    };
    onSubmit(data as CreateDecisionRequest);
  };
  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };
  const fetchMajors = async () => {
    try {
      const response = await getMajorsList();
      setMajors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const mapMajorsToEstimationRequests = (majors: Major[], fee?: number) =>
    majors.map((m) => ({
      majorId: m.id,
      fee: fee,
      educationProgram: m.educationProgram?.name,
      name: m.name,
    }));

  const handleChangeAllMajor = (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setIsAllMajorChecked(isChecked);
    if (isChecked) {
      const defaultFee = form.getValues("defaultFee");
      setValue(
        "estimationRequests",
        mapMajorsToEstimationRequests(majors, defaultFee)
      );
    } else {
      setValue("estimationRequests", mapMajorsToEstimationRequests(majors));
    }
  };

  useEffect(() => {
    if (isAllMajorChecked) {
      const defaultFee = form.getValues("defaultFee");
      setValue(
        "estimationRequests",
        mapMajorsToEstimationRequests(majors, defaultFee)
      );
    }
  }, [form.watch("defaultFee"), majors, isAllMajorChecked]);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res?.url && res?.name) {
        setUploadedFile({ name: res.name, url: res.url });
        setValue("fileInform", res.url, { shouldValidate: true });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải lên file" + error);
      setUploadedFile(null);
      setValue("fileInform", "");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setValue("fileInform", "");
  };

  useEffect(() => {
    if (!isOpen) {
      setUploadedFile(null);
    }
  }, [isOpen]);

  const createDecisionForm = () => {
    return (
      <form
        id="create-decision-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full"
      >
        <div className="w-full h-12 flex mb-4">
          <div className="border-l-[5px] border-[#A2212B] h-6 flex items-center justify-center">
            <p className="text-lg font-semibold text-black pl-2">
              Thông tin định mức
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">
              Tên ban hành: <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="name"
                  maxWidthClass="lg:max-w-[100%]"
                  {...field}
                  placeholder="Nhập tên định mức"
                  className="h-10 w-full"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">
              Ngày ban hành: <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="timeInform"
              render={({ field }) => (
                <Input
                  id="timeInform"
                  maxWidthClass="lg:max-w-[100%]"
                  {...field}
                  placeholder="Nhập ngày ban hành"
                  className="h-10 w-full"
                  type="date"
                />
              )}
            />
            {errors.timeInform && (
              <p className="text-red-500 text-sm">
                {errors.timeInform.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="fileInform">Thông tin ban hành:</Label>
            <div className="relative border rounded-lg px-3 py-2 w-full flex items-center">
              {uploadedFile ? (
                <div className="flex items-center gap-2 justify-between w-full">
                  <span>{uploadedFile.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={handleRemoveFile}>
                      <i className="mdi mdi-close text-2xl"></i>
                    </button>
                    <i className="mdi mdi-file-upload-outline text-2xl"></i>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    placeholder="Thông tin ban hành"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <div
                    className="w-full h-8 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    tabIndex={0}
                    aria-label="Tải lên file thông tin ban hành"
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      fileInputRef.current?.click()
                    }
                  ></div>
                  
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    tabIndex={0}
                    aria-label="Tải lên file"
                  >
                    <i className="mdi mdi-file-upload-outline text-2xl"></i>
                  </span>
                </>
              )}
            </div>
            {uploading && (
              <p className="text-xs text-gray-500 mt-1">Đang tải lên...</p>
            )}
            {errors.fileInform && (
              <p className="text-red-500 text-sm">
                {errors.fileInform.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="semesterId">
              Kỳ học: <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.watch("semesterId")?.toString() || ""}
              onValueChange={(value) => {
                form.setValue("semesterId", Number(value));
              }}
            >
              <SelectTrigger
                id="semesterId"
                className={`h-10 w-full ${
                  form.formState.errors.semesterId ? "border-red-500" : ""
                }`}
                aria-label="Kỳ học"
                tabIndex={0}
              >
                <SelectValue placeholder="Chọn kỳ học" />
              </SelectTrigger>
              <SelectContent className="max-h-[280px] overflow-y-auto">
                {semesters.map((option) => (
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
            {form.formState.errors.semesterId && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.semesterId.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="status">
              Trạng thái: <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.watch("status")?.toString() || ""}
              onValueChange={(value) => {
                form.setValue("status", value as DecisionStatus);
              }}
            >
              <SelectTrigger
                id="status"
                className={`h-10 w-full ${
                  form.formState.errors.status ? "border-red-500" : ""
                }`}
                aria-label="Trạng thái"
              >
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent className="max-h-[280px] overflow-y-auto">
                <SelectItem value={DecisionStatus.ACTIVE}>Hoạt động</SelectItem>
                <SelectItem value={DecisionStatus.INACTIVE}>
                  Không hoạt động
                </SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="defaultFee">
              Phí đào tạo: <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="defaultFee"
              render={({ field }) => (
                <Input
                  id="defaultFee"
                  maxWidthClass="lg:max-w-[100%]"
                  {...field}
                  placeholder="Nhập phí đào tạo"
                  className="h-10 w-full"
                  type="number"
                  min={0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {form.formState.errors.defaultFee && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.defaultFee.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-2">
          <div className="flex flex-col gap-1"></div>
          <div className="flex flex-row justify-start items-center gap-3">
            <Checkbox
              checked={isAllMajorChecked}
              onCheckedChange={handleChangeAllMajor}
              className="w-5 h-5"
              tabIndex={0}
              aria-checked={isAllMajorChecked}
              aria-label="Dùng cho tất cả các ngành học"
            />
            <p className="text-base">Dùng cho tất cả các ngành học</p>
          </div>
        </div>
        <div className="block sm:hidden space-y-4 max-h-[18vh] overflow-y-auto">
          {majors.length === 0 ? (
            <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
              Không có dữ liệu
            </div>
          ) : (
            majors.map((major, idx) => (
              <div
                key={major.id}
                className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
                tabIndex={0}
                aria-label={`Thông tin cấu hình email: ${major.name}`}
              >
                <div className="flex justify-between text-sm border-b">
                  <span className="font-medium text-gray-600">STT</span>
                  <span className="text-gray-800">{idx + 1}</span>
                </div>
                <div className="flex justify-between gap-4 text-sm py-1 border-b">
                  <span className="font-medium text-gray-600 shrink-0 flex items-center">
                    Ngành:
                  </span>
                  <span className="font-normal text-sm text-right ">
                    {major.name}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-sm py-1 border-b">
                  <span className="font-medium text-gray-600 shrink-0">
                    Chương trình đào tạo:
                  </span>
                  <span className="text-gray-800 text-right">
                    {major.educationProgram?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b">
                  <span className="font-medium text-gray-600">
                    Phí đào tạo:
                  </span>
                  <div className="flex gap-2 flex-col lg:flex-row w-auto h-auto">
                    <Controller
                      control={control}
                      name={`estimationRequests.${idx}.fee`}
                      render={({ field }) => (
                        <Input
                          id={`estimationRequests.${idx}.fee`}
                          maxWidthClass="lg:max-w-[100%]"
                          {...field}
                          placeholder="Nhập phí đào tạo"
                          className="h-10 w-full"
                          type="number"
                          min={0}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="w-full hidden sm:block rounded-lg border border-gray-200 bg-white mt-3 max-h-[40vh] overflow-y-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[50px]">
                  <span className="text-xs font-semibold text-gray-700">
                    STT
                  </span>
                </TableHead>
                <TableHead>
                  <span className="text-xs font-semibold text-gray-700">
                    Ngành
                  </span>
                </TableHead>
                <TableHead>
                  <span className="text-xs font-semibold text-gray-700">
                    Chương trình đào tạo
                  </span>
                </TableHead>
                <TableHead>
                  <span className="text-xs font-semibold text-gray-700">
                    Phí thi lại
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {majors.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {majors.map((major, idx) => (
                <TableRow key={major.id} className="hover:bg-gray-50 h-15">
                  <TableCell className="text-sm text-gray-700 pl-2">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 pl-2 max-w-[250px] whitespace-normal">
                    <span className="font-normal">{major.name}</span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 pl-2 whitespace-normal">
                    {major.educationProgram?.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 pl-2">
                    <Controller
                      control={control}
                      name={`estimationRequests.${idx}.fee`}
                      render={({ field }) => (
                        <Input
                          id={`estimationRequests.${idx}.fee`}
                          maxWidthClass="lg:max-w-[100%]"
                          {...field}
                          placeholder="Nhập phí thi lại"
                          className="h-10 w-full"
                          type="number"
                          min={0}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </form>
    );
  };
  return (
    <ConfirmDialog
      large={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Tạo định mức"
      message={createDecisionForm()}
      onConfirm={() => form.handleSubmit(handleSubmit)()}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
};

export default ModalCreateDecision;
