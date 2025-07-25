import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmDialog from "../ui/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GenderType,
  StudentStatus,
  GENDER_OPTIONS,
  STUDENT_STATUS_OPTIONS,
  StudentFormData,
  DegreeType,
  DEGREE_TYPE_OPTIONS,
} from "@/types/Student";
import { useStudentDataContext } from "@/app/(root)/quan-ly-sinh-vien/StudentDataContext";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  fullName: z.string().min(1, "Họ tên là bắt buộc"),
  code: z.string().min(1, "Mã số sinh viên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  status: z.nativeEnum(StudentStatus),
  trainingUnitId: z.number({ required_error: "Địa điểm đào tạo là bắt buộc" }),
  majorId: z.number().min(1, "Ngành là bắt buộc"),
  degreeType: z.nativeEnum(DegreeType),
  courseId: z.number().min(1, "Khóa học là bắt buộc"),
  classId: z.number().min(1, "Lớp là bắt buộc"),
  phone: z.string().optional(),
  gender: z.nativeEnum(GenderType).optional(),
  birthday: z.string().optional(),
  address: z.string().optional(),
  birthplace: z.string().optional(),
  homeTown: z.string().optional(),
  citizen: z.string().optional(),
  ethnicity: z.string().optional(),
  emailOther: z
    .string()
    .email("Email cá nhân không hợp lệ")
    .optional()
    .or(z.literal("")),
  trainingMethodId: z.number().optional(),
  trainingTypeId: z.number().optional(),
  startOfTraining: z.string().optional(),
  expiryDate: z.string().optional(),
});

interface ModalCreateStudentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StudentFormData) => void;
  isLoading?: boolean;
}

