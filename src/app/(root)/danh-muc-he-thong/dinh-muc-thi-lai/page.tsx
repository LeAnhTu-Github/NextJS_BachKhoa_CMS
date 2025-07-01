"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { createDecision, getDecision, getSemesters, updateDecision } from "@/services/decisionService";
import { CreateDecisionRequest, Decision, DecisionSearchParams, DecisionStatus, Semester } from "@/types/Decision";
import DecisionSearchForm, { FormValues } from "@/components/Decision/DecisionSearchForm";
import DecisionTable from "@/components/Decision/DecisionTable";
import CustomPagination from "@/components/ui/custom-pagination";
import ModalDetailDecision from "@/components/Decision/ModalDetailDecision";
import ModalCreateDecision from "@/components/Decision/ModalCreateDecision";
import ModalUpdateDecision from "@/components/Decision/ModalUpdateDecision";
import { toast } from "sonner";

const DecisionPage = () => {
  const [searchParams, setSearchParams] = useState<DecisionSearchParams>({
    name: "",
    semesterId: undefined,
    status: undefined,
  });
  const [data, setData] = useState<Decision[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const fetchSemesters = async () => {
   try {
    const response = await getSemesters();
    setSemesters(response.data);
   } catch (error) {
    console.log(error);
   }
  };
  const fetchData = async () => {
    setIsLoading(true);
    const response = await getDecision({
      pageIndex: pageIndex,
      pageSize: pageSize,
      name: searchParams.name,
      semesterId: searchParams.semesterId,
      status: searchParams.status,
    });
    setData(response.data);
    setTotalPages(response.totalPages);
    setTotalRecords(response.totalRecords);
    setIsLoading(false);
  };
  const onRefresh = () => {
    setPageIndex(1);
    setPageSize(10);
    setSearchParams({
      name: "",
      semesterId: undefined,
      status: undefined,
    });
  };
  useEffect(() => {
    fetchSemesters();
  }, []);
  useEffect(() => {
    fetchData();
  }, [searchParams, pageIndex, pageSize]);

  const handleSearch = (values: FormValues) => {
    setSearchParams({
      name: values.search || "",
      semesterId: values.semesterId || undefined,
      status: values.status as DecisionStatus | undefined,
    });
  };

  const handleDetail = (decision: Decision) => {
    setSelectedDecision(decision);
    setIsOpenDetail(true);
  };
  const handleEdit = (decision: Decision) => {
    setSelectedDecision(decision);
    setIsOpenUpdate(true);
  };
  const handleAdd = () => {
    setIsOpenCreate(true);
  };
  const handleSubmit = async (data: CreateDecisionRequest) => {
    try {
      setIsLoadingCreate(true);
      await createDecision(data);
      toast.success("Tạo định mức thành công");
      setIsOpenCreate(false);
      fetchData();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo định mức" + error);
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleUpdate = async (data: CreateDecisionRequest) => {
    try {
      setIsLoadingUpdate(true);
      await updateDecision(selectedDecision!.id, data);
      toast.success("Cập nhật định mức thành công");
      setIsOpenUpdate(false);
      fetchData();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật định mức" + error);
    } finally {
      setIsLoadingUpdate(false);
    }
  };
  return (
    <div className="p-3 flex flex-col gap-3">   
      <DecisionSearchForm
        userCount={totalRecords}
        semesters={semesters}
        onSearch={handleSearch}
        onRefresh={onRefresh}
        onAdd={handleAdd}
      />
      <div className="w-full flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        <DecisionTable
          decision={data}
          isLoading={isLoading}
          onRefresh={onRefresh}
          onDetail={handleDetail}
          onEdit={handleEdit}
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
      {
        selectedDecision && (
          <ModalDetailDecision
            isOpen={isOpenDetail}
            onClose={() => setIsOpenDetail(false)}
            decision={selectedDecision as Decision}
          />
        )
      }
      <ModalCreateDecision
        onSubmit={handleSubmit}
        semesters={semesters}
        isOpen={isOpenCreate}
        onOpenChange={setIsOpenCreate}
        isLoading={isLoadingCreate}
      />
      <ModalUpdateDecision
        onSubmit={handleUpdate}
        semesters={semesters}
        isOpen={isOpenUpdate}
        onOpenChange={setIsOpenUpdate}
        isLoading={isLoadingUpdate}
        decision={selectedDecision as Decision}
      />
    </div>
  );
};

export default DecisionPage;
