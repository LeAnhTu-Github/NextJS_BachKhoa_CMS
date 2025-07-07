import React from "react";
import {
  RegisterStudentExam,
} from "@/types/RegisterStudentExam";
import ConfirmDialog from "../ui/confirm-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ModalTableScoreProps {
  isOpen: boolean;
  onClose: () => void;
  registerStudent: RegisterStudentExam;
}
const ModalTableScore = ({
  isOpen,
  onClose,
  registerStudent = {} as RegisterStudentExam,
}: ModalTableScoreProps) => {
  const messageDetail = () => {
    return (
      <div className="px-2 flex flex-col">
        <div className="flex flex-col gap-2">
            <div className="block sm:hidden space-y-4">
              {registerStudent.registerStudentTerms.length === 0 ? (
                <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
                  Không có dữ liệu
                </div>
              ) : (
                registerStudent.registerStudentTerms.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
                    tabIndex={0}
                    aria-label={`Học phần: ${item.term.name}`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-2">
                      <span className="font-medium text-gray-600">STT</span>
                      <span className="text-gray-800">{idx + 1}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b py-1">
                      <span className="font-medium text-gray-600">
                        Hội đồng bảo vệ:
                      </span>
                      <span className="text-gray-800">{item.exam.name}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b py-1">
                      <span className="font-medium text-gray-600">
                        Học phần:
                      </span>
                      <span className="text-gray-800">{item.term.name}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b py-1">
                      <span className="font-medium text-gray-600">
                        Điểm:
                      </span>
                      <span className="text-gray-800">
                        {item.feeDecision}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b py-1">
                      <span className="font-medium text-gray-600">
                        Ghi chú:
                      </span>
                      <span className="text-gray-800">{item.examSession?.classroom}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="font-medium text-gray-600">
                        Trạng thái:
                      </span>
                      <span className="text-gray-800">{item.examSession?.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="hidden sm:block mt-3 w-full rounded-lg border border-gray-200 bg-white overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Hội đồng bảo vệ</TableHead>
                    <TableHead>Học phần</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>Ghi chú</TableHead>

                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registerStudent.registerStudentTerms.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-6 text-gray-500"
                      >
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    registerStudent.registerStudentTerms.map((item, idx) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{item.exam.name}</TableCell>
                        <TableCell>{item.term.name}</TableCell>
                        <TableCell>{item.feeDecision}</TableCell>
                        <TableCell>{item.examSession?.classroom}</TableCell>
                        <TableCell>{item.examSession?.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
        </div>
      </div>
    );
  };
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={onClose}
      title="Bảng điểm"
      large={true}
      hiddenConfirm={true}
      onConfirm={() => {}}
      message={messageDetail()}
    />
  );
};

export default ModalTableScore;
