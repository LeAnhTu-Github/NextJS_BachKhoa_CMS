export enum ExamStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
}
export const STATUS_OPTIONS = [
  { value: ExamStatus.INACTIVE, label: "Không hoạt động" },
  { value: ExamStatus.ACTIVE, label: "Kích hoạt " },
];

export interface ExamSearchParams {
  search?: string;
  fromTime?: string;
  toTime?: string;
  status?: ExamStatus;
}

export interface ExamRequest {
    id: number;
    code: string;
    name: string;
    status: ExamStatus;
    type: "RETAKE_EXAM";
    fromTime: string;
    toTime: string;
    semester: Semester | null;
    terms: Term[] | null;
    // isExpired: boolean | null;
  }
export interface Term {
  code: string;
  creditHours: number;
  educationProgramId: number;
  id: number;
  name: string;
  weight: number;
  workload: string;
}

export interface Semester {
  id: number;
  code: string;
  name: string;
  fromTime: string;
  toTime: string;
  status: ExamStatus;
  terms: Term[] | null;
}

export interface PaginatedResponse<T> {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  beginIndex: number;
  endIndex: number;
  data: T[];
}

export interface ExamRequestResponse {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  beginIndex: number;
  endIndex: number;
  data: ExamRequest[];
}

export interface GetExamParams {
  fromTime?: string;
  toTime?: string;
  pageIndex: number;
  pageSize: number;
  search?: string;
  status?: ExamStatus;
}


