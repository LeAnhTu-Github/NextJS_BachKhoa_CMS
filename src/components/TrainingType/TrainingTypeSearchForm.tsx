import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, Plus } from "lucide-react";
import { TRAINING_STATUS_OPTIONS } from "@/types/TrainingType";

const formSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
});
import { Input } from "../ui/input";
export type FormValues = z.infer<typeof formSchema>;

interface TrainingTypeSearchFormProps {
  trainingCount: number;
  onSearch?: (values: FormValues) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  initialValues?: FormValues;
}

const TrainingTypeSearchForm = ({
  trainingCount,
  onSearch,
  onRefresh,
  onAdd,
  initialValues,
}: TrainingTypeSearchFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      search: undefined,
      status: undefined,
    },
  });
  useEffect(() => {
    if (initialValues) {
      form.reset({
        search: initialValues.search,
        status: initialValues.status,
      });
    }
  }, [initialValues, form]);

  const handleSearch = (values: FormValues) => {
    onSearch?.(values);
  };

  const handleRefresh = () => {
    form.reset({
      search: undefined,
      status: undefined,
    });
    onRefresh?.();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 py-4">
    <div className="flex items-center text-lg font-medium whitespace-nowrap">
      Danh sách người dùng
      <span className="ml-1 text-red-600 font-normal">({trainingCount})</span>
    </div>

    <div className="w-full flex justify-start xl:justify-end flex-wrap gap-4">
      <form
        onSubmit={form.handleSubmit(handleSearch)}
        className="flex flex-col xl:flex-row gap-4 w-full"
      >
        <div className="flex flex-col md:flex-row gap-4 flex-1 justify-end">
            <Controller
              name="search"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Tìm kiếm"
                  className="h-10 w-full lg:max-w-[300px]"
                  aria-label="Tìm theo mã, tên"
                />
              )}
            />
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                    <SelectValue placeholder="Trạng thái" defaultValue={""} />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAINING_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="h-10 w-10"
              aria-label="Làm mới"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 bg-[#A2212B]"
              aria-label="Tìm kiếm"
            >
              <Search className="h-5 w-5 text-white" />
            </Button>
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 bg-[#A2212B]"
              onClick={onAdd}
              aria-label="Thêm định mức"
            >
              <Plus className="h-5 w-5 text-white" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TrainingTypeSearchForm;
