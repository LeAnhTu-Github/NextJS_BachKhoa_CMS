import { ExamRequest, ExamRequestResponse, ExamStatus, GetExamParams } from "@/types/Retake";
import api from "./api";

export const getExam = async (params: GetExamParams) => {
  const response = await api.get("/exam", { params });
  return response.data;
};

export const createExam = async (data: ExamRequest) => {
  const response = await api.post("/exam", data);
  return response.data;
};

export const getListSemester = async () => {
  const response = await api.get("/semester/list", {
    params: {
      status: ExamStatus.ACTIVE,
    }
  });
  return response.data;
};

export const deleteExam = async (id: number) => {
  const response = await api.delete(`/exam/${id}`);
  return response.data;
};

export const updateExam = async (id: number, data: ExamRequest) => {
  const response = await api.put(`/exam/${id}`, data);
  return response.data;
};

export const changeStatusExam = async (id: number, status: ExamStatus) => {
    const response = await api.put(`/exam/changeStatus/${id}`, { status });
  return response.data;
};