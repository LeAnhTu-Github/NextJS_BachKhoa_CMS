import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  getByStudent,
  getStudentList,
  getStudentListByRegister,
} from "@/services/RegisterStudentService";
import { Student, Term, TermHistory } from "@/types/Student";
import { GetByStudent, RegisterStudentExam } from "@/types/RegisterStudentExam";
import CourseListTable from "./CourseListTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ConfirmDialog from "../ui/confirm-dialog";
import CustomStep from "../ui/steps-custom";
import { getTerms } from "@/services/studentService";

export const formSchema = z.object({
  examId: z.number().min(1, "Kỳ thi là bắt buộc"),
  termId: z.number().min(1, "Học kỳ là bắt buộc"),
  clazzId: z.number().min(1, "Lớp là bắt buộc"),
});

type FormValues = z.infer<typeof formSchema>;

interface ModalCreateRegisterProps {
  isOpen: boolean;
  onSubmit: (data: RegisterStudentExam) => void;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

const ModalCreateRegister = ({
  isOpen,
  onSubmit,
  onOpenChange,
  isLoading,
}: ModalCreateRegisterProps) => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [step, setStep] = useState(0);
  const [byStudent, setByStudent] = useState<GetByStudent[]>([]);
  const [studentListbyId, setStudentListbyId] = useState<Student[]>([]);
  const [term, setTerm] = useState<TermHistory[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examId: 0,
      termId: 0,
      clazzId: 0,
    },
  });

  const fetchListStudent = async () => {
    try {
      const res = await getStudentList();
      setStudentList(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchListStudentByRegister = async () => {
    try {
      const res = await getStudentListByRegister(selectedStudent?.id || 0);
      setStudentListbyId(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchByStudent = async () => {
    try {
      const res = await getByStudent(selectedStudent?.id || 0);
      setByStudent(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTerm = async () => {
    try {
      const res = await getTerms();
      setTerm(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchListStudent();
      setStep(0);
      setSelectedStudent(null);
      form.reset();
    }
  }, [isOpen]);
  useEffect(() => {
    if (step === 1 && selectedStudent) {
      fetchListStudentByRegister();
      fetchByStudent();
      fetchTerm();
    }
  }, [step, selectedStudent]);

  const handleSelectStudent = (studentCode: string) => {
    const student = studentList.find((s) => s.code === studentCode) || null;
    setSelectedStudent(student);
  };

  const handleFormSubmit = (data: FormValues) => {
    if (!selectedStudent) return;
    onSubmit({
      code: selectedStudent.code,
      fullName: selectedStudent.fullName,
      clazzId: data.clazzId,
      examId: data.examId,
      termId: data.termId,
    } as any);
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const step1Content = (
    <div className="flex flex-col items-center justify-end w-full min-h-[150px]">
      <h2 className="text-sm font-normal text-redberry mb-6 text-center">
        Nhập Mã Số Sinh Viên
      </h2>
      <div className="w-full max-w-2xl">
        <Select
          value={selectedStudent?.code || ""}
          onValueChange={handleSelectStudent}
          aria-label="Chọn sinh viên"
        >
          <SelectTrigger
            className="w-full h-16 text-lg border-gray-300 focus:ring-2 focus:ring-[#991B1B]"
            tabIndex={0}
            aria-label="Sinh viên"
          >
            <SelectValue placeholder="Sinh viên" />
          </SelectTrigger>
          <SelectContent>
            {studentList.map((student) => (
              <SelectItem
                key={student.code}
                value={student.code}
                className="text-base"
              >
                {student.fullName} ({student.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedStudent && (
        <div className="w-full px-6 pt-6 bg-white">
          <div className="mb-4">
            <div className="flex gap-2 ">
              <div className="border-l-[4px] border-redberry"></div>
              <span className="text-xl font-bold flex items-center">
                Thông tin cá nhân
              </span>
            </div>
            <div className="flex flex-col gap-2 text-base mt-2">
              <div>
                <span className="font-medium">Họ tên:</span>{" "}
                <span className="text-[#991B1B]">
                  {selectedStudent.fullName}
                </span>
              </div>
              <div>
                <span className="font-medium">Email trường:</span>{" "}
                <span className="text-[#991B1B]">{selectedStudent.email}</span>
              </div>
              <div>
                <span className="font-medium">Khóa:</span>{" "}
                <span className="text-[#991B1B]">
                  {selectedStudent.courseName || selectedStudent.course?.name}
                </span>
              </div>
              <div>
                <span className="font-medium">Lớp:</span>{" "}
                <span className="text-[#991B1B]">
                  {selectedStudent.className || selectedStudent.classes?.name}
                </span>
              </div>
              <div>
                <span className="font-medium">Ngành:</span>{" "}
                <span className="text-[#991B1B]">
                  {selectedStudent.majorName || selectedStudent.major?.name}
                </span>
              </div>
              <div>
                <span className="font-medium">Loại hình đào tạo:</span>{" "}
                <span className="text-[#991B1B]">
                  {selectedStudent.trainingTypeName ||
                    selectedStudent.trainingType?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  const step2Content = (
    <form
      className="flex flex-col gap-6 w-full"
      onSubmit={form.handleSubmit(handleFormSubmit)}
      aria-label="Thông tin đăng ký"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Controller
          name="termId"
          control={form.control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={(v) => field.onChange(Number(v))}
              aria-label="Đợt bảo vệ lại"
            >
              <SelectTrigger
                className="w-full"
                tabIndex={0}
                aria-label="Đợt bảo vệ lại"
              >
                <SelectValue placeholder="Đợt bảo vệ lại" />
              </SelectTrigger>
              <SelectContent>
                {byStudent.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          name="clazzId"
          control={form.control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={(v) => field.onChange(Number(v))}
              aria-label="Học phần"
            >
              <SelectTrigger
                className="w-full"
                tabIndex={0}
                aria-label="Học phần"
              >
                <SelectValue placeholder="Học phần" />
              </SelectTrigger>
              <SelectContent>
                {term.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="w-full">
        <div className="font-normal text-sm mb-2">
          Danh sách học phần <span className="text-[#991B1B]">(0)</span>
        </div>
        <CourseListTable
          courses={[]}
          selectedIds={[]}
          onSelect={() => {}}
          onSelectAll={() => {}}
        />
        <div className="flex justify-end mt-4">
          <span className="font-normal text-sm">
            Tổng tiền: <span className="text-[#991B1B]">{0} VNĐ</span>
          </span>
        </div>
      </div>
    </form>
  );
  const steps = [
    {
      title: "Thông tin cá nhân",
      content: step1Content,
    },
    {
      title: "Thông tin đăng ký",
      content: step2Content,
    },
  ];

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Đăng ký thi lại"
      large={true}
      message={
        <CustomStep
          onNext={handleNext}
          onBack={handleBack}
          steps={steps}
          isSelect={!!selectedStudent}
          currentStep={step}
          setCurrentStep={setStep}
          hideNavButtons={false}
          onFinish={() => form.handleSubmit(handleFormSubmit)()}
        />
      }
      onConfirm={() => form.handleSubmit(handleFormSubmit)()}
      onCancel={() => onOpenChange(false)}
      isLoading={isLoading}
    />
  );
};

export default ModalCreateRegister;
