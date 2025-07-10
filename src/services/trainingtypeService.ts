import {
  TrainingParams,
  TrainingTypeResponse,
  ApiResponse,
  TrainingType,
  TrainingTypeCreate,
} from "@/types/TrainingType";
import api from "./api";

export const trainingTypeService = {
  getTrainingTypes: async (
    params: TrainingParams
  ): Promise<TrainingTypeResponse> => {
    const response = await api.get<ApiResponse<TrainingTypeResponse>>(
      "/trainingType",
      { params }
    );
    return response.data.data;
  },
  createTrainingType: async (data: TrainingTypeCreate) => {
    const response = await api.post<ApiResponse<TrainingType>>(
      "/trainingType",
      data
    );
    return response.data.data;
  },
  updateTrainingType: async (id: number, data: TrainingTypeCreate) => {
    const response = await api.put<ApiResponse<TrainingType>>(
      `/trainingType/${id}`,
      data
    );
    return response.data.data;
  },
  deleteTrainingType: async (trainingTypeId: number) => {
    const response = await api.delete<ApiResponse<TrainingType>>(
      `/trainingType/${trainingTypeId}`,
      {
        params: {
          trainingTypeId,
        },
      }
    );
    return response.data.data;
  },
  changeStatusTrainingType: async (id: number, status: string) => {
    const response = await api.put<ApiResponse<TrainingType>>(
      `/trainingType/changeStatus/${id}`,
      {
        params: {
          id,
          status,
        },
      }
    );
    return response.data.data;
  },
  getListTrainingType: async () => {
    const response = await api.get<ApiResponse<TrainingType[]>>(
      "/trainingType/list"
    );
    return response.data.data;
  },
};
