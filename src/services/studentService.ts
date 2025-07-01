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
  TemplateFileImport,
  CheckImportResponse,
} from "@/types/Student";

// template file import
export const getTemplateFileImport = async (): Promise<TemplateFileImport> => {
  const response = await api.get("/student/templateImport");
  return response.data.data;
} 

export const checkImportExcel = async (file: File): Promise<CheckImportResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post("/student/checkImport", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
}

export const importExcel = async (fileUrl: string, students: Student[]): Promise<{ success: number; failed: number; errors: string[] }> => {
  const body = {
    fileUrl: fileUrl,
    students: students
  }
  
  const response = await api.post("/student/importExcel", body);
  return response.data.data;
}

export const exportExcel = async (): Promise<TemplateFileImport> => {
  const response = await api.get("/student/exportExcel");
  return response.data.data;
}

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
export const getHistoryStudent = async (params: HistoryStudentQueryParams): Promise<StudentPaginationResponse> => {
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

export const importStudents = async (students: StudentFormData[]): Promise<{ success: number; failed: number; errors: string[] }> => {
  try {
    const results = await Promise.allSettled(
      students.map(student => createStudent(student))
    );
    
    const success = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    const errors = results
      .map((result, index) => {
        if (result.status === 'rejected') {
          return `Dòng ${index + 1}: ${result.reason?.message || 'Lỗi không xác định'}`;
        }
        return null;
      })
      .filter(Boolean) as string[];

    return { success, failed, errors };
  } catch (error) {
    console.log(error);
    throw new Error('Có lỗi xảy ra khi import sinh viên');
  }
};

export const deleteStudents = async (ids: number[]): Promise<void> => {
  const response = await api.post("/student/deleteStudents",{
   ids
  })
  return response.data;
};

