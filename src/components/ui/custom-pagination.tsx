import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  setTotalPages: (total: number) => void;
  availablePageSizes?: number[];
}

const PAGE_SIZES = [10, 20, 50, 100, 200, 500, 1000];

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  setTotalPages,
  availablePageSizes = PAGE_SIZES,
}) => {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputPage(value ? Math.max(1, Math.min(Number(value), totalPages)) : 1);
  };

  const handleGo = () => {
    if (
      inputPage !== currentPage &&
      inputPage >= 1 &&
      inputPage <= totalPages
    ) {
      onPageChange(inputPage);
      setTotalPages(inputPage);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGo();
    }
  };

  if (totalPages < 1) return null;

  return (
    <div className="flex items-center justify-center lg:justify-end gap-3 mt-4 flex-wrap">
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-2">
          {/* <span className="text-sm text-gray-500 mb-[-2px] ml-2">Bản ghi</span> */}
          <Select
            value={pageSize.toString()}
            onValueChange={(val) => onPageSizeChange(Number(val))}
          >
            <SelectTrigger
              className="w-[90px] h-9 border rounded-md focus:ring-2 focus:ring-primary"
              aria-label="Chọn số bản ghi mỗi trang"
              tabIndex={0}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availablePageSizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {/* <span className="text-sm text-gray-500 mb-[-2px] ml-2">Trang</span> */}
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={inputPage}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-[60px] h-9 border rounded-md text-center focus:ring-2 focus:ring-primary"
            aria-label="Nhập số trang"
            tabIndex={0}
          />
        </div>
        <Button
          onClick={handleGo}
          className="h-9 w-16 px-4 bg-[#A3242B] hover:bg-[#8a1d23] text-white font-semibold rounded-md"
          aria-label="Đi đến trang"
          tabIndex={0}
        >
          Đi
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 bg-white border shadow-sm text-gray-500 hover:bg-gray-100 aria-disabled:opacity-50"
          aria-label="Trang trước"
          tabIndex={0}
          variant="outline"
        >
          <ChevronLeft size={24} />
        </Button>
        <div
          className="h-8 w-8 flex items-center justify-center bg-[#A3242B] text-white font-semibold rounded-md shadow"
          aria-label={`Trang hiện tại: ${currentPage}`}
          tabIndex={0}
        >
          {currentPage}
        </div>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 bg-white border shadow-sm text-gray-500 hover:bg-gray-100 aria-disabled:opacity-50"
          aria-label="Trang sau"
          tabIndex={0}
          variant="outline"
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;
