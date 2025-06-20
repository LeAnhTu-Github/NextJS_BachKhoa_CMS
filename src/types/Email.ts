// Enum for Action Send Type
export enum ActionSendType {
  REJECT = 'REJECT',
  CONFIRM = 'CONFIRM',
  REMIND_PAY = 'REMIND_PAY',
  PAY_SUCCESS = 'PAY_SUCCESS',
  SCHEDULE = 'SCHEDULE',
  RESULT = 'RESULT',
  OTP = 'OTP'
}

// Enum for Exam Type
export enum ExamType {
  RETAKE_EXAM = 'RETAKE_EXAM',
  RETAKE_COURSES = 'RETAKE_COURSES',
  REASSESSMENT = 'REASSESSMENT',
  SHARED_DIRECTORY = 'SHARED_DIRECTORY'
}

// Enum for Send Type
export enum SendType {
  SV = 'SV',
  CBQL = 'CBQL',
  GV = 'GV'
}

// Enum for Status
export enum Status {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE'
}

// Main Email Configuration Interface
export interface EmailConfig {
  id: number;
  name: string;
  title: string;
  content: string;
  actionSendType: ActionSendType;
  sendType: SendType;
  status: Status;
  type: ExamType;
}

// Query Parameters Interface for API calls
export interface EmailConfigQueryParams {
  actionSendType?: ActionSendType;
  examType?: ExamType;
  pageIndex: number;
  pageSize: number;
  search?: string;
  sendType?: SendType;
  status?: Status;
}

// API Response Interface
export interface EmailConfigResponse {
  data: EmailConfig[];
  totalCount?: number;
  pageIndex?: number;
  pageSize?: number;
}

// Create Email Configuration Interface
export interface CreateEmailConfigRequest {
  name: string;
  title: string;
  content: string;
  actionSendType: ActionSendType;
  sendType: SendType;
  status: Status;
  type: ExamType;
}

// Update Email Configuration Interface
export interface UpdateEmailConfigRequest extends Partial<CreateEmailConfigRequest> {
  id: number;
}

// Type for dropdown options
export interface EmailConfigOption {
  label: string;
  value: string;
}

// Constants for dropdown options
export const ACTION_SEND_TYPE_OPTIONS: EmailConfigOption[] = [
  { label: 'Từ chối', value: ActionSendType.REJECT },
  { label: 'Xác nhận', value: ActionSendType.CONFIRM },
  { label: 'Nhắc nhở thanh toán', value: ActionSendType.REMIND_PAY },
  { label: 'Thanh toán thành công', value: ActionSendType.PAY_SUCCESS },
  { label: 'Lịch trình', value: ActionSendType.SCHEDULE },
  { label: 'Kết quả', value: ActionSendType.RESULT },
  { label: 'OTP', value: ActionSendType.OTP },
];

export const EXAM_TYPE_OPTIONS: EmailConfigOption[] = [
  { label: 'Thi lại', value: ExamType.RETAKE_EXAM },
  { label: 'Học lại môn học', value: ExamType.RETAKE_COURSES },
  { label: 'Đánh giá lại', value: ExamType.REASSESSMENT },
  { label: 'Thư mục chia sẻ', value: ExamType.SHARED_DIRECTORY },
];

export const SEND_TYPE_OPTIONS: EmailConfigOption[] = [
  { label: 'Sinh viên', value: SendType.SV },
  { label: 'Cán bộ quản lý', value: SendType.CBQL },
  { label: 'Giảng viên', value: SendType.GV },
];

export const STATUS_OPTIONS: EmailConfigOption[] = [
  { label: 'Không hoạt động', value: Status.INACTIVE },
  { label: 'Đang hoạt động', value: Status.ACTIVE },
];