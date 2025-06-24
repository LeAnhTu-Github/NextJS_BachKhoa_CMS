import api from "./api";
import {
  Student,
  StudentPaginationResponse,
  StudentQueryParams,
  StudentFormData,
  Classes,
  Major,
  Course,
  TrainingUnit,
  TrainingMethod,
  TrainingType,
  TermHistory,
  HistoryStudentQueryParams,
  HistoryStudentPaginationResponse,
} from "@/types/Student";

// Get students with pagination and filters
export const getStudents = async (
  params: StudentQueryParams
): Promise<StudentPaginationResponse> => {
  const response = await api.get("/student", { params });

  return response.data.data;
};

export const getClasses = async (): Promise<Classes[]> => {
  const response = await api.get("/classes/list", {
    params: {
      pageIndex: 1,
      pageSize: 1000,
    },
  });
  return response.data.data.data;
}

export const getTerms = async (): Promise<TermHistory[]> => {
  const response = await api.get("/term/list");
  return response.data.data;
} 
export const getHistoryStudent = async (params: HistoryStudentQueryParams): Promise<HistoryStudentPaginationResponse> => {
  const response = await api.get(`/student/history`, { params });
  return response.data;
}
export const getMajors = async (): Promise<Major[]> => {
  const response = await api.get("/major/list");
  return response.data.data;
}
export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get("/course/all");
  return response.data.data;
}

export const getStudentById = async (id: number): Promise<Student> => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};
export const getTrainingMethods = async (): Promise<TrainingMethod[]> => {
  const response = await api.get("/trainingMethod/list");
  return response.data.data;
}
export const getTrainingTypes = async (): Promise<TrainingType[]> => {
  const response = await api.get("/trainingType/list");
  return response.data.data;
}

export const getTrainingUnits = async (): Promise<TrainingUnit[]> => {
  const response = await api.get("/trainingUnit/list");
  return response.data.data;
}
export const createStudent = async (body: StudentFormData): Promise<Student> => {
  const response = await api.post("/student", body);
  return response.data;
};

export const updateStudent = async (
  id: number,
  data: Partial<StudentFormData>
): Promise<Student> => {
  const body = {
    id: id,
    ...data,
  }
  const response = await api.put(`/student/${id}`, body);
  return response.data;
};

export const deleteStudent = async (id: number): Promise<Student> => {
   const response = await api.delete(`/student/${id}`);
    return response.data;
};

export const getStudentsByClass = async (
  classId: number,
  params: Omit<StudentQueryParams, "classes">
): Promise<StudentPaginationResponse> => {
  const response = await api.get(`/classes/${classId}/students`, { params });
  return response.data;
};

export const getStudentsByCourse = async (
  courseId: number,
  params: Omit<StudentQueryParams, "course">
): Promise<StudentPaginationResponse> => {
  const response = await api.get(`/courses/${courseId}/students`, { params });
  return response.data;
};

export const getStudentsByMajor = async (
  majorId: number,
  params: Omit<StudentQueryParams, "majorId">
): Promise<StudentPaginationResponse> => {
  const response = await api.get(`/majors/${majorId}/students`, { params });
  return response.data;
};

export const getStudentsByTrainingUnit = async (
  trainingUnitId: number,
  params: Omit<StudentQueryParams, "trainingUnitId">
): Promise<StudentPaginationResponse> => {
  const response = await api.get(`/training-units/${trainingUnitId}/students`, {
    params,
  });
  return response.data;
};