const ModalCreateStudent = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: ModalCreateStudentProps) => {
  const {
    classes,
    majors,
    courses,
    trainingUnits,
    trainingMethods,
    trainingTypes,
  } = useStudentDataContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      code: "",
      email: "",
      phone: "",
      gender: GenderType.MALE,
      birthday: "",
      address: "",
      birthplace: "",
      homeTown: "",
      citizen: "",
      ethnicity: "",
      emailOther: "",
      classId: undefined,
      courseId: undefined,
      majorId: undefined,
      trainingMethodId: undefined,
      trainingUnitId: undefined,
      trainingTypeId: undefined,
      status: StudentStatus.STUDYING,
      startOfTraining: "",
      expiryDate: "",
      degreeType: DegreeType.BACHELOR,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values as StudentFormData);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  }; 

  const createStudentForm = () => {
    return (
      <>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col bg-white px-8 py-4 gap-4 flex-1">
            <form
              id="create-student-form"
              className="w-full flex flex-col gap-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {/* Thông tin cá nhân */}
              <div className="w-full">
                <div className="w-full h-12 flex mb-4">
                  <div className="border-l-[5px] border-[#A2212B] h-6 flex items-center justify-center">
                    <p className="text-lg font-semibold text-black pl-2">
                      Thông tin cá nhân
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="code">
                      Mã số sinh viên: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...form.register("code")}
                      id="code"
                      maxWidthClass="max-w-[100%]"
                      placeholder="Nhập mã số sinh viên"
                      value={form.watch("code")}
                      className={`h-10 ${
                        form.formState.errors.code ? "border-red-500" : ""
                      }`}
                      aria-label="Mã số sinh viên"
                      tabIndex={0}
                    />
                    {form.formState.errors.code && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.code.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="fullName">
                      Họ tên: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...form.register("fullName")}
                      id="fullName"
                      maxWidthClass="max-w-[100%]"
                      placeholder="Nhập họ tên"
                      value={form.watch("fullName")}
                      className={`h-10 ${
                        form.formState.errors.fullName ? "border-red-500" : ""
                      }`}
                      aria-label="Họ tên"
                      tabIndex={0}
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="email">
                      Email trường: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...form.register("email")}
                      id="email"
                      type="email"
                      maxWidthClass="max-w-[100%]"
                      placeholder="Nhập email trường"
                      value={form.watch("email")}
                      className={`h-10 ${
                        form.formState.errors.email ? "border-red-500" : ""
                      }`}
                      aria-label="Email trường"
                      tabIndex={0}
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="emailOther">Email cá nhân:</Label>
                    <Input
                      {...form.register("emailOther")}
                      id="emailOther"
                      type="email"
                      maxWidthClass="max-w-[100%]"
                      placeholder="Nhập email cá nhân"
                      value={form.watch("emailOther")}
                      className={`h-10 ${
                        form.formState.errors.emailOther ? "border-red-500" : ""
                      }`}
                      aria-label="Email cá nhân"
                      tabIndex={0}
                    />
                    {form.formState.errors.emailOther && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.emailOther.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="citizen">
                      CMND/CCCD:
                    </Label>
                    <Input
                      {...form.register("citizen")}
                      id="citizen"
                      maxWidthClass="max-w-[100%]"
                      placeholder="Nhập CMND/CCCD"
                      value={form.watch("citizen")}
                      className={`h-10 ${
                        form.formState.errors.citizen ? "border-red-500" : ""
                      }`}
                      aria-label="CMND/CCCD"
                      tabIndex={0}
                    />
                    {form.formState.errors.citizen && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.citizen.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="birthday">
                      Ngày sinh:
                    </Label>
                    <Input
                      {...form.register("birthday")}
                      id="birthday"
                      maxWidthClass="max-w-[100%]"
                      type="date"
                      value={form.watch("birthday")}
                      className={`h-10 ${
                        form.formState.errors.birthday ? "border-red-500" : ""
                      }`}
                      aria-label="Ngày sinh"
                      tabIndex={0}
                    />
                    {form.formState.errors.birthday && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.birthday.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="gender">
                      Giới tính:
                    </Label>
                    <Select
                      value={form.watch("gender")}
                      onValueChange={(value) =>
                        form.setValue("gender", value as GenderType)
                      }
                    >
                      <SelectTrigger
                        id="gender"
                        className={`h-10 w-full ${
                          form.formState.errors.gender ? "border-red-500" : ""
                        }`}
                        aria-label="Giới tính"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-[#A2212B] caret-[#A2212B]"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.gender && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="phone">
                      Số điện thoại:
                    </Label>
                    <Input
                      {...form.register("phone")}
                      id="phone"
                      maxWidthClass="max-w-[100%]"
                      placeholder="Nhập số điện thoại"
                      value={form.watch("phone")}
                      className={`h-10 ${
                        form.formState.errors.phone ? "border-red-500" : ""
                      }`}
                      aria-label="Số điện thoại"
                      tabIndex={0}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="status">
                      Trạng thái: <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.watch("status")}
                      onValueChange={(value) =>
                        form.setValue("status", value as StudentStatus)
                      }
                    >
                      <SelectTrigger
                        id="status"
                        className={`h-10 w-full ${
                          form.formState.errors.status ? "border-red-500" : ""
                        }`}
                        aria-label="Trạng thái"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {STUDENT_STATUS_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-[#A2212B] caret-[#A2212B]"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.status && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.status.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="ethnicity">
                      Dân tộc:
                    </Label>
                    <Input
                      {...form.register("ethnicity")}
                      id="ethnicity"
                      maxWidthClass="max-w-[100%]"
                      placeholder="Nhập dân tộc"
                      value={form.watch("ethnicity")}
                      className={`h-10 ${
                        form.formState.errors.ethnicity ? "border-red-500" : ""
                      }`}
                      aria-label="Dân tộc"
                      tabIndex={0}
                    />
                    {form.formState.errors.ethnicity && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.ethnicity.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 lg:col-span-2">
                    <Label htmlFor="birthplace">
                      Nơi sinh:
                    </Label>
                    <Input
                      {...form.register("birthplace")}
                      id="birthplace"
                      maxWidthClass="max-w-[100%]"
                      placeholder="Nhập nơi sinh"
                      value={form.watch("birthplace")}
                      className={`h-10 ${
                        form.formState.errors.birthplace ? "border-red-500" : ""
                      }`}
                      aria-label="Nơi sinh"
                      tabIndex={0}
                    />
                    {form.formState.errors.birthplace && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.birthplace.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="address">
                      Địa chỉ liên hệ:
                    </Label>
                    <Textarea
                      {...form.register("address")}
                      id="address"
                      placeholder="Nhập địa chỉ liên hệ"
                      value={form.watch("address")}
                      className={`h-20 w-full ${
                        form.formState.errors.address ? "border-red-500" : ""
                      }`}
                      aria-label="Địa chỉ liên hệ"
                      tabIndex={0}
                    />
                    {form.formState.errors.address && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="homeTown">
                      Trú quán:
                    </Label>
                    <Textarea
                      {...form.register("homeTown")}
                      id="homeTown"
                      placeholder="Nhập trú quán"
                      value={form.watch("homeTown")}
                    className={`h-20 w-full ${
                        form.formState.errors.homeTown ? "border-red-500" : ""
                      }`}
                      aria-label="Trú quán"
                      tabIndex={0}
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* Thông tin đào tạo */}
              <div className="w-full">
                <div className="w-full h-12 flex mb-4">
                  <div className="border-l-[5px] border-[#A2212B] h-6 flex items-center justify-center">
                    <p className="text-lg font-semibold text-black pl-2">
                      Thông tin đào tạo
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="trainingUnitId">
                      Địa điểm đào tạo: <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.watch("trainingUnitId")?.toString() || ""}
                      onValueChange={(value) => {
                        form.setValue("trainingUnitId", Number(value));
                      }}
                    >
                      <SelectTrigger
                        id="trainingUnitId"
                        className={`h-10 w-full ${
                          form.formState.errors.trainingUnitId
                            ? "border-red-500"
                            : ""
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
                    {form.formState.errors.trainingUnitId && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.trainingUnitId.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="majorId">
                      Ngành: <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.watch("majorId")?.toString() || ""}
                      onValueChange={(value) => {
                        form.setValue("majorId", Number(value));
                      }}
                    >
                      <SelectTrigger
                        id="majorId"
                        className={`h-10 w-full ${
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
                            value={option.id.toString()}
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.majorId && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.majorId.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="courseId">
                      Khóa học: <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.watch("courseId")?.toString() || ""}
                      onValueChange={(value) => {
                        form.setValue("courseId", Number(value));
                      }}
                    >
                      <SelectTrigger
                        id="courseId"
                        className={`h-10 w-full ${
                          form.formState.errors.courseId ? "border-red-500" : ""
                        }`}
                        aria-label="Khóa học"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn khóa học" />
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
                    {form.formState.errors.courseId && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.courseId.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="classId">
                      Lớp: <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.watch("classId")?.toString() || ""}
                      onValueChange={(value) => {
                        form.setValue("classId", Number(value));
                      }}
                    >
                      <SelectTrigger
                        id="classId"
                        className={`h-10 w-full ${
                          form.formState.errors.classId ? "border-red-500" : ""
                        }`}
                        aria-label="Lớp"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn lớp" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[280px] overflow-y-auto">
                        {classes.map((option) => (
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
                    {form.formState.errors.classId && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.classId.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="trainingMethodId">
                      Hình thức đào tạo:
                    </Label>
                    <Select
                      value={form.watch("trainingMethodId")?.toString() || ""}
                      onValueChange={(value) => {
                        form.setValue("trainingMethodId", Number(value));
                      }}
                    >
                      <SelectTrigger
                        id="trainingMethodId"
                        className={`h-10 w-full ${
                          form.formState.errors.trainingMethodId
                            ? "border-red-500"
                            : ""
                        }`}
                        aria-label="Hình thức đào tạo"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn hình thức đào tạo" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[280px] overflow-y-auto">
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
                    {form.formState.errors.trainingMethodId && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.trainingMethodId.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="trainingTypeId">
                      Loại đào tạo:
                    </Label>
                    <Select
                      value={form.watch("trainingTypeId")?.toString() || ""}
                      onValueChange={(value) => {
                        form.setValue("trainingTypeId", Number(value));
                      }}
                    >
                      <SelectTrigger
                        id="trainingTypeId"
                        className={`h-10 w-full ${
                          form.formState.errors.trainingTypeId
                            ? "border-red-500"
                            : ""
                        }`}
                        aria-label="Loại đào tạo"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn loại đào tạo" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[280px] overflow-y-auto">
                        {trainingTypes.map((option) => (
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
                    {form.formState.errors.trainingTypeId && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.trainingTypeId.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="degreeType">
                      Bằng cấp: <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.watch("degreeType")?.toString() || ""}
                      onValueChange={(value) => {
                        form.setValue("degreeType", value as DegreeType);
                      }}
                    >
                      <SelectTrigger
                        id="degreeType"
                        className={`h-10 w-full ${
                          form.formState.errors.degreeType
                            ? "border-red-500"
                            : ""
                        }`}
                        aria-label="Bằng cấp"
                        tabIndex={0}
                      >
                        <SelectValue placeholder="Chọn bằng cấp" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[280px] overflow-y-auto">
                        {DEGREE_TYPE_OPTIONS.map((option) => (
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
                    {form.formState.errors.degreeType && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.degreeType.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="startOfTraining">
                      Thời gian bắt đầu đào tạo:{" "}
                    </Label>
                    <Input
                      {...form.register("startOfTraining")}
                      id="startOfTraining"
                      maxWidthClass="max-w-[100%]"
                      type="date"
                      value={form.watch("startOfTraining")}
                      className={`h-10 ${
                        form.formState.errors.startOfTraining
                          ? "border-red-500"
                          : ""
                      }`}
                      aria-label="Thời gian bắt đầu đào tạo"
                      tabIndex={0}
                    />
                    {form.formState.errors.startOfTraining && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.startOfTraining.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="expiryDate">Thời gian kết thúc:</Label>
                    <Input
                      {...form.register("expiryDate")}
                      id="expiryDate"
                      maxWidthClass="max-w-[100%]"
                      type="date"
                      value={form.watch("expiryDate")}
                      className={`h-10 ${
                        form.formState.errors.expiryDate ? "border-red-500" : ""
                      }`}
                      aria-label="Thời gian kết thúc"
                      tabIndex={0}
                    />
                    {form.formState.errors.expiryDate && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.expiryDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <hr />
      </>
    );
  };

  return (
    <ConfirmDialog
      title="Thêm sinh viên mới"
      message={createStudentForm()}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onConfirm={form.handleSubmit(handleSubmit)}
      onCancel={handleCancel}
      isLoading={isLoading}
      large={true}
    />
  );
};

export default ModalCreateStudent;
