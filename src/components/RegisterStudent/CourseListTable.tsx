import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Course } from "@/types/RegisterStudentExam";

interface CourseListTableProps {
  courses: Course[];
  selectedIds: number[];
  onSelect: (id: number) => void;
  onSelectAll: () => void;
}

const CourseListTable = ({ courses, selectedIds, onSelect, onSelectAll }: CourseListTableProps) => {
  const allSelected = courses.length > 0 && courses.every((c) => selectedIds.includes(c.id));

  return (
    <>
      {/* Mobile View */}
      <div className="block sm:hidden space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          courses.map((course, idx) => (
            <div
              key={course.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Học phần: ${course.name}`}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
                <Checkbox
                  checked={selectedIds.includes(course.id)}
                  onChange={() => onSelect(course.id)}
                  tabIndex={0}
                  aria-label={`Chọn học phần ${course.name}`}
                />
              </div>
              <div className="flex justify-between text-sm border-b py-1">
                <span className="font-medium text-gray-600">Mã học phần:</span>
                <span className="text-gray-800">{course.code}</span>
              </div>
              <div className="flex justify-between text-sm border-b py-1">
                <span className="font-medium text-gray-600">Tên học phần:</span>
                <span className="text-gray-800">{course.name}</span>
              </div>
              <div className="flex justify-between text-sm border-b py-1">
                <span className="font-medium text-gray-600">Định mức:</span>
                <span className="text-gray-800">{course.fromTime}</span>
              </div>
              <div className="flex justify-between text-sm border-b py-1">
                <span className="font-medium text-gray-600">Số tín chỉ học phí:</span>
                <span className="text-gray-800">{course.revenueName}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="font-medium text-gray-600">Thành tiền:</span>
                <span className="text-gray-800">{course.codeFee?.toLocaleString() || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Desktop View */}
      <div className="hidden sm:block mt-3 w-full rounded-lg border border-gray-200 bg-white overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  onChange={onSelectAll}
                  tabIndex={0}
                  aria-label="Chọn tất cả học phần"
                />
              </TableHead>
              <TableHead>STT</TableHead>
              <TableHead>Mã học phần</TableHead>
              <TableHead>Tên học phần</TableHead>
              <TableHead>Định mức</TableHead>
              <TableHead>Số tín chỉ học phí</TableHead>
              <TableHead>Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course, idx) => (
                <TableRow key={course.id} className="hover:bg-gray-50">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(course.id)}
                      onChange={() => onSelect(course.id)}
                      tabIndex={0}
                      aria-label={`Chọn học phần ${course.name}`}
                      className="w-4 h-4 accent-red-600"
                    />
                  </TableCell>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.fromTime}</TableCell>
                  <TableCell>{course.revenueName}</TableCell>
                  <TableCell>{course.codeFee?.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CourseListTable; 