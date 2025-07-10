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
  const [searchParams, setSearchParams] = useState<FormValues>({
    search: "",
    fromTime: "",
    toTime: "",
    status: undefined,
  });
  const [exam, setExam] = useState<ExamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
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
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getExam({
        pageIndex: pageIndex, 
        pageSize: pageSize,
        search: searchParams.search,
        status: searchParams.status as ExamStatus,
        fromTime: searchParams.fromTime ? convertDateForSearch(searchParams.fromTime) : undefined,
        toTime: searchParams.toTime ? convertDateForSearch(searchParams.toTime) : undefined,
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
  const onRefresh = () => {
    setPageIndex(1);
    setPageSize(10);
    setSearchParams({
      search: "",
      fromTime: "",
      toTime: "",
      status: undefined,
    });
  };
  const onEdit = (exam: ExamRequest) => {
    setSelectedExam(exam);
    setOpenUpdateModal(true);
  };
  const handleSearch = (values: FormValues) => {
    setSearchParams(values);
  };

  useEffect(() => {
    fetchSemester();
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, searchParams]);

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
        onRefresh={onRefresh}
        onAdd={() => setOpenModalCreateExam(true)}
        initialValues={searchParams}
      />
      <div className="w-full flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        <ListExam
          exam={exam}
          isLoading={isLoading}
          onRefresh={onRefresh}
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
        onRefresh={onRefresh}
        listSemester={listSemester}
      />
      <ModalUpdateExam
        open={openUpdateModal}
        onOpenChange={setOpenUpdateModal}
        onRefresh={onRefresh}
        selectedExam={selectedExam as ExamRequest}
        listSemester={listSemester}
      />
    </div>
  );
};

export default RegisterRetestManager;
