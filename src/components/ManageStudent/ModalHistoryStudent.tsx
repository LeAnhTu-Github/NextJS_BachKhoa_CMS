import React, { useEffect, useState } from "react";
import ConfirmDialog from "../ui/confirm-dialog";
import { getHistoryStudent, getTerms } from "@/services/studentService";
import { EXAM_TYPE_OPTIONS, ExamType, StudentPaginationResponse, TermHistory } from "@/types/Student";
import CustomPagination from "../ui/custom-pagination";
import { Student } from "@/types/Student";
import ListHistory from "./ListHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { RefreshCw, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ModalHistoryStudentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
}

const formSchema = z.object({
  termId: z.number().optional(),
  examType: z.string().optional(),
});

const ModalHistoryStudent = ({
  isOpen,
  onOpenChange,
  student,
}: ModalHistoryStudentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState<TermHistory[]>([]);
  const [historyStudent, setHistoryStudent] = useState<StudentPaginationResponse>({
    beginIndex: 0,
    data: [],
    endIndex: 0,
    pageIndex: 0,
    pageSize: 0,
    totalPages: 0,
    totalRecords: 0,
  });
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      termId: undefined,
      examType: "",
    },
  });
  const fetchHistoryStudent = async () => {
    try {
      setIsLoading(true);
        const response = await getHistoryStudent({
        studentId: student.id,
        pageIndex: pageIndex,
        pageSize: pageSize,
        termId: form.getValues().termId || 0,
        examType: form.getValues().examType as ExamType,
      });   
      setHistoryStudent(response);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTerms = async () => {
    try {
      setIsLoading(true);
      const response = await getTerms();
      setTerms(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTerms();
    fetchHistoryStudent();
  }, []);
  const handleSearch = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    console.log(historyStudent.data);
    setPageIndex(1);
    setPageSize(50);
    fetchHistoryStudent();
  };
  const handleRefresh = () => {
    fetchTerms();
    fetchHistoryStudent();
  };
  const messageHistory = () => {
    return (
      <div className="flex flex-col gap-2 w-full ">
        <div className="flex justify-end gap-2 w-full">
          <form
            onSubmit={form.handleSubmit(handleSearch)}
            className="flex flex-col lg:flex-row gap-4 w-full"
          >
            <div className="flex flex-col md:flex-row gap-4 flex-1 justify-end">
              <Select
                value={form.watch("termId")?.toString() || ""}
                onValueChange={(value) => {
                  form.setValue("termId", Number(value));
                }}
              >
                <SelectTrigger
                  id="termId"
                  className={`h-10 w-full lg:max-w-[300px] ${
                    form.formState.errors.termId ? "border-red-500" : ""
                  }`}
                  aria-label="Học kỳ"
                  tabIndex={0}
                >
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px] overflow-y-auto">
                  {terms.map((option) => (
                    <SelectItem
                      key={option.id}
                      className="text-[#A2212B] caret-[#A2212B]"
                      value={option.id.toString()}
                      onClick={() => form.setValue("termId", option.id)}
                    >
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => form.setValue("examType", value)}
                value={form.watch("examType") || undefined}
              >
                <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_TYPE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      onClick={() => form.setValue("examType", option.value)}
                    >
                      {option.label}
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
            </div>
          </form>
        </div>
        <div>
            <ListHistory
                historyStudent={[]}
            />
          <CustomPagination
            currentPage={pageIndex}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={(page) => setPageIndex(page)}
            onPageSizeChange={(size) => setPageSize(size)}
            setTotalPages={setTotalPages}
          />
        </div>
      </div>
    );
  };
  return (
    <ConfirmDialog
      title="Lịch sử dữ liệu sinh viên"
      message={messageHistory()}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onConfirm={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
      isLoading={isLoading}
      large={true}
    />
  );
};

export default ModalHistoryStudent;
