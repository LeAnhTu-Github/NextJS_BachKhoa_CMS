"use client";
import {
  getClasses,
  getExams,
  getListRegister,
  sendMailFee,
  sendMailRefused,
} from "@/services/RegisterStudentService";
import {
  RegisterStudentExam,
  Clazz,
  Exam,
  SendMailStatus,
  FeePaidStatus,
} from "@/types/RegisterStudentExam";
import ModalCreateRegister from "@/components/RegisterStudent/ModalCreateRegister";
import RegisterStudentSearchForm, {
  FormValues,
} from "@/components/RegisterStudent/RegisterStudentSearchForm";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import RegisterStudentTable from "@/components/RegisterStudent/TableRegisterStudent";
import CustomPagination from "@/components/ui/custom-pagination";
import ModalDetailRegister from "@/components/RegisterStudent/ModalDetailRegister";

const RegisterStudentPage = () => {
  const [searchParams, setSearchParams] = useState<FormValues>({
    clazzId: undefined,
    examId: undefined,
    feePaidStatus: undefined,
    sendMailStatus: undefined,
  });
  const [data, setData] = useState<RegisterStudentExam[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [registerStudent, setRegisterStudent] =
    useState<RegisterStudentExam | null>(null);
  const [classes, setClasses] = useState<Clazz[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const response = await getClasses();
      setClasses(response);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách lớp" + error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const response = await getExams();
      setExams(response);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách đợt thi" + error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchListRegister = async () => {
    setIsLoading(true);
    try {
      const response = await getListRegister(
        {
          ...searchParams,
          feePaidStatus: searchParams.feePaidStatus as FeePaidStatus,
          sendMailStatus: searchParams.sendMailStatus as SendMailStatus,
        },
        pageIndex,
        pageSize
      );
      setData(response.data);
      setTotalPages(response.totalPages);
      setTotalRecords(response.totalRecords);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách sinh viên đăng ký" + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (values: FormValues) => {
    setSearchParams(values);
  };
  const onRefresh = () => {
    setSearchParams({
      clazzId: undefined,
      examId: undefined,
      feePaidStatus: undefined,
      sendMailStatus: undefined,
    });
  };
  const handleAdd = () => {
    setIsOpen(true);
  };
  useEffect(() => {
    fetchClasses();
    fetchExams();
  }, []);
  useEffect(() => {
    fetchListRegister();
  }, [searchParams, pageIndex, pageSize]);

  const handleSendMailFee = async () => {
    try {
      const response = await sendMailFee();
      toast.success("Gửi email thành công");
    } catch (error) {
      toast.error("Lỗi khi gửi email" + error);
    }
  };
  const handleSendMailRefused = async () => {
    try {
      const response = await sendMailRefused();
      toast.success("Gửi email thành công");
    } catch (error) {
      toast.error("Lỗi khi gửi email" + error);
    }
  };
  const handleDetail = (registerStudent: RegisterStudentExam) => {
    setRegisterStudent(registerStudent);
    setIsOpenDetail(true);
  };
  const handleEdit = (registerStudent: RegisterStudentExam) => {
    console.log("handleEdit", registerStudent);
  };
  const handleSubmit = (data: RegisterStudentExam) => {
    console.log("handleSubmit", data);
  };
  return (
    <>
      <div className="p-3 flex flex-col gap-3">
        <RegisterStudentSearchForm
          userCount={totalRecords}
          classes={classes}
          exams={exams}
          onSearch={handleSearch}
          onRefresh={onRefresh}
          onAdd={handleAdd}
          initialValues={searchParams}
          onSendMailFee={handleSendMailFee}
          onSendMailRefused={handleSendMailRefused}
        />
        <div className="w-full flex flex-col gap-3 max-h-[calc(100vh-250px)] overflow-y-auto">
          <RegisterStudentTable
            registerStudent={data}
            isLoading={isLoading}
            onRefresh={onRefresh}
            onDetail={handleDetail}
            onEdit={handleEdit}
          />
        </div>
        <CustomPagination
          setTotalPages={setTotalPages}
          currentPage={pageIndex}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={(page) => setPageIndex(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />
      </div>
      <ModalCreateRegister
        isOpen={isOpen}
        onSubmit={handleSubmit}
        onOpenChange={setIsOpen}
        isLoading={isLoading}
      />
      {registerStudent && (
        <ModalDetailRegister
          isOpen={isOpenDetail}
          onClose={() => setIsOpenDetail(false)}
          registerStudent={registerStudent as RegisterStudentExam}
        />
      )}
    </>
  );
};

export default RegisterStudentPage;
