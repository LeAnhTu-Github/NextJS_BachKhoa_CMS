import { CreateDecisionRequest, DecisionRequest, DecisionStatus } from "@/types/Decision";
import api from "./api";

export const getDecision = async (params: DecisionRequest) => {
  const response = await api.get("/decisionFee", { params });
  return response.data.data;
};

export const changeStatusDecision = async (id: number, status: DecisionStatus) => {
  const response = await api.put(`/decisionFee/changeStatus/${id}`, {status});
  return response.data;
};

export const deleteDecision = async (id: number) => {
  const response = await api.delete(`/decisionFee/${id}`);
  return response.data;
};

export const getSemesters = async () => {
  const response = await api.get("/semester/list", {
    params: {
        status: "ACTIVE"
    }
  });
  return response.data;
};

export const getMajorsList = async () => {
  const response = await api.get("/major/list", {
    params: {
      status: "ACTIVE"
    }
  });
  return response.data;
};

export const getFileExportByDecisionId = async (id: number) => {
  const response = await api.get(`/decisionFee/export`, {
    params: {
        decisionFeeId: id
    }
  });
  return response.data.data;
};

export const createDecision = async (data: CreateDecisionRequest) => {
  const response = await api.post("/decisionFee", data);
  return response.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/file/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return {
    name: `${response.data.data.name}.${response.data.data.ext}`,
    url: response.data.data.url,
  };
};

export const updateDecision = async (id: number, data: CreateDecisionRequest) => {
  const response = await api.put(`/decisionFee/${id}`, data);
  return response.data;
};