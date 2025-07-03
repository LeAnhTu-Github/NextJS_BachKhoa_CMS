import api from "./api"
import { RegisterStudentExamRequest, RegisterStudentExamResponse, Clazz, Exam, RegisterStudentStatus, GetByStudent} from "@/types/RegisterStudentExam"
import { Student } from "@/types/Student"
export const getListRegister = async (searchParams: RegisterStudentExamRequest, pageIndex: number, pageSize: number): Promise<RegisterStudentExamResponse> => {
  const response = await api.get('/redefense/register', {
    params: {
        ...searchParams,
        pageIndex: pageIndex,
        pageSize: pageSize,
    },
  });
  return response.data.data;
};

export const getClasses = async (): Promise<Clazz[]> => {
    const response = await api.get('/classes/all');
    return response.data.data;
}

export const getExams = async (): Promise<Exam[]> => {
    const response = await api.get('/redefense/exam/list');
    return response.data.data;
}

export const changeStatusRegister = async (id: number, status: RegisterStudentStatus) => {
    const response = await api.put(`/redefense/register/${id}`, {
        status: status,
    });
    return response.data.data;
}

export const deleteRegister = async (id: number) => {
    const response = await api.delete(`/redefense/register/${id}`);
    return response.data.data;
}

export const getFileExportByRegisterStudentId = async (id: number) => {
    const response = await api.get(`/redefense/register/${id}/export`);
    return response.data.data;
}

export const getStudentList = async (): Promise<Student[]> => {
    const response = await api.get('/student/redefense/canRegister', {
        params: {
            pageIndex: 1,
            pageSize: 50,
        }
    });
    return response.data.data.data;
}

export const getStudentListByRegister = async (registerId: number): Promise<Student[]> => {
    const response = await api.get(`/student/redefense/canRegister`, {
        params: {
            pageIndex: 1,
            pageSize: 50,
            search: registerId,
        }
    });
    return response.data.data.data;
}

export const getByStudent = async (studentId: number): Promise<GetByStudent[]> => {
    const response = await api.get(`/redefense/exam/get-by-student`, {
        params: {
            studentId
        }
    });
    return response.data.data;
}

// SEND MAIL:
export const sendMailFee = async () => {
    const response = await api.get(`/redefense/register/mailFee`);
    return response.data.data;
}

export const sendMailRefused = async () => {
    const response = await api.get(`/redefense/register/mailRefused`);
    return response.data.data;
}
