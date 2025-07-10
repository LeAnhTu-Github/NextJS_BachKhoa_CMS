export enum TrainingStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export const TRAINING_STATUS_OPTIONS = [
    { value: TrainingStatus.ACTIVE, label: "Hoạt động" },
    { value: TrainingStatus.INACTIVE, label: "Không hoạt động" },
];

export interface TrainingParams {
    pageIndex: number;
    pageSize: number;
    search?: string;
    status?: string;
}

export interface TrainingTypeCreate {
    code: string;
    name: string;
    status: TrainingStatus;
}
export interface TrainingType {
    id: number;
    code: string;
    name: string;
    status: TrainingStatus;
}

export interface TrainingTypeResponse {
    beginIndex: number;
    data: TrainingType[];
    endIndex: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
}

export interface ApiError {
    code: number;
    message: string;
}

export interface ApiResponse<T> {
    requestId: string;
    at: string;
    error: ApiError;
    data: T;
}

