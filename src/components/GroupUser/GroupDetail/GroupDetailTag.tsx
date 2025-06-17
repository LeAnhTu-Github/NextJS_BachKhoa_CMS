import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GroupResponse } from "@/types/GroupReponse";
import TablePageRole from "./TablePageRole";
import { PageRole } from "@/types/pageRole";
import TableRole from "./TableRole";
import axios from "axios";
import api from "@/services/api";
import { toast } from "sonner";

interface GroupDetailTagProps {
  groupDetail: GroupResponse | null;
}
interface GroupFormData {
  groupName: string;
  description: string;
}
export interface RoleData {
  pageId: number;
  id: number;
  roleName: string;
}

const GroupDetailTag = ({ groupDetail }: GroupDetailTagProps) => {
  const [formData, setFormData] = useState<GroupFormData>({
    groupName: "",
    description: "",
  });
  const [listSelected, setListSelected] = useState<PageRole[]>([]);
  const [listRoleSelected, setListRoleSelected] = useState<RoleData[]>([]);
  const [pageRoleSelected, setPageRoleSelected] = useState<PageRole>();
  const [selectedRoles, setSelectedRoles] = useState<RoleData[]>([]);
  const [errors, setErrors] = useState<Partial<GroupFormData>>({});

  useEffect(() => {
    if (groupDetail) {
      setFormData({
        groupName: groupDetail.group.groupName || "",
        description: groupDetail.group.description || "",
      });
      setListSelected(groupDetail.pageRoles);
    }
  }, [groupDetail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id as keyof GroupFormData]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleRoleSelection = (roles: RoleData[]) => {
    setSelectedRoles(roles);
  };

  const handlePageSelection = (page: PageRole, isSelected: boolean) => {
    if (isSelected) {
      const pageRoles = listRoleSelected.filter(role => role.pageId === page.id);
      console.log(1111111,pageRoles)
      setSelectedRoles(prev => [...prev, ...pageRoles]);
    } else {
      setSelectedRoles(prev => prev.filter(role => role.pageId !== page.id));
    }
  };

  const handleUpdate = async () => {
    try {
      if (!groupDetail?.group.id) {
        toast.error("Không tìm thấy ID nhóm");
        return;
      }
      const rolesString = selectedRoles
        .map(role => `${role.pageId}-${role.id}`)
        .join(",");

      const payload = {
        group: {
          groupName: formData.groupName,
          groupId: groupDetail.group.id,
          description: formData.description,
          status: 1,
          groupPage: rolesString,
        },
      };

      const response = await api.put(
        `/auth/group/${groupDetail.group.id}`,
        payload
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Cập nhật nhóm thành công");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Có lỗi xảy ra khi cập nhật nhóm");
    }
  };

  if (!groupDetail) {
    return (
      <div className="w-full lg:w-2/3 flex flex-col bg-background rounded-lg border border-gray-200 justify-center items-center p-6">
        <p className="text-muted-foreground">
          Vui lòng chọn một nhóm để xem chi tiết
        </p>
      </div>
    );
  }
  return (
    <div className="w-full lg:w-2/3 flex flex-col border border-gray-200 bg-background rounded-lg p-3">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="flex w-full p-0 rounded-none">
          <TabsTrigger
            value="info"
            className=""
            tabIndex={0}
            aria-label="Thông tin nhóm"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.currentTarget.click();
            }}
          >
            Thông Tin Nhóm
          </TabsTrigger>
          <TabsTrigger
            value="accounts"
            className=""
            aria-label="Tài khoản nhóm"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.currentTarget.click();
            }}
          >
            Tài Khoản Nhóm
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-6">
          <div className="p-3 rounded-none h-15 flex justify-end gap-4">
            <Button
              variant="outline"
              size="sm"
              className="w-22 h-9 text-white bg-[#F44336] hover:bg-[#F44336]/90 hover:text-white rounded-[3px]"
            >
              Xóa
              <TrashIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-22 text-white bg-[#A2122B] hover:bg-[#A2122B]/90 hover:text-white rounded-[3px]"
              onClick={handleUpdate}
            >
              Lưu
              <SaveIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-10 p-3">
            <div className="w-full flex flex-col gap-2">
              <Input
                id="groupName"
                type="text"
                placeholder="Nhập tên nhóm (*)"
                required
                tabIndex={0}
                className="w-full h-10 rounded-sm"
                value={formData.groupName}
                onChange={handleInputChange}
                aria-invalid={!!errors.groupName}
              />
              {errors.groupName && (
                <p className="text-red-500 text-sm">{errors.groupName}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <Input
                id="description"
                placeholder="Nhập mô tả (*)"
                tabIndex={0}
                className="w-full h-10 rounded-sm"
                value={formData.description}
                onChange={handleInputChange}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 p-3">
            <div className="w-full md:w-1/2 h-full">
              <TablePageRole 
                listSelected={listSelected} 
                onSetListRoleSelected={setListRoleSelected} 
                onSetPageRoleSelected={setPageRoleSelected}
                selectedRoles={selectedRoles}
                onPageSelection={handlePageSelection}
              />
            </div>
            <div className="w-1/2 h-full">
              <TableRole 
                listSelected={listSelected}
                listRoleSelected={listRoleSelected}
                pageRoleSelected={pageRoleSelected}
                selectedRoles={selectedRoles}
                onRoleSelection={handleRoleSelection}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="accounts" className="mt-6">
          <Card className="p-6">
            <p className="text-muted-foreground">
              Danh sách tài khoản trong nhóm sẽ được hiển thị ở đây
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetailTag;
