"use client"
import React, { useEffect, useState } from 'react'
import StudentSearchForm from '@/components/ManageStudent/StudentSearchForm'
import { Student, StudentFormData, StudentQueryParams } from '@/types/Student';
import { createStudent, deleteStudent, getStudents, updateStudent } from '@/services/studentService';
import ListStudent from '@/components/ManageStudent/ListStudent';
import CustomPagination from '@/components/ui/custom-pagination';
import { toast } from 'sonner';
import { StudentDataProvider } from './StudentDataContext';
import { FormValues } from '@/components/ManageStudent/StudentSearchForm';
import { AxiosError } from 'axios';
import ModalCreateStudent from '@/components/ManageStudent/ModalCreateStudent';
import ModalUpdateStudent from '@/components/ManageStudent/ModalUpdateStudent';
import ModalHistoryStudent from '@/components/ManageStudent/ModalHistoryStudent';

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
    const fetchStudents = async (params?: StudentQueryParams) => {
        try {
            setIsLoading(true);
            const response = await getStudents(params || {
                pageIndex,
                pageSize,
            });
            setStudents(response.data);
            setTotalPages(response.totalPages);
            setTotalRecords(response.totalRecords);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách sinh viên';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }
    const handleSearch = (values: FormValues) => {
        const filterValues = Object.entries(values).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                acc[key as keyof StudentQueryParams] = Number(value) as any;
            }
            return acc;
        }, {} as Partial<StudentQueryParams>);
        const params = {
            pageIndex,
            pageSize,
            ...filterValues,
        };
        fetchStudents(params);
    }
    const handleDelete = async (id: number) => {
        try {
            await deleteStudent(id);
            toast.success('Xóa sinh viên thành công');
            fetchStudents();
        } catch (error) {
            if (error instanceof AxiosError) {
               if(error.response?.data?.error.message) {
                toast.warning(error.response?.data?.error.message);
               } else {
                toast.error('Có lỗi xảy ra khi xóa sinh viên');
               }
            } else {
                toast.error('Có lỗi xảy ra khi xóa sinh viên');
            }
        }
    }
    const handleCreate = async (data: StudentFormData) => {
        try {
            setIsLoadingCreate(true);
            await createStudent(data);
            toast.success('Tạo sinh viên thành công');
            fetchStudents();
            setIsOpenModalCreate(false);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo sinh viên');
        } finally {
            setIsLoadingCreate(false);
        }
    }
    const handleUpdateStudent = async (id: number, data: StudentFormData) => {
        console.log(6666, id, data);
        try {
            await updateStudent(id, data);
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };
    const openUpdateModal = (student: Student) => {
        setSelectedStudent(student);
        setIsUpdateModalOpen(true);
    };
    const openHistoryModal = (student: Student) => {
        setSelectedStudent(student);
        setIsOpenModalHistory(true);
    };
    useEffect(() => {
        fetchStudents();
    }, [pageIndex, pageSize]);

    if (error) {
        toast.error(error, {
            duration: 5000,
            position: 'top-right',
        });
    }

  return (
    <StudentDataProvider>
        <div className="p-3 flex flex-col gap-3 max-h-[calc(100vh-100px)] overflow-y-auto">
            <StudentSearchForm emailCount={totalRecords} onSearch={handleSearch} onRefresh={fetchStudents} onAdd={() => setIsOpenModalCreate(true)} />
            <ListStudent students={students} isLoading={isLoading} onRefresh={fetchStudents} onDelete={handleDelete} onEdit={openUpdateModal} onHistory={openHistoryModal} />
            <CustomPagination
            setTotalPages={setTotalPages}
            currentPage={pageIndex}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={(page) => setPageIndex(page)}
                onPageSizeChange={(size) => setPageSize(size)}
            />
            <ModalCreateStudent isOpen={isOpenModalCreate} onOpenChange={setIsOpenModalCreate} onSubmit={handleCreate} isLoading={isLoadingCreate} />
            <ModalUpdateStudent
                isOpen={isUpdateModalOpen}
                onOpenChange={setIsUpdateModalOpen}
                onSubmit={handleUpdateStudent}
                student={selectedStudent}
                isLoading={false}
            />
            {selectedStudent && (
                <ModalHistoryStudent isOpen={isOpenModalHistory} onOpenChange={setIsOpenModalHistory} student={selectedStudent} />
            )}
        </div>
    </StudentDataProvider>
  )
}

export default ManageStudentPage;