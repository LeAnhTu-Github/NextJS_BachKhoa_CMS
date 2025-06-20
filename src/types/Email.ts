
export enum ActionSendType {
  REJECT = 'REJECT',
  CONFIRM = 'CONFIRM',
  REMIND_PAY = 'REMIND_PAY',
  PAY_SUCCESS = 'PAY_SUCCESS',
  SCHEDULE = 'SCHEDULE',
  RESULT = 'RESULT',
  OTP = 'OTP'
}

export enum ExamType {
  RETAKE_EXAM = 'RETAKE_EXAM',
  RETAKE_COURSES = 'RETAKE_COURSES',
  REASSESSMENT = 'REASSESSMENT',
  SHARED_DIRECTORY = 'SHARED_DIRECTORY'
}

export enum SendType {
  SV = 'SV',
  CBQL = 'CBQL',
  GV = 'GV'
}

export enum Status {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE'
}

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
export interface EmailConfigQueryParams {
  actionSendType?: ActionSendType;
  examType?: ExamType;
  pageIndex: number;
  pageSize: number;
  search?: string;
  sendType?: SendType;
  status?: Status;
}

export interface EmailConfigResponse {
  data: EmailConfig[];
  totalCount?: number;
  pageIndex?: number;
  pageSize?: number;
}

export interface CreateEmailConfigRequest {
  name: string;
  title: string;
  content: string;
  actionSendType: ActionSendType;
  sendType: SendType;
  status: Status;
  type: ExamType;
}

export interface UpdateEmailConfigRequest extends Partial<CreateEmailConfigRequest> {
  id: number;
}

export interface EmailConfigOption {
  label: string;
  value: string;
}

export const ACTION_SEND_TYPE_OPTIONS: EmailConfigOption[] = [
  { label: 'Từ chối', value: ActionSendType.REJECT },
  { label: 'Xác nhận đăng ký', value: ActionSendType.CONFIRM },
  { label: 'Nhắc đóng học phí', value: ActionSendType.REMIND_PAY },
  { label: 'Thanh toán thành công', value: ActionSendType.PAY_SUCCESS },
  { label: 'Lịch trình', value: ActionSendType.SCHEDULE },
  { label: 'Kết quả thi', value: ActionSendType.RESULT },
  { label: 'Gửi mã OTP', value: ActionSendType.OTP },
];

export const EXAM_TYPE_OPTIONS: EmailConfigOption[] = [
  { label: 'Thi lại', value: ExamType.RETAKE_EXAM },
  { label: 'Học lại', value: ExamType.RETAKE_COURSES },
  { label: 'Bảo vệ lại', value: ExamType.REASSESSMENT },
  { label: 'Danh mục hệ thống', value: ExamType.SHARED_DIRECTORY },
];

export const SEND_TYPE_OPTIONS: EmailConfigOption[] = [
  { label: 'Sinh viên', value: SendType.SV },
  { label: 'Cán bộ quản lý', value: SendType.CBQL },
  { label: 'Giảng viên', value: SendType.GV },
];

export const STATUS_OPTIONS: EmailConfigOption[] = [
  { label: 'Kích hoạt', value: Status.ACTIVE },
  { label: 'Chưa kích hoạt', value: Status.INACTIVE },
];