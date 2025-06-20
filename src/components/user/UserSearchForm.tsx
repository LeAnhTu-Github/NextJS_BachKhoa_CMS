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
  fullName: z.string().optional(),
  email: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UserSearchFormProps {
  userCount: number;
  onSearch?: (values: FormValues) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
}

const UserSearchForm = ({
  userCount,
  onSearch,
  onRefresh,
  onAdd,
}: UserSearchFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      status: undefined,
    },
  });
  const handleSearch = (values: FormValues) => {  
    onSearch?.(values);
  };

  const handleRefresh = () => {
    form.reset();
    onRefresh?.();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 py-4">
      <div className="flex items-center text-lg font-medium whitespace-nowrap">
        Danh sách người dùng
        <span className="ml-1 text-red-600 font-normal">({userCount})</span>
      </div>

      <div className="w-full flex justify-start xl:justify-end flex-wrap gap-4">
        <form
          onSubmit={form.handleSubmit(handleSearch)}
          className="flex flex-col lg:flex-row gap-4 w-full"
        >
            <div className="flex flex-col md:flex-row gap-4 flex-1 justify-end">
              <Input
                {...form.register("fullName")}
                placeholder="Họ tên"
                className="h-10 w-full lg:max-w-[300px]"
                aria-label="Tìm theo họ tên"
                value={form.watch("fullName")}
              />
              <Input
                {...form.register("email")}
                placeholder="Email"
                className="h-10 w-full lg:max-w-[300px]"
                aria-label="Tìm theo email"
                value={form.watch("email")}
              />
              <Select
                onValueChange={(value) =>
                  form.setValue("status", value as FormValues["status"])
                }
                value={form.watch("status")}
              >
                <SelectTrigger className="h-10 w-full lg:max-w-[300px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
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
                aria-label="Thêm người dùng"
              >
                <Plus className="h-5 w-5 text-white" />
              </Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UserSearchForm;
