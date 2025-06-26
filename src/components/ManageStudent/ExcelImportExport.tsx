"use client";
import React, { useRef, useState } from "react";
import { Download, FileSpreadsheet, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Student,
  StudentFormData,
} from "@/types/Student";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useStudentDataContext } from "@/app/(root)/quan-ly-sinh-vien/StudentDataContext";
import { exportExcel, checkImportExcel, importExcel } from "@/services/studentService";

interface ExcelImportExportProps {
  students: Student[];
  onImport: (students: StudentFormData[]) => void;
  onImportResult?: (result: { success: number; failed: number; errors: string[] }) => void;
  isLoading?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
  errors?: string[];
  fileUrl?: string;
  students?: Student[];
}

const ExcelImportExport: React.FC<ExcelImportExportProps> = ({
  students,
  onImport,
  onImportResult,
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const { templateFileImport } = useStudentDataContext();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const handleOpenImportModal = async () => {
    setIsConfirmOpen(true);
  };

  const handleExportExcel = async () => {
    try {
      const response = await exportExcel();
      if (response && response.url) {
        window.open(response.url, "_blank");
        toast.success("Xuất Excel thành công và đã tải về!");
      } else {
        toast.success("Xuất Excel thành công!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xuất Excel" + error);
    }
  };

  const handleClickImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setSelectedFileName(file.name);
    setSelectedFile(file);
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file trước khi import");
      return;
    }

    try {
      setIsImporting(true);
      
      const checkResult = await checkImportExcel(selectedFile);
      
      if (checkResult.objects.length > 0) {
        setValidationResult({ 
          isValid: true, 
          message: "File Excel hợp lệ và sẵn sàng để import",
          fileUrl: checkResult.file.url,
          students: checkResult.objects
        });
        setIsConfirmOpen(false);
        setIsValidationOpen(true);
      } else {
        setValidationResult({ 
          isValid: false, 
          message: "File Excel không hợp lệ hoặc có lỗi trong dữ liệu",
          errors: ["Dữ liệu không đúng định dạng", "Thiếu thông tin bắt buộc"]
        });
        setIsConfirmOpen(false);
        setIsValidationOpen(true);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra file:", error);
      setValidationResult({ 
        isValid: false, 
        message: "Có lỗi xảy ra khi kiểm tra file Excel",
        errors: ["Không thể đọc file", "File có thể bị hỏng"]
      });
      setIsConfirmOpen(false);
      setIsValidationOpen(true);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveImport = async () => {
    if (!validationResult?.isValid || !validationResult?.fileUrl || !validationResult?.students) {
      toast.error("Thông tin import không hợp lệ");
      return;
    }

    try {
      setIsImporting(true);
      
      const result = await importExcel(validationResult.fileUrl, validationResult.students);
      
      if (result.success > 0) {
        toast.success(`Import thành công ${result.success} sinh viên!`);
        if (result.failed > 0) {
          toast.warning(`${result.failed} sinh viên import thất bại`);
        }
      } else {
        toast.error("Không có sinh viên nào được import thành công");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFileName(null);
      setSelectedFile(null);
      setValidationResult(null);
      setIsValidationOpen(false);
      
      if (onImportResult) {
        onImportResult(result);
      }
      
      onImport([]);
    } catch (error) {
      console.error("Lỗi khi import file:", error);
      toast.error("Có lỗi xảy ra khi import file Excel");
    } finally {
      setIsImporting(false);
    }
  };

  const handleKeyDownExport = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") handleExportExcel();
  };
  
  const handleKeyDownImport = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") handleOpenImportModal();
  };

  const handleRemoveFile = () => {
    setSelectedFileName(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseValidation = () => {
    setIsValidationOpen(false);
    setValidationResult(null);
    setSelectedFileName(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const messageImport = () => (
    <div>
      <div className="mb-2 text-[16px] text-gray-500">
        {templateFileImport ? (
          <>
            Tải file mẫu ở đây:{" "}
            <a
              href={templateFileImport.url}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {templateFileImport.fileName}
            </a>
          </>
        ) : (
          <span className="text-red-500">Không thể tải file mẫu</span>
        )}
      </div>
      {selectedFileName ? (
        <div
          className="flex items-center justify-between w-full mt-6 bg-green-50 rounded-lg px-4 py-2 border border-green-100 shadow-sm"
          tabIndex={0}
          aria-label={`File đã chọn: ${selectedFileName}`}
        >
          <span className="truncate text-gray-800 text-sm flex-1" title={selectedFileName}>
            {selectedFileName}
          </span>
          <FileSpreadsheet className="ml-2 w-5 h-5 text-green-700" />
          <button
            type="button"
            onClick={handleRemoveFile}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleRemoveFile()}
            aria-label="Xóa file đã chọn"
            tabIndex={0}
            className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ) : (
      <button
        onClick={() => {
          handleClickImport();
        }}
        className="border w-full border-dashed border-red-500 rounded-lg flex flex-col items-center justify-center py-10 my-4 cursor-pointer"
      > 
        <div className="disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white text-3xl mb-2">
            +
          </span>
          <span className="text-base text-gray-700">Chọn tệp đính kèm</span>
        </div>
      </button>
      )}
    </div>
  );

  const messageValidation = () => (
    <div>
      {selectedFileName && (
        <div className="mb-4">
          <div className="flex items-center justify-between w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <span className="truncate text-gray-800 text-sm flex-1" title={selectedFileName}>
              {selectedFileName}
            </span>
            <FileSpreadsheet className="ml-2 w-5 h-5 text-gray-600" />
          </div>
        </div>
      )}
      
      <div className={`flex items-start space-x-3 p-4 rounded-lg border ${
        validationResult?.isValid 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        {validationResult?.isValid ? (
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            validationResult?.isValid ? 'text-green-800' : 'text-red-800'
          }`}>
            {validationResult?.message}
          </p>
          {validationResult?.errors && validationResult.errors.length > 0 && (
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
              {validationResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-row gap-4">
      <button
        type="button"
        onClick={handleExportExcel}
        onKeyDown={handleKeyDownExport}
        aria-label="Xuất file Excel"
        tabIndex={0}
        disabled={isLoading || students.length === 0}
        className="flex items-center h-7 px-4 bg-[#4CAF50] text-white rounded-sm font-normal text-xs uppercase tracking-wider shadow hover:bg-[#43a047] focus:outline-none focus:ring-2 focus:ring-[#388e3c] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Download className="h-5 w-5 mr-2" />
        Xuất file Excel
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        disabled={isImporting}
        className="hidden"
        id="excel-import"
      />
        <button
          type="button"
          onClick={() => handleOpenImportModal()}
          onKeyDown={handleKeyDownImport}
          aria-label="Nhập file Excel"
          tabIndex={0}
          disabled={isImporting}
          className="flex items-center h-7 px-4 bg-[#4CAF50] text-white rounded-sm  font-normal text-xs uppercase tracking-wider shadow hover:bg-[#43a047] focus:outline-none focus:ring-2 focus:ring-[#388e3c] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="h-5 w-5 mr-2" />
          {"Nhập file Excel"}
        </button>
      
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Nhập file Excel"
        onConfirm={handleConfirmImport}
        onCancel={() => setIsConfirmOpen(false)}
        message={messageImport()}
        confirmText={'Import'}
        cancelText="Hủy"
        isLoading={isImporting || !selectedFile}
      />

      <ConfirmDialog
        isOpen={isValidationOpen}
        onOpenChange={setIsValidationOpen}
        title="Xác nhận import"
        onConfirm={handleSaveImport}
        onCancel={handleCloseValidation}
        message={messageValidation()}
        confirmText={isImporting ? "Import" : "Lưu"}
        cancelText="Đóng"
        isLoading={isImporting}
        hiddenConfirm={!validationResult?.isValid}
      />
    </div>
  );
};

export default ExcelImportExport;
