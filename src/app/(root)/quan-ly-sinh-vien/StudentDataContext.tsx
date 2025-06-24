import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Classes, Course, Major, TrainingMethod, TrainingType, TrainingUnit } from '@/types/Student';
import { getClasses, getMajors, getCourses, getTrainingUnits, getTrainingMethods, getTrainingTypes } from '@/services/studentService';

// Định nghĩa type cho context value
export type StudentDataContextType = {
  classes: Classes[];
  majors: Major[];
  courses: Course[];
  trainingUnits: TrainingUnit[];
  trainingMethods: TrainingMethod[];
  trainingTypes: TrainingType[];
  fetchClasses: () => Promise<void>;
  fetchMajors: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  fetchTrainingUnits: () => Promise<void>;
  fetchTrainingMethods: () => Promise<void>;
  fetchTrainingTypes: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const StudentDataContext = createContext<StudentDataContextType | undefined>(undefined);

export const StudentDataProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<Classes[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [trainingUnits, setTrainingUnits] = useState<TrainingUnit[]>([]);
  const [trainingMethods, setTrainingMethods] = useState<TrainingMethod[]>([]);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const response = await getClasses();
      setClasses(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách lớp';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMajors = async () => {
    try {
      setIsLoading(true);
      const response = await getMajors();
      setMajors(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách ngành';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTrainingMethods = async () => {
    try {
      setIsLoading(true);
      const response = await getTrainingMethods();
      setTrainingMethods(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách hình thức đào tạo';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTrainingTypes = async () => {
    try {
      setIsLoading(true);
      const response = await getTrainingTypes();
      console.log(response);
      setTrainingTypes(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách loại đào tạo';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTrainingUnits = async () => {
    try {
      setIsLoading(true);
      const response = await getTrainingUnits();
      setTrainingUnits(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách địa điểm đào tạo';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await getCourses();
      setCourses(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách ngành';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchClasses();
    fetchMajors();
    fetchCourses();
    fetchTrainingUnits();
    fetchTrainingMethods();
    fetchTrainingTypes();
  }, []);

  const value: StudentDataContextType = {
    classes,
    majors,
    courses,
    trainingUnits,
    trainingMethods,
    trainingTypes,
    fetchClasses,
    fetchMajors,
    fetchCourses,
    fetchTrainingUnits,
    fetchTrainingMethods,
    fetchTrainingTypes,
    isLoading,
    error,
  };

  return (
    <StudentDataContext.Provider value={value}>
      {children}
    </StudentDataContext.Provider>
  );
};

export const useStudentDataContext = () => {
  const context = useContext(StudentDataContext);
  if (!context) {
    throw new Error('useStudentDataContext must be used within a StudentDataProvider');
  }
  return context;
};
