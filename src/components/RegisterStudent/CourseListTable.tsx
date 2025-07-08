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
import { Student, TermHistory } from "@/types/Student";
import { EstimationFeeDto } from "@/types/Decision";

interface CourseListTableProps {
  termResponse: TermHistory | null;
  estimation: EstimationFeeDto | null;
  selectedStudent: Student | null;
  selectedIds: number[];
  onSelect: (termIds: number[]) => void;
  setTotalFee: (totalFee: number) => void;
}

interface SelectItem {
  term: TermHistory;
  estimation: EstimationFeeDto;
}

const CourseListTable = ({
  selectedStudent,
  setTotalFee,
  termResponse,
  estimation,
  selectedIds,
  onSelect,
}: CourseListTableProps) => {
  if (!termResponse || !estimation) return null;
  
  const result: SelectItem[] = [
    {
      term: termResponse,
      estimation: estimation,
    },
  ];

  const isItemSelected = (termId: number) => {
    return selectedIds.includes(termId);
  };

  const isAllSelected = result.length > 0 && result.every((item) => isItemSelected(item.term.id));
  console.log(11111,selectedStudent);
  const handleSelect = (item: SelectItem) => {
    const termId = item.term.id;
    const newSelectedIds = isItemSelected(termId)
      ? selectedIds.filter(id => id !== termId)
      : [...selectedIds, termId];
    
    onSelect(newSelectedIds);
    
    const totalFee = newSelectedIds.reduce((sum, id) => {
      const selectedItem = result.find(item => item.term.id === id);
      return sum + ((selectedItem?.estimation.fee || 0) * (selectedItem?.term.creditTraining || 0));
    }, 0);
    setTotalFee(totalFee);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelect([]);
      setTotalFee(0);
    } else {
      const allTermIds = result.map(item => item.term.id);
      onSelect(allTermIds);
      
      const totalFee = result.reduce((sum, item) => {
        return sum + ((item.estimation.fee || 0) * (item.term.creditTraining || 0));
      }, 0);
      setTotalFee(totalFee);
    }
  };

  return (
    <>
      <div className="block sm:hidden space-y-4">
        {result.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-white">
            Không có dữ liệu
          </div>
        ) : (
          result.map((item, idx) => (
            <div
              key={item.term.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2 overflow-auto"
              tabIndex={0}
              aria-label={`Học phần: ${item.term.name}`}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <Checkbox
                  checked={isItemSelected(item.term.id)}
                  onCheckedChange={() => handleSelect(item)}
                  tabIndex={0}
                  aria-label={`Chọn học phần ${item.term.name}`}
                />
                <span className="font-medium text-gray-600">STT</span>
                <span className="text-gray-800">{idx + 1}</span>
              </div>
              <div className="flex justify-between text-sm border-b py-1">
                <span className="font-medium text-gray-600">Mã học phần:</span>
                <span className="text-gray-800">{item.term.code}</span>
              </div>
              <div className="flex justify-between text-sm border-b py-1">
                <span className="font-medium text-gray-600">Tên học phần:</span>
                <span className="text-gray-800">{item.term.name}</span>
              </div>
              <div className="flex justify-between text-sm border-b py-1">
                <span className="font-medium text-gray-600">Định mức:</span>
                <span className="text-gray-800">{item.estimation.fee}</span>
              </div>
              <div className="flex justify-between text-sm border-b py-1">
                <span className="font-medium text-gray-600">
                  Số tín chỉ học phí:
                </span>
                <span className="text-gray-800">{item.term.creditTraining}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="font-medium text-gray-600">Thành tiền:</span>
                <span className="text-gray-800">
                  {(item.estimation.fee || 0) * (item.term.creditTraining || 0)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="hidden sm:block mt-3 w-full rounded-lg border border-gray-200 bg-white overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[50px] flex items-center justify-center">
                <Checkbox
                  className="bg-white data-[state=checked]:bg-redberry data-[state=checked]:border-none"
                  aria-label="Chọn tất cả"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
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
            {result.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              result.map((item, idx) => (
                <TableRow key={item.term.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      className="data-[state=checked]:bg-redberry data-[state=checked]:border-none"
                      aria-label={`Chọn ${item.term.name}`}
                      checked={isItemSelected(item.term.id)}
                      onCheckedChange={() => handleSelect(item)}
                    />
                  </TableCell>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{item.term.code}</TableCell>
                  <TableCell>{item.term.name}</TableCell>
                  <TableCell>{item.estimation.fee}</TableCell>
                  <TableCell>{item.term.creditTraining}</TableCell>
                  <TableCell>
                    {(item.estimation.fee || 0) * (item.term.creditTraining || 0)}
                  </TableCell>
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
