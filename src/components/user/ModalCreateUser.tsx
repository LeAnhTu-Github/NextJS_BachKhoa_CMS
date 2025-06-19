import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import NextImage from "next/image";
import { imageTypes } from "@/types/Image";
import { Group } from "@/types/User";
import api from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader   } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  avatar: z.string().nullable(),
  fullName: z.string().min(1, { message: "Vui lòng nhập Họ & tên" }),
  password: z.string().min(1, { message: "Vui lòng nhập Mật khẩu" }),
  email: z.string().email({ message: "Vui lòng nhập Email" }),
  phone: z.string().min(1, { message: "Vui lòng nhập Số điện thoại" }),
  position: z.string().min(1, { message: "Vui lòng chọn Chức vụ" }),
  status: z.string().min(1, { message: "Vui lòng chọn Trạng thái" }),
  groupIds: z.array(z.number()).min(1, { message: "Vui lòng chọn Nhóm người dùng" }),
});

type FormValues = z.infer<typeof formSchema>;

type ModalCreateUserProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
};

const ModalCreateUser: React.FC<ModalCreateUserProps> = ({
  open,
  onOpenChange,
  onRefresh,
}) => {
  const [image, setImage] = useState<imageTypes | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: null,
      fullName: "",
      password: "",
      email: "",
      phone: "",
      position: "",
      status: "ACTIVE",
      groupIds: [],
    },
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/file/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { data, error } = response.data;
      
      if (error.code === 0) {
        setImage({
          requestId: response.data.requestId,
          at: response.data.at,
          data: {
            url: data.url,
            name: data.name,
            ext: data.ext
          },
          error: {
            code: error.code,
            message: error.message
          }
        });
        setValue("avatar", data.url, { shouldValidate: true });
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      setImage(null);
      setValue("avatar", "", { shouldValidate: true });
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchGroups = async () => {
    const response = await api.get('/auth/group');
    const { data, error } = response.data;
    if (error.code === 0) {
      setGroups(data);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleRemoveImage = () => setImage(null);

    const handleGroupChange = (value: number) => {
    const currentGroups = watch("groupIds") || [];
    const newGroups = currentGroups.includes(value)
      ? currentGroups.filter((id) => id !== value)
      : [...currentGroups, value];
    setValue("groupIds", newGroups, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/user', data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Thêm người dùng thành công");
        onOpenChange(false);
        onRefresh();
      } else {
        toast.error("Có lỗi xảy ra khi thêm người dùng");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi thêm người dùng");
      } else {
        toast.error("Có lỗi xảy ra khi thêm người dùng");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-[90vw] p-0 rounded-lg border-none sm:w-[80vw] sm:max-w-[80vw] md:w-[70vw] md:max-w-[70vw] lg:w-[1000px] lg:max-w-[1000px] overflow-auto"
      >
        <div className="flex flex-col w-full h-full">
          <DialogHeader className="bg-[#A52834] border-none rounded-t-lg px-8 py-4">
            <DialogTitle className="text-white text-2xl font-semibold">
              Thêm người dùng
            </DialogTitle>
            <DialogClose
              className="absolute right-6 top-3 text-white text-2xl"
              aria-label="Đóng"
              tabIndex={0}
              onClick={() => {
                reset();
              }}
            >
              ×
            </DialogClose>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <div className={`flex flex-col lg:flex-row bg-white px-8 py-4 gap-4 lg:gap-8 flex-1`}>
              <div className={`w-full lg:w-1/3 flex flex-col items-center justify-center gap-4`}>
                {!image ? (
                  <div className={`w-full flex flex-col items-center justify-center bg-red-50 rounded-lg cursor-pointer transition hover:bg-red-100 ${isMobile ? 'h-36' : 'h-72'}`}>
                    <Label
                      htmlFor="avatar"
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                      tabIndex={0}
                      aria-label="Tải ảnh lên"
                    >
                      <Input
                        id="avatar"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                      <NextImage
                        src="/images/camera.png"
                        alt="Upload icon"
                        width={60}
                        height={60}
                        priority
                      />
                      <span className="text-gray-600 text-lg font-medium">
                        {isUploading ? "Đang tải lên..." : "Tải ảnh lên"}
                      </span>
                    </Label>
                  </div>
                ) : (
                  <div className={`relative w-full ${isMobile ? 'h-36' : 'h-72'}`}>
                    <NextImage
                      src={image.data.url || ""}
                      alt="User avatar"
                      width={288}
                      height={288}    
                      className={`rounded-lg w-full object-cover ${isMobile ? 'h-36' : 'h-72'}`}
                      priority
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      aria-label="Xóa ảnh"
                      tabIndex={0}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <form id="create-user-form" className={`w-full lg:w-2/3 flex flex-col gap-4`} onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="fullName">Họ & tên <span className="text-redberry">(*)</span></Label>
                    <Input
                      id="fullName"
                      className={`h-10 w-full  ${errors.fullName ? "border-red-500" : ""}`}
                      placeholder="Họ & tên"
                      aria-label="Họ & tên"
                      tabIndex={0}
                      {...register("fullName", { required: "Vui lòng nhập Họ & tên" })}
                      value={watch("fullName")}
                    />
                    <div className="flex h-3">
                      {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="password">Mật khẩu <span className="text-redberry">(*)</span></Label>
                    <div className="relative">
                      <Input
                        id="password"
                        className={`h-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        placeholder="Mật khẩu"
                        aria-label="Mật khẩu"
                        size={isMobile ? 10 : 12}
                        type={showPassword ? "text" : "password"}
                        tabIndex={0}
                        {...register("password", { required: "Vui lòng nhập Mật khẩu" })}
                        value={watch("password")}
                      />
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                        tabIndex={0}
                        aria-label="Hiện mật khẩu"
                        onClick={handleShowPassword}
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex h-3">
                      {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="email">Email <span className="text-redberry">(*)</span></Label>
                    <Input
                      id="email"
                      className={`h-10 ${errors.email ? "border-red-500" : ""}`}
                      placeholder="Email"
                      aria-label="Email"
                      tabIndex={0}
                      {...register("email", { required: "Vui lòng nhập Email" })}
                      value={watch("email")}
                    />
                    <div className="flex h-3">
                      {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="phone">Số điện thoại <span className="text-redberry">(*)</span></Label>
                    <Input
                      id="phone"
                      className={`h-10 ${errors.phone ? "border-red-500" : ""}`}
                      placeholder="Số điện thoại"
                      aria-label="Số điện thoại"
                      tabIndex={0}
                      {...register("phone", { required: "Vui lòng nhập Số điện thoại" })}
                      value={watch("phone")}
                    />
                    <div className="flex h-3">
                      {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="position">Chức vụ <span className="text-redberry">(*)</span></Label>
                    <Input
                      id="position"
                      className={`h-10 ${errors.position ? "border-red-500" : ""}`}
                      placeholder="Chức vụ"
                      aria-label="Chức vụ"
                      tabIndex={0}
                      {...register("position", { required: "Vui lòng chọn Chức vụ" })}
                      value={watch("position")}
                    />
                    <div className="flex h-3">
                      {errors.position && <span className="text-red-500 text-sm">{errors.position.message}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="status">Trạng thái <span className="text-redberry">(*)</span></Label>
                    <Select
                      value={watch("status")}
                      onValueChange={(value) => setValue("status", value, { shouldValidate: true })}
                    >
                      <SelectTrigger id="status" className={`w-full h-10 ${errors.status ? "border-red-500" : ""}`} aria-label="Trạng thái" tabIndex={0}> 
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="text-[#A2212B] caret-[#A2212B]" value="ACTIVE">Kích hoạt</SelectItem>
                        <SelectItem className="text-[#A2212B] caret-[#A2212B]" value="INACTIVE">Chưa kích hoạt</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex h-3">
                      {errors.status && <span className="text-red-500 text-sm">{errors.status.message}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="groupIds">Nhóm người dùng <span className="text-redberry">(*)</span></Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="border border-gray-300 rounded-lg">
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-10 ${errors.groupIds ? "border-red-500" : ""}`}
                      >
                        {watch("groupIds")?.length > 0
                          ? `${watch("groupIds").map((group) => groups.find((g) => g.id === group)?.groupName).join(", ")}`
                          : "Chọn nhóm người dùng"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
                      align="start"
                    >
                      {groups.map((group) => (
                        <div
                          key={group.id}
                          className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent"
                        >
                          <Checkbox
                            id={group.id.toString()}
                            checked={watch("groupIds")?.includes(group.id)}
                            onCheckedChange={() => handleGroupChange(group.id )}
                          />
                          <label
                            htmlFor={group.id.toString()}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {group.groupName}
                          </label>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex h-3">
                    {errors.groupIds && <span className="text-red-500 text-sm">Vui lòng chọn Nhóm người dùng</span>}
                  </div>
                </div>
              </form>
            </div>
          </div>
          <hr />
          <DialogFooter className="flex flex-row justify-end gap-2 bg-white px-8 py-4 rounded-b-xl">
            <DialogClose
              className="max-w-[100px] h-9 px-2 py-2 rounded bg-white border border-[#A52834] text-[#A52834] font-semibold hover:bg-[#F8D7DA] transition flex items-center gap-2"
              aria-label="Đóng"
              tabIndex={0}
              onClick={() => {
                reset();
              }}
            >
              Đóng
              <i className="mdi mdi-close text-xs"></i>
            </DialogClose>
            <button
              type="submit"
              form="create-user-form"
              className="max-w-[100px] h-9 px-2 py-2 rounded bg-[#A52834] text-white font-semibold hover:bg-[#7C1C25] transition flex items-center gap-2"
              aria-label="Lưu"
              tabIndex={0}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Lưu
                  <Loader className="w-4 h-4 animate-spin ml-2" />
                </>
              ) : (
                <>
                  Lưu
                  <i className="mdi mdi-content-save-outline text-xs"></i>
                </>
              )}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateUser;
