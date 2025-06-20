export interface Email {
  id: number;
  name: string;
  targetAudience: string[]; // Đối tượng gửi mail (Giảng viên, Sinh viên, etc.)
  configType: string[]; // Loại cấu hình gửi mail (Bảo vệ lại, Học lại, etc.)
  actionType: string[]; // Loại hành động (Thành toán thành công, Kết quả thi, etc.)
  content: string; // Nội dung
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
}