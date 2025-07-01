export enum DecisionStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
}
export const STATUS_OPTIONS = [
  { value: DecisionStatus.INACTIVE, label: "Không hoạt động" },
  { value: DecisionStatus.ACTIVE, label: "Kích hoạt " },
];

export interface DecisionRequest {
  pageIndex: number;
  pageSize: number;
  name?: string;
  semesterId?: number;
  status?: DecisionStatus;
}
export type Decision = {
  id: number;
  name: string;
  fileInform: string | null;
  semester: Semester;
  timeInform: string;
  status: "ACTIVE" | "INACTIVE";
  decisionType: "TERM" | string;
  estimationFeeDtos: EstimationFeeDto[];
};

export interface DecisionSearchParams {
  name?: string;
  semesterId?: number;
  status?: DecisionStatus;
}

export interface DecisionResponse {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  beginIndex: number;
  endIndex: number;
  data: Decision[];
}

export type Major = {
  id: number;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  educationProgram: EducationProgram | null;
};


export type Semester = {
  createTime: string;
  createBy: number;
  updateTime: string;
  updateBy: number;
  isDelete: number;
  id: number;
  code: string;
  name: string;
  fromTime: string | null;
  toTime: string | null;
  status: "ACTIVE" | "INACTIVE";
};
export type EstimationFeeDto = {
  id: number;
  majorId: number;
  decisionFeeId: number;
  semesterId: number;
  major: Major;
  fee: number;
  feeCreditHour: number;
  feeDefend: number;
};
export type EducationProgram = {
  id: number;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  terms: Term[];
};

export interface Term {
  code: string;
  creditHours: number;
  educationProgramId: number;
  id: number;
  name: string;
  weight: number;
  workload: string;
}

export type EstimationRequest = {
  fee: number;
  educationProgram: string;
  name: string;
  majorId: number;
};

export type CreateDecisionRequest = {
  decisionType: "TERM" | string;
  defaultFee: number;
  fileInform: string;
  id: number;
  name: string;
  semesterId: number;
  status: "ACTIVE" | "INACTIVE";
  timeInform: string;
  estimationRequests: EstimationRequest[];
};
