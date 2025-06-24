import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "../ui/confirm-dialog";
import {
  Gender,
  STUDENT_STATUS_OPTIONS,
  GENDER_OPTIONS,
} from "@/types/Student";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { useStudentDataContext } from "@/app/(root)/quan-ly-sinh-vien/StudentDataContext";

const formSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  classes: z.number().optional(), 
  course: z.number().optional(),
  majorId: z.number().optional(),
  gender: z.string().optional(),
  trainingMethod: z.number().optional(),
  trainingUnitId: z.number().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface StudentSearchFormProps {
  emailCount: number;
  onSearch?: (values: FormValues) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
}

const StudentSearchForm = ({
  emailCount,
  onSearch,
  onRefresh,
  onAdd,
}: StudentSearchFormProps) => {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const { classes, majors, courses, trainingUnits, trainingMethods } = useStudentDataContext();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      status: "",
      classes: undefined,
      course: undefined,
      majorId: undefined,
      gender: "",
      trainingMethod: undefined,
      trainingUnitId: undefined,
    },
  });
  const handleSearch = (values: FormValues) => {
    onSearch?.(values);
  };
  const filterMessage = () => {
    return (
      <>
        <div className="flex-1 overflow-y-auto">
          <div
            className={`flex flex-col lg:flex-row bg-white px-8 py-4 gap-4 lg:gap-8 flex-1`}
          >
            <form
              id="create-mail-config-form"
              className={`w-full flex flex-col gap-4`}
              onSubmit={form.handleSubmit(handleSearch)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="trainingMethod">Hình thức đào tạo:</Label>
                  <Select
                    value={ form.watch("trainingMethod")?.toString() || undefined}
                    onValueChange={(value) =>
                      form.setValue(
                        "trainingMethod",
                        Number(value)
                      )
                    }
                  >
                    <SelectTrigger
                      id="trainingMethod"
                      className={`w-full h-10 ${
                        form.formState.errors.trainingMethod
                          ? "border-red-500"
                          : ""
                      }`}
                      aria-label="Hình thức đào tạo"
                      tabIndex={0}
                    >
                      <SelectValue placeholder="Chọn hình thức đào tạo" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainingMethods.map((option) => (
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
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="trainingUnitId">Địa điểm đào tạo:</Label>
                  <Select
                    value={form.watch("trainingUnitId")?.toString() || ""}
                    onValueChange={(value) => {
                      form.setValue("trainingUnitId", Number(value));
                    }}
                  >
                    <SelectTrigger
                      id="trainingUnitId"
                      className={`w-full h-10 ${
                        form.formState.errors.trainingUnitId ? "border-red-500" : ""
                      }`}
                      aria-label="Địa điểm đào tạo"
                      tabIndex={0}
                    >
                      <SelectValue placeholder="Chọn địa điểm đào tạo" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px] overflow-y-auto">
                      {trainingUnits.map((option) => (
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
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="majorId">Ngành:</Label>
                  <Select
                    value={form.watch("majorId")?.toString() || undefined}
                    onValueChange={(value) => {
                      form.setValue("majorId", Number(value));
                    }}
                  >
                    <SelectTrigger
                      id="majorId"
                      className={`w-full h-10 ${
                        form.formState.errors.majorId ? "border-red-500" : ""
                      }`}
                      aria-label="Ngành"
                      tabIndex={0}
                    >
                      <SelectValue placeholder="Chọn ngành" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px] overflow-y-auto">
                      {majors.map((option) => (
                        <SelectItem
                          key={option.id}
                          className="text-[#A2212B] caret-[#A2212B]"
                          value={option.code}
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="course">Khoá:</Label>
                  <Select
                    value={form.watch("course")?.toString() || undefined}
                    onValueChange={(value) => {
                      form.setValue("course", Number(value));
                    }}
                  >
                    <SelectTrigger
                      id="course"
                      className={`w-full h-10 ${
                        form.formState.errors.course ? "border-red-500" : ""
                      }`}
                      aria-label="Khoá"
                      tabIndex={0}
                    >
                      <SelectValue placeholder="Chọn khoá" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px] overflow-y-auto">
                      {courses.map((option) => (
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
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="genderId">Giới tính:</Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("gender", value as Gender)
                    }
                    value={form.watch("gender") || undefined}
                  >
                    <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                      <SelectValue placeholder="Giới tính" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px] overflow-y-auto">
                      {GENDER_OPTIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      )) || (
                        <SelectItem value="Không có giới tính">
                          Không có giới tính
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </div>
        </div>
        <hr />
      </>
    );
  };
  const handleRefresh = () => {
    form.reset({
      search: "",
      status: "",
      classes: undefined,
      course: undefined,
      majorId: undefined,
      gender: "",
      trainingMethod: undefined,
      trainingUnitId: undefined,
    });
    onRefresh?.();
  };

  const handleFilter = () => {
    setOpenFilterModal(!openFilterModal);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 py-4">
      <div className="flex items-center text-lg font-medium whitespace-nowrap">
        Danh sách sinh viên
        <span className="ml-1 text-red-600 font-normal">({emailCount})</span>
      </div>

      <div className="w-full flex justify-start xl:justify-end flex-wrap gap-4">
        <form
          onSubmit={form.handleSubmit(handleSearch)}
          className="flex flex-col lg:flex-row gap-4 w-full"
        >
          <div className="flex flex-col md:flex-row gap-4 flex-1 justify-end">
            <Input
              {...form.register("search")}
              placeholder="Tìm kiếm"
              className="h-10 w-full lg:max-w-[300px]"
              aria-label="Tìm theo tên"
              value={form.watch("search")}
            />
            <Select
              onValueChange={(value) => form.setValue("classes", Number(value))}
              value={form.watch("classes")?.toString() || undefined}
            >
              <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                <SelectValue placeholder="Lớp sinh viên" />
              </SelectTrigger>
              <SelectContent className="max-h-[280px] overflow-y-auto">
                {classes.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                )) || (
                  <SelectItem value="Không có lớp">Không có lớp</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                form.setValue("status", value as FormValues["status"])
              }
              value={form.watch("status") || undefined}
            >
              <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {STUDENT_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setOpenFilterModal(true)}
              className="h-10 w-10 flex items-start justify-start pt-1 pl-2"
              aria-label="Làm mới"
            >
              <i className="mdi mdi-filter-variant-plus w-5 h-5"></i>
            </Button>
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
              aria-label="Thêm cấu hình email"
            >
              <Plus className="h-5 w-5 text-white" />
            </Button>
          </div>
        </form>
      </div>
      <ConfirmDialog
        title="Bộ lọc"
        message={filterMessage()}
        isOpen={openFilterModal}
        onOpenChange={handleFilter}
        onConfirm={() => handleSearch(form.getValues())}
      />
    </div>
  );
};

export default StudentSearchForm;
