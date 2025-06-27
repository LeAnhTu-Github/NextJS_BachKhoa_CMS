// Enums for student management
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export enum TrainingMethodStatus {
  LT1 = "LT1",
  CD = "CD",
  DH = "DH"
}

export enum StudentStatus {
  STUDYING = "STUDYING",
  DROP_OUT_OF_SCHOOL = "DROP_OUT_OF_SCHOOL",
  LEAVE_OF_ABSENCE = "LEAVE_OF_ABSENCE",
}

export enum DegreeType {
  BACHELOR = "BACHELOR",
  ENGINEER = "ENGINEER",
}

export enum TermStatus {
  EXEMPTED = "EXEMPTED"
}

export enum ExamType {
  RETAKE_EXAM = "RETAKE_EXAM",
  RETAKE_COURSES = "RETAKE_COURSES",
  REASSESSMENT = "REASSESSMENT",
  SHARED_DIRECTORY = "SHARED_DIRECTORY",
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export interface TermHistory {
  code: string;
  creditHours: number;
  creditTraining: number;
  id: number;
  name: string;
  status: Status;
  termId: number;
  weight: number;
  workload: string;
}

export interface Term {
  knowledgeUnit: string;
  semesterMajor: number;
  termHistory: TermHistory;
  termStatus: TermStatus;
}

export interface EducationProgram {
  code: string;
  id: number;
  name: string;
  status: Status;
  terms: Term[];
}

export interface Major {
  code: string;
  educationProgram: EducationProgram;
  id: number;
  name: string;
  status: Status;
}

export interface TrainingType {
  code: string;
  id: number;
  name: string;
  status: Status;
}

export interface TrainingMethod {
  code: string;
  id: number;
  name: string;
  status: Status;
  trainingTypes: TrainingType[];
  yearsOfTraining: number;
}

export interface TrainingUnit {
  address: string;
  code: string;
  id: number;
  name: string;
  status: Status;
}

export interface Course {
  code: string;
  codeFee: string;
  enrollmentYear: string;
  fromTime: string;
  id: number;
  name: string;
  nameFee: string;
  revenueCode: string;
  revenueName: string;
  status: Status;
  toTime: string;
}
export interface TemplateFileImport {
  data: string;
  fileName: string;
  url: string;
}
export interface Classes {
  admissionTime: string;
  code: string;
  courseId: number;
  courseName: string;
  id: number;
  majorId: number;
  majorName: string;
  name: string;
  status: Status;
  trainingMethodId: number;
  trainingMethodName: string;
  trainingTypeId: number;
  trainingUnitId: number;
  trainingUnitName: string;
  typeTrainingNames: string;
}
export interface CheckImportResponse {
  file: TemplateFileImport;
  objects: Student[];
}
export interface Student {
  address: string;
  birthday: string;
  birthplace: string;
  citizen: string;
  classId: number;
  className: string;
  classes: Classes;
  code: string;
  course: Course;
  courseId: number;
  courseName: string;
  degreeType: DegreeType;
  email: string;
  emailOther: string;
  ethnicity: string;
  expiryDate: string;
  fullName: string;
  gender: Gender;
  homeTown: string;
  id: number;
  major: Major;
  majorId: number;
  majorName: string;
  phone: string;
  startOfTraining: string;
  status: StudentStatus;
  trainingMethod: TrainingMethod;
  trainingMethodId: number;
  trainingMethodName: string;
  trainingType: TrainingType;
  trainingTypeId: number;
  trainingTypeName: string;
  trainingUnit: TrainingUnit;
  trainingUnitId: number;
  trainingUnitName: string;
}

export interface StudentPaginationResponse {
  beginIndex: number;
  data: Student[];
  endIndex: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface ClassesPaginationResponse {
  beginIndex: number;
  data: Classes[];
  endIndex: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface StudentQueryParams {
  classes?: number;
  course?: number;
  gender?: string;
  majorId?: number;
  pageIndex: number;
  pageSize: number;
  search?: string;
  status?: string;
  trainingMethod?: number;
  trainingUnitId?: number;
}

export const GENDER_OPTIONS = [
  { value: Gender.MALE, label: "Nam" },
  { value: Gender.FEMALE, label: "Nữ" },
  { value: Gender.OTHER, label: "Khác" }
];

export const STUDENT_STATUS_OPTIONS = [
  { value: StudentStatus.STUDYING, label: "Đang học tập", color: "bg-redberry" },
  { value: StudentStatus.DROP_OUT_OF_SCHOOL, label: "Đã nghỉ học", color: "bg-[#9E9E9E]" },
  { value: StudentStatus.LEAVE_OF_ABSENCE, label: "Bảo lưu", color: "bg-[#FFAE1F]" },
];

export const TRAINING_METHOD_OPTIONS = [
  { value: TrainingMethodStatus.LT1, label: "Liên tục" },
  { value: TrainingMethodStatus.CD, label: "Cao đẳng" },
  { value: TrainingMethodStatus.DH, label: "Đại học" },
];

export const DEGREE_TYPE_OPTIONS = [
  { value: DegreeType.BACHELOR, label: "Cử nhân" },
  { value: DegreeType.ENGINEER, label: "Kỹ sư" }
];

export const EXAM_TYPE_OPTIONS = [
  { value: ExamType.RETAKE_EXAM, label: "Thi lại" },
  { value: ExamType.RETAKE_COURSES, label: "Học lại" },
  { value: ExamType.REASSESSMENT, label: "Bảo vệ lại" },
  { value: ExamType.SHARED_DIRECTORY, label: "Danh mục hệ thống" },
];

export interface StudentFormData {
  fullName: string;
  code: string;
  email: string;
  phone: string;
  gender: Gender;
  birthday: string;
  address: string;
  birthplace: string;
  homeTown: string;
  citizen: string;
  ethnicity: string;
  emailOther?: string;
  classId: number;
  courseId: number;
  majorId: number;
  trainingMethodId: number;
  trainingTypeId: number;
  trainingUnitId: number;
  status: StudentStatus;
  startOfTraining: string;
  expiryDate?: string;
  degreeType: DegreeType;
}

// // Types for History Student API response
// export interface HistoryStudentPaginationResponse {
//   beginIndex: number;
//   data: HistoryStudent[];
//   endIndex: number;
//   pageIndex: number;
//   pageSize: number;
//   totalPages: number;
//   totalRecords: number;
// }

// export interface HistoryStudent {
//   completedTime: string;
//   examType: ExamType;
//   term: HistoryStudentTerm;
// }

// export interface HistoryStudentTerm {
//   address: string;
//   code: string;
//   creditHours: number;
//   creditTraining: number;
//   educationCodes: string[];
//   educationNames: string[];
//   id: number;
//   name: string;
//   reDefenseRegisterStudentExams: ReDefenseRegisterStudentExam[];
//   status: Status;
//   updateTime: string;
//   weight: number;
//   workload: string;
// }

// export interface ReDefenseRegisterStudentExam {
//   birthday: string;
//   clazz: Classes;
//   code: string;
//   confirmBy: number;
//   course: Course;
//   createBy: number;
//   createTime: string;
//   creditApprovedAt: string;
//   creditApprovedBy: number;
//   creditManagement: string;
//   dateFeePaid: string;
//   dateImport: string;
//   email: string;
//   exam: HistoryStudentExam;
//   feePaid: number;
//   feePaidStatus: string;
//   fullName: string;
//   gender: Gender;
//   id: number;
//   isDelete: number;
//   isListedForBank: string;
//   major: Major;
//   orderCode: string;
//   phone: string;
//   registerStudentStatus: string;
//   retakeCourseStatus: string;
//   sendMailStatus: string;
//   student: HistoryStudentInfo;
//   studentApprovedAt: string;
//   studentApprovedBy: number;
//   studentManagement: string;
//   term: HistoryStudentTermSummary;
//   totalFee: number;
//   trainingUnit: TrainingUnit;
//   tuitionFeeApprovedAt: string;
//   tuitionFeeApprovedBy: number;
//   tuitionFeeManagement: string;
//   updateBy: number;
//   updateTime: string;
// }

export interface HistoryStudentExam {
  code: string;
  createBy: number;
  createTime: string;
  fromTime: string;
  id: number;
  isDelete: number;
  name: string;
  paymentFromTime: string;
  paymentToTime: string;
  semester: HistoryStudentSemester;
  status: Status;
  toTime: string;
  updateBy: number;
  updateTime: string;
}

export interface HistoryStudentSemester {
  code: string;
  createBy: number;
  createTime: string;
  fromTime: string;
  id: number;
  isDelete: number;
  name: string;
  status: Status;
  toTime: string;
  updateBy: number;
  updateTime: string;
}

export interface HistoryStudentInfo {
  address: string;
  birthday: string;
  birthplace: string;
  citizen: string;
  clazz: Classes;
  code: string;
  codeOfUni: string;
  course: Course;
  createBy: number;
  createTime: string;
  dateOfIssue: string;
  degreeGrantingSchool: string;
  degreeType: DegreeType;
  dhbkAndDvlk: string;
  district: string;
  dv: string;
  email: string;
  emailOther: string;
  enrollmentPeriod: string;
  equalNumber: string;
  ethnicity: string;
  exemptionArea: string;
  expiryDate: string;
  fullName: string;
  gender: Gender;
  graduatedMajor: string;
  homeTown: string;
  id: number;
  invoiceAddress: string;
  invoiceCode: string;
  invoiceForUnit: string;
  invoiceNameTo: string;
  isDelete: number;
  major: Major;
  nationality: string;
  note: string;
  numberInTheBook: string;
  objectEnrollment: string;
  officers: string;
  phone: string;
  profileAddress: string;
  province: string;
  registeredAddress: string;
  religion: string;
  startOfTraining: string;
  status: StudentStatus;
  supplementaryArea: string;
  trainingMethod: TrainingMethod;
  trainingType: TrainingType;
  trainingUnit: TrainingUnit;
  updateBy: number;
  updateTime: string;
  ward: string;
}

export interface HistoryStudentTermSummary {
  address: string;
  code: string;
  createBy: number;
  createTime: string;
  creditHours: number;
  creditTraining: number;
  id: number;
  isDelete: number;
  name: string;
  status: Status;
  updateBy: number;
  updateTime: string;
  weight: number;
  workload: string;
} 

export interface HistoryStudentQueryParams {
  examType: ExamType;
  pageIndex: number;
  pageSize: number;
  studentId: number;
  termId: number;
}
