"use client";
import React from "react";
import { useState, useEffect } from "react";
import { trainingTypeService } from "@/services/trainingtypeService";
import { toast } from "sonner";
import {
  TrainingStatus,
  TrainingType,
  TrainingTypeResponse,
} from "@/types/TrainingType";

import TrainingTypeSearchForm from "@/components/TrainingType/TrainingTypeSearchForm";
import TrainingTypeTable from "@/components/TrainingType/TrainingTypeTable";
import ModalCreateTrainingType from "@/components/TrainingType/ModalCreateTrainingType";
import CustomPagination from "@/components/ui/custom-pagination";
import ModalUpdateTrainingType from "@/components/TrainingType/ModalUpdateTrainingType";
type FormValues = {
  search?: string;
  status?: string;
};
const TrainingTypePage = () => {
  const [searchParams, setSearchParams] = useState<FormValues>({
    search: "",
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [trainingType, setTrainingType] = useState<TrainingType[]>([]);
  const [isOpenModalCreateTrainingType, setIsOpenModalCreateTrainingType] = useState(false);
  const [isOpenModalUpdateTrainingType, setIsOpenModalUpdateTrainingType] = useState(false);
  const [selectedTrainingType, setSelectedTrainingType] = useState<TrainingType | null>(null);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response: TrainingTypeResponse =
        await trainingTypeService.getTrainingTypes({
          pageIndex: pageIndex,
          pageSize: pageSize,
          search: searchParams.search,
          status: searchParams.status as TrainingStatus,
        });
      setTotalPages(response.totalPages);
      setTotalRecords(response.totalRecords);
      setTrainingType(response.data);
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
  const handleSearch = (values: FormValues) => {
    setSearchParams(values);
  };
  const onEdit = (trainingType: TrainingType) => {
    setIsOpenModalUpdateTrainingType(true);
    setSelectedTrainingType(trainingType);
  };
  const onDelete = async (trainingType: TrainingType) => {
      try{
          await trainingTypeService.deleteTrainingType(trainingType.id);
          toast.success("Xóa loại hình đào tạo thành công");
          onRefresh();
      }catch(error){
        toast.error("Có lỗi xảy ra khi xóa loại hình đào tạo" + error);
      }
  };
  const onRefresh = () => {
    setPageIndex(1);
    setPageSize(10);
    setSearchParams({
      search: "",
      status: undefined,
    });
  };
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
      <TrainingTypeSearchForm
        trainingCount={totalRecords}
        onSearch={handleSearch}
        onRefresh={onRefresh}
        onAdd={() => setIsOpenModalCreateTrainingType(true)}
        initialValues={searchParams}
      />
      <div className="w-full flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        <TrainingTypeTable
          trainingType={trainingType}
          onRefresh={onRefresh}
          onEdit={onEdit}
          onDelete={onDelete}
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
      <ModalCreateTrainingType
        open={isOpenModalCreateTrainingType}
        onOpenChange={setIsOpenModalCreateTrainingType}
        onRefresh={onRefresh}
      />
      <ModalUpdateTrainingType
        open={isOpenModalUpdateTrainingType}
        onOpenChange={setIsOpenModalUpdateTrainingType}
        onRefresh={onRefresh}
        initialData={selectedTrainingType}
        />
    </div>
  );
};

export default TrainingTypePage;
