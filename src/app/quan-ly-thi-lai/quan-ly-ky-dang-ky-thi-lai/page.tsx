"use client";
import RetakeSearchForm from "@/components/RetakeExam/RetakeSearchForm";
import ListExam from "@/components/RetakeExam/ListExam";
import { getExam, getListSemester } from "@/services/retakeExamService";
import { ExamRequest, ExamStatus, Semester } from "@/types/Retake";
import CustomPagination from "@/components/ui/custom-pagination";
import { convertDateForSearch } from "@/lib/ConvertDate";
import React, { useEffect, useState } from "react";
import ModalCreateExam from "@/components/RetakeExam/ModalCreateExam";
import ModalUpdateExam from "@/components/RetakeExam/ModalUpdateExam";
import { toast } from "sonner";
type FormValues = {
  search?: string;
  fromTime?: string;
  toTime?: string;
  status?: string;
};
const RegisterRetestManager = () => {
  const [exam, setExam] = useState<ExamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ExamStatus | undefined>(undefined);
  const [fromTime, setFromTime] = useState<string | undefined>(undefined);
  const [toTime, setToTime] = useState<string | undefined>(undefined);
  const [openModalCreateExam, setOpenModalCreateExam] = useState(false);
  const [listSemester, setListSemester] = useState<Semester[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamRequest | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const fetchSemester = async () => {
    try {
      const response = await getListSemester();
      setListSemester(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tải danh sách học kỳ";
      toast.error(errorMessage);
    }
  };
  const fetchExam = async () => {
    try {
      setIsLoading(true);
      const response = await getExam({
        pageIndex: pageIndex,
        pageSize: pageSize,
        search: search,
        status: status,
        fromTime: fromTime,
        toTime: toTime,
      });
      setExam(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tải danh sách sinh viên";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const refresh = async () => {
    setPageIndex(1);
    setPageSize(50);
    setFromTime(undefined);
    setToTime(undefined);
    setSearch("");
    setStatus(undefined);
    await fetchExam();
  };
  const onEdit = (exam: ExamRequest) => {
    setSelectedExam(exam);
    setOpenUpdateModal(true);
  };
  const handleSearch = (values: FormValues) => {
    const searchPayload = Object.entries(values).reduce((acc, [key, value]) => {
      if (value && value !== "") {
        acc[key as keyof FormValues] = value;
      }
      return acc;
    }, {} as FormValues);
  
    setPageIndex(1);
    setSearch(searchPayload.search || "");
    setStatus(searchPayload.status as ExamStatus);
    setFromTime(convertDateForSearch(searchPayload.fromTime || ""));
    setToTime(convertDateForSearch(searchPayload.toTime || ""));
  };

  useEffect(() => {
    fetchSemester();
  }, []);
  
  useEffect(() => {
    fetchExam();
  }, [pageIndex, pageSize, search, status, fromTime, toTime]);

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

  return (
    <div className="p-3 flex flex-col gap-3">
      <RetakeSearchForm
        userCount={totalRecords || 0}
        onSearch={handleSearch}
        onRefresh={refresh}
        onAdd={() => setOpenModalCreateExam(true)}
      />
      <div className="w-full flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        <ListExam
          exam={exam}
          isLoading={isLoading}
          onRefresh={refresh}
          onEdit={onEdit}
        />
        <CustomPagination
          setTotalPages={setTotalPages}
          currentPage={pageIndex}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={(page) => setPageIndex(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />
      </div>
      <ModalCreateExam
        open={openModalCreateExam}
        onOpenChange={setOpenModalCreateExam}
        onRefresh={refresh}
        listSemester={listSemester}
      />
      <ModalUpdateExam
        open={openUpdateModal}
        onOpenChange={setOpenUpdateModal}
        onRefresh={refresh}
        selectedExam={selectedExam as ExamRequest}
        listSemester={listSemester}
      />
    </div>
  );
};

export default RegisterRetestManager;
