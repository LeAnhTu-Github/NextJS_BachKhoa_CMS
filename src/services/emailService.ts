import api from "./api";
import { EmailConfigQueryParams, EmailConfig} from "@/types/Email";

export const getListEmailConfig = async (params: EmailConfigQueryParams) => {
  const response = await api.get("/configMail", { params });
  return response.data.data;
};

export const changeStatusEmailConfig = async (id: number, status: string) => {
  const response = await api.put(`/configMail/changeStatus/${id}`, { status });
  return response.data;
};

export const createEmailConfig = async (data: EmailConfig) => {
  const response = await api.post("/configMail", data);
  return response.data;
}

export const deleteEmailConfig = async (id: number) => {
  const response = await api.delete(`/configMail/${id}`);
  return response.data;
}

export const updateEmailConfig = async (id: number, data: EmailConfig) => {
  const response = await api.put(`/configMail/${id}`, data);
  return response.data;
}