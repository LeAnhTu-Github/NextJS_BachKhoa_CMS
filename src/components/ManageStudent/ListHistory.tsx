import React from "react";
import { TermHistory } from "@/types/Student";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface ListHistoryProps {
  historyStudent: TermHistory[];
}   

const ListHistory = ({ historyStudent }: ListHistoryProps) => {
  return (
    <>
      <div className="block sm:hidden space-y-4">
        {historyStudent.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          historyStudent.map((term, idx) => (
            <div
              key={term.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Thông tin sinh viên: ${term.name}`}
            >
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Tên học phần:</span>
                <div className="flex flex-col items-end justify-center gap-1 min-h-[48px]">
                  <span className="font-medium text-xs text-red-700">
                    {term.name || ""}
                  </span>
                  <div className="text-xs font-medium">
                    Mã học phần:{" "}
                    <span className="font-medium text-xs text-red-700">
                      {term.code || ""}
                    </span>
                  </div>
                  <div className="text-xs font-medium">
                    Quy trình học phần:{" "}
                    <span className="font-medium text-xs text-red-700">
                      {" "}
                      {term.status || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm py-1 border-b">
                <span className="font-medium text-gray-600">Thời gian hoàn thành:</span>
                <span className="text-gray-800">
                  {term.workload || ""}   
                </span>
              </div>    
            </div>
          ))
        )}
      </div>
      <div className="w-full hidden sm:block rounded-lg border border-gray-200 bg-white mt-3 overflow-y-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[50px]">
                <span className="text-xs font-semibold text-gray-700">STT</span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                Tên học phần:
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                Mã học phần:
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                Quy trình học phần:
                </span>
              </TableHead>
              <TableHead>
                <span className="text-xs font-semibold text-gray-700">
                Thời gian hoàn thành:
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyStudent.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {historyStudent.map((term, idx) => (
              <TableRow key={term.id} className="hover:bg-gray-50 h-15">
                <TableCell className="text-sm text-gray-700 pl-2">
                  {idx + 1}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start justify-center gap-1 min-h-[48px]">
                    <span className="font-medium text-xs text-red-700">
                      {term.name || ""}
                    </span>
                    <div className="text-xs font-medium">
                      Mã số sinh viên:{" "}
                      <span className="font-medium text-xs text-red-700">
                        {term.code || ""}
                      </span>
                    </div>
                    <div className="text-xs font-medium">
                      Email:{" "}
                      <span className="font-medium text-xs text-red-700">
                        {" "}
                        {term.status || ""}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 pl-2">
                  {term.workload}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </>
  );
};

export default ListHistory;
