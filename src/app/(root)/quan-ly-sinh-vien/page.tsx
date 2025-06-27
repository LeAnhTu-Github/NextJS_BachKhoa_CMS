"use client";
import React, { useEffect, useState } from "react";
import StudentSearchForm from "@/components/ManageStudent/StudentSearchForm";
import { Student, StudentFormData, StudentQueryParams } from "@/types/Student";
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
  deleteStudents,
} from "@/services/studentService";
import ListStudent from "@/components/ManageStudent/ListStudent";
import CustomPagination from "@/components/ui/custom-pagination";
import { toast } from "sonner";
import { StudentDataProvider } from "./StudentDataContext";
import { FormValues } from "@/components/ManageStudent/StudentSearchForm";
import { AxiosError } from "axios";
import ModalCreateStudent from "@/components/ManageStudent/ModalCreateStudent";
import ModalUpdateStudent from "@/components/ManageStudent/ModalUpdateStudent";
import ModalHistoryStudent from "@/components/ManageStudent/ModalHistoryStudent";
import ExcelImportExport from "@/components/ManageStudent/ExcelImportExport";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";

const ManageStudentPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isOpenModalHistory, setIsOpenModalHistory] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [isImportResultModalOpen, setIsImportResultModalOpen] = useState(false);

  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [isBulkDeleteLoading, setIsBulkDeleteLoading] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const fetchStudents = async (params?: StudentQueryParams) => {
    try {
      setIsLoading(true);
      const response = await getStudents(
        params || {
          pageIndex,
          pageSize,
        }
      );
      setStudents(response.data);
      setTotalPages(response.totalPages);
      setTotalRecords(response.totalRecords);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tải danh sách sinh viên";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (values: FormValues) => {
    const filterValues: Record<string, string | number> = {};
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "gender" || key === "search" || key === "status") {
          filterValues[key] = String(value);
        } else {
          filterValues[key] = Number(value);
        }
      }
    });
    const params: StudentQueryParams = {
      pageIndex,
      pageSize,
      ...(filterValues as Partial<StudentQueryParams>),
    };
    fetchStudents(params);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      toast.success("Xóa sinh viên thành công");
      fetchStudents();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.error.message) {
          toast.warning(error.response?.data?.error.message);
        } else {
          toast.error("Có lỗi xảy ra khi xóa sinh viên");
        }
      } else {
        toast.error("Có lỗi xảy ra khi xóa sinh viên");
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsBulkDeleteLoading(true);
      await deleteStudents(selectedStudentIds);

      toast.success(`Đã xóa thành công ${selectedStudentIds.length} sinh viên`);
      setSelectedStudentIds([]);
      setIsBulkDeleteMode(false);
      fetchStudents();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.error?.message) {
          toast.error(error.response.data.error.message);
        } else {
          toast.error("Có lỗi xảy ra khi xóa sinh viên");
        }
      } else {
        toast.error("Có lỗi xảy ra khi xóa sinh viên");
      }
    } finally {
      setIsBulkDeleteLoading(false);
      setIsBulkDeleteDialogOpen(false);
    }
  };

  const handleCreate = async (data: StudentFormData) => {
    try {
      setIsLoadingCreate(true);
      await createStudent(data);
      toast.success("Tạo sinh viên thành công");
      fetchStudents();
      setIsOpenModalCreate(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo sinh viên" + error);
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleUpdateStudent = async (id: number, data: StudentFormData) => {
    try {
      await updateStudent(id, data);
      toast.success("Cập nhật sinh viên thành công");
      fetchStudents();
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật sinh viên" + error);
    }
  };

  const handleImportStudents = async () => {
    fetchStudents();
  };

  const handleImportExcelResult = async (result: {
    success: number;
    failed: number;
    errors: string[];
  }) => {
    if (result.failed > 0) {
      setImportResult(result);
      setIsImportResultModalOpen(true);
    }
    fetchStudents();
  };

  const openUpdateModal = (student: Student) => {
    setSelectedStudent(student);
    setIsUpdateModalOpen(true);
  };

  const openHistoryModal = (student: Student) => {
    setSelectedStudent(student);
    setIsOpenModalHistory(true);
  };
  const handleBulkDeleteModeToggle = (checked: boolean) => {
    setIsBulkDeleteMode(checked);
    if (!checked) {
      setSelectedStudentIds([]);
    }
  };

  const handleStudentSelection = (studentId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedStudentIds((prev) => [...prev, studentId]);
    } else {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedStudentIds(students.map((student) => student.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [pageIndex, pageSize]);

  if (error) {
    toast.error(error, {
      duration: 5000,
      position: "top-right",
    });
  }

  return (
    <StudentDataProvider>
      <div className="p-3 flex flex-col gap-3 max-h-[calc(100vh-100px)] overflow-y-auto">
        <StudentSearchForm
          emailCount={totalRecords}
          onSearch={handleSearch}
          onRefresh={fetchStudents}
          onAdd={() => setIsOpenModalCreate(true)}
        />
        <div className="flex items-center justify-start bg-white p-4 gap-10 rounded-lg">
          <div className="flex items-center gap-3">
            <Switch
              checked={isBulkDeleteMode}
              onCheckedChange={handleBulkDeleteModeToggle}
              id="bulk-delete-mode"
            />
            <label htmlFor="bulk-delete-mode" className="text-sm font-medium">
              Xóa nhiều bản ghi
            </label>
          </div>

          {isBulkDeleteMode && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              disabled={isBulkDeleteLoading || selectedStudentIds.length === 0}
              className="flex items-center gap-2 relative"
            >
              <i className="mdi mdi-trash-can text-lg"></i>
              {selectedStudentIds.length > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center text-xs px-1"
                >
                  {selectedStudentIds.length}
                </Badge>
              )}
            </Button>
          )}
        </div>

        <ListStudent
          students={students}
          isLoading={isLoading}
          onRefresh={fetchStudents}
          onDelete={handleDelete}
          onEdit={openUpdateModal}
          onHistory={openHistoryModal}
          isBulkDeleteMode={isBulkDeleteMode}
          selectedStudentIds={selectedStudentIds}
          onStudentSelection={handleStudentSelection}
          onSelectAll={handleSelectAll}
        />

        <div className="flex justify-between items-center flex-wrap gap-2">
          <ExcelImportExport
            students={students}
            onImport={handleImportStudents}
            onImportResult={handleImportExcelResult}
            isLoading={isLoading}
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

        <ModalCreateStudent
          isOpen={isOpenModalCreate}
          onOpenChange={setIsOpenModalCreate}
          onSubmit={handleCreate}
          isLoading={isLoadingCreate}
        />
        <ModalUpdateStudent
          isOpen={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
          onSubmit={handleUpdateStudent}
          student={selectedStudent}
          isLoading={false}
        />
        {selectedStudent && (
          <ModalHistoryStudent
            isOpen={isOpenModalHistory}
            onOpenChange={setIsOpenModalHistory}
            student={selectedStudent}
          />
        )}
        <ConfirmDialog
          isOpen={isBulkDeleteDialogOpen}
          onOpenChange={setIsBulkDeleteDialogOpen}
          title="Xác nhận xóa nhiều sinh viên"
          message={
            <p className="text-[16px] text-gray-600">
              Bạn có chắc chắn muốn xóa{" "}
              <span className="font-semibold text-red-700">
                {selectedStudentIds.length}
              </span>{" "}
              sinh viên đã chọn không?
            </p>
          }
          onConfirm={handleBulkDelete}
          confirmText="Xóa"
          cancelText="Hủy"
          confirmButtonStyle="bg-red-600 hover:bg-red-700"
          isLoading={isBulkDeleteLoading}
        />

        {importResult && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isImportResultModalOpen ? "block" : "hidden"
              }`}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Kết quả Import</h3>
              <div className="space-y-2">
                <p className="text-green-600">
                  Thành công: {importResult.success}
                </p>
                <p className="text-red-600">Thất bại: {importResult.failed}</p>
                {importResult.errors.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Chi tiết lỗi:</p>
                    <div className="max-h-40 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600 mb-1">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsImportResultModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentDataProvider>
  );
};

export default ManageStudentPage;
