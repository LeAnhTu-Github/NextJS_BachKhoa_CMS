import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, Plus } from "lucide-react";

const formSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EmailSearchFormProps {
  emailCount: number;
  onSearch?: (values: FormValues) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
}

const EmailSearchForm = ({
  emailCount,
  onSearch,
  onRefresh,
  onAdd,
}: EmailSearchFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      status: undefined,
    },
  });
  const handleSearch = (values: FormValues) => {  
    onSearch?.(values);
  };

  const handleRefresh = () => {
    form.reset({
        search: "",
        status: undefined,
    });
    onRefresh?.();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 py-4">
      <div className="flex items-center text-lg font-medium whitespace-nowrap">
        Danh sách cấu hình email
        <span className="ml-1 text-red-600 font-normal">({emailCount})</span>
      </div>

      <div className="w-full flex justify-start xl:justify-end flex-wrap gap-4">
        <form
          onSubmit={form.handleSubmit(handleSearch)}
          className="flex flex-col lg:flex-row gap-4 w-full"
        >
            <div className="flex flex-col md:flex-row gap-4 flex-1 justify-end">
              <Input
                {...form.register("search")}
                placeholder="Tìm kiếm"
                className="h-10 w-full lg:max-w-[300px]"
                aria-label="Tìm theo tên"
                value={form.watch("search")}
              />
              <Select
                onValueChange={(value) =>
                  form.setValue("status", value as FormValues["status"])
                }
                value={form.watch("status") || ""}
              >
                <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Kích hoạt</SelectItem>
                  <SelectItem value="INACTIVE">Chưa kích hoạt</SelectItem>
                </SelectContent>
              </Select>
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
                aria-label="Thêm cấu hình email"
              >
                <Plus className="h-5 w-5 text-white" />
              </Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EmailSearchForm;
