export interface RegisterStudentExamRequest {
  clazzId?: number;
  examId?: number;
  feePaidStatus?: FeePaidStatus;
  registerStudentStatus?: RegisterStudentStatus;
  sendMailStatus?: SendMailStatus;
}
export interface RegisterStudentExamResponse {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  beginIndex: number;
  endIndex: number;
  data: RegisterStudentExam[];
}

export interface RegisterStudentExamCreate {
  birthday: string;
  clazzId: number;
  code: string;
  courseId: number;
  email: string;
  examId: number;
  fullName: string;
  gender: string;
  id: number;
  majorId: number;
  phone: string;
  termCode: string;
  totalFee: number;
  trainingUnitId: number;
}

export interface RegisterStudentExamUpdate {
  birthday: string;
  clazzId: number;
  code: string;
  courseId: number;
  email: string;
  examId: number;
  fullName: string;
  id: number;
  majorId: number;
  phone: string;
  registerStudentStatus: RegisterStudentStatus;
  termIds: number[];
  totalFee: number;
}

export interface RegisterStudentExam {
  id: number;
  code: string;
  fullName: string;
  gender: string | null;
  birthday: string;
  email: string;
  phone: string;
  course: Course;
  clazz: Clazz;
  major: Major;
  registerStudentStatus: string;
  sendMailStatus: string;
  feePaidStatus: string;
  registerStudentTerms: registerStudentTerms[];
  registerStudentTermV2Dtos: registerStudentTermV2Dtos[];
  createTime: string;
  totalFee: number;
  exam: Exam;
  confirmBy: number | null;
  dateImport: string | null;
  dateFeePaid: string | null;
  feePaid: number | null;
  orderCode: string | null;
  semester: Semester;
  studentId: number;
  studentCode: string;
  termId: number;
  termName: string;
  term: Term;
  trainingUnitDto: TrainingUnit | null;
  isListedForBank: string;
  retakeCourseStatus: string | null;
  creditManagement: string;
  tuitionFeeManagement: string;
  studentManagement: string;
  decisionFeeName: string | null;
  creditApprovedFullName: string;
  creditApprovedEmail: string;
  tuitionApprovedFullName: string;
  tuitionApprovedEmail: string;
  studentApprovedFullName: string;
  studentApprovedEmail: string;
}

export interface registerStudentTermV2Dtos {
  id: number;
  term: Term | null;
  exam: Exam | null;
  fee: number;
  feeDecision: number;
}

export interface ExamSession {
  classroom: string;
  createBy: number;
  createTime: string;
  exam: Exam | null;
  status: string;
  toTime: string;
  updateBy: number;
  updateTime: string;
}
export interface registerStudentTerms {
  createTime: string;
  createBy: number | null;
  updateTime: string;
  updateBy: number | null;
  isDelete: number;
  id: number;
  examSession: ExamSession | null;
  fee: number;
  feeDecision: number;
}

export interface Term {
  id: number;
  code: string;
  name: string;
  workload: string | null;
  status: string;
  creditHours: number;
  creditTraining: number;
  weight: number | null;
  educationCodes: string | null;
  educationNames: string | null;
  reDefenseRegisterStudentExams: string | null;
  updateTime: string;
  address: string | null;
}

export interface Semester {
  code: string,
  createBy: number,
  createTime: string,
  fromTime: string,
  id: number,
  isDelete: number,
  name: string,
  status: string,
  toTime: string,
  updateBy: number,
  updateTime: string
}
export interface Exam {
  createTime: string;
  createBy: number;
  updateTime: string;
  updateBy: number;
  isDelete: number;
  id: number;
  code: string;
  name: string;
  status: string;
  fromTime: string;
  toTime: string;
  paymentFromTime: string | null;
  paymentToTime: string | null;
  semester: Semester;
}

export interface GetByStudent {
  id: number;
  code: string;
  name: string;
  status: string;
  fromTime: string;
  toTime: string;
  semester: Semester;
  terms: Term[] | null;
  isExpired: boolean | null;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  status: string;
  fromTime: string;
  toTime: string;
  codeFee: string | null;
  nameFee: string | null;
  revenueCode: string;
  revenueName: string;
  enrollmentYear: string | null;
}

export interface Clazz {
  id: number;
  code: string;
  name: string;
  status: string;
  courseId: number;
  trainingMethodName: string;
  trainingMethodId: number;
  trainingTypeId: number;
  trainingUnitId: number;
  trainingUnitName: string;
  courseName: string;
  majorName: string;
  majorId: number;
  admissionTime: string;
  typeTrainingNames: string;
}

export interface Major {
  id: number;
  code: string;
  name: string;
  status: string;
  educationProgram: EducationProgram;
}

export interface EducationProgram {
  id: number;
  code: string;
  name: string;
  status: string;
  terms: Term[] | null;
}
export enum CreditStudentTuitionFeeManagement {
  WAIT_CONFIRM = "WAIT_CONFIRM",
  CONFIRMED = "CONFIRMED",
  REFUSED = "REFUSED",
};

export const CREDIT_STUDENT_TUITION_FEE_MANAGEMENT_OPTIONS = [
  { value: CreditStudentTuitionFeeManagement.WAIT_CONFIRM, label: "Chờ xác nhận" },
  { value: CreditStudentTuitionFeeManagement.CONFIRMED, label: "Đã xác nhận" },
  { value: CreditStudentTuitionFeeManagement.REFUSED, label: "Từ chối" },
];

export enum FeePaidStatus {
  NOT_PAID = "NOT_PAID",
  // REFUSED_PAID = "REFUSED_PAID",
  PAID = "PAID",
}

export const FEE_PAID_STATUS_OPTIONS = [
  { value: FeePaidStatus.NOT_PAID, label: "Chưa trả học phí", color: 'bg-[#ffae1f]'},
  // { value: FeePaidStatus.REFUSED_PAID, label: "Từ chối thanh toán" },
  { value: FeePaidStatus.PAID, label: "Đã trả học phí" , color: 'bg-[#4caf50]' },
];

export enum IsListedForBank {
  YES = "YES",
  NO = "NO",
  REJECTED = "REJECTED",
}

export const IS_LISTED_FOR_BANK_OPTIONS = [
  { value: IsListedForBank.YES, label: "Đã lập danh sách", color: 'bg-[#4caf50]' },
  { value: IsListedForBank.NO, label: "Chưa lập danh sách", color: 'bg-[#ffae1f]' },
  { value: IsListedForBank.REJECTED, label: "Từ chối", color: 'bg-redberry' },
];

export enum RegisterStudentStatus {
  AWAITING_CONFIRMATION = "AWAITING_CONFIRMATION",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
}

export const REGISTER_STUDENT_STATUS_OPTIONS = [
  { value: RegisterStudentStatus.AWAITING_CONFIRMATION, label: "Chờ xác nhận" },
  { value: RegisterStudentStatus.CONFIRMED, label: "Đã xác nhận" },
  { value: RegisterStudentStatus.REJECTED, label: "Đã từ chối" },
];

export enum SendMailStatus {
  SENT = "SENT",
  NOT_SENT = "NOT_SENT",
}

export const SEND_MAIL_STATUS_OPTIONS = [
  { value: SendMailStatus.SENT, label: "Đã gửi", color: 'bg-[#4caf50]' },
  { value: SendMailStatus.NOT_SENT, label: "Chưa gửi", color: 'bg-[#ffae1f]' },
];

export interface TrainingUnit {
  address: string;
  code: string;
  id: number;
  name: string;
  status: string;
}