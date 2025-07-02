import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// // Error handling utilities
// export const handleApiError = (error: any): string => {
//   if (error.response?.data?.message) {
//     return error.response.data.message;
//   }
  
//   if (error.response?.status === 401) {
//     return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
//   }
  
//   if (error.response?.status === 403) {
//     return 'Bạn không có quyền truy cập vào tài nguyên này.';
//   }
  
//   if (error.response?.status === 404) {
//     return 'Không tìm thấy tài nguyên yêu cầu.';
//   }
  
//   if (error.response?.status >= 500) {
//     return 'Lỗi máy chủ. Vui lòng thử lại sau.';
//   }
  
//   if (error.message === 'Network Error') {
//     return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
//   }
  
//   return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
// };

// export const isAuthError = (error: any): boolean => {
//   return error.response?.status === 401 || error.response?.status === 403;
// };

// export const isNetworkError = (error: any): boolean => {
//   return error.message === 'Network Error' || !error.response;
// };
