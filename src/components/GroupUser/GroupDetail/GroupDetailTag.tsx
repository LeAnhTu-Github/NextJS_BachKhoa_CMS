import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableAccount from "../Account/TableAccount";
import { Button } from "@/components/ui/button";
import { Loader, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { GroupResponse } from "@/types/GroupReponse";
import TablePageRole from "./TablePageRole";
import { PageRole, RoleData } from "@/types/pageRole";
import TableRole from "./TableRole";
import { deleteGroup, updateGroup } from "@/services/groupService";
import { toast } from "sonner";
import MessageAccount from "../Account/MessageAccount";
import { updateListUser } from "@/services/groupService";

interface GroupDetailTagProps {
  groupDetail: GroupResponse | null;
  refreshGroupList: () => void;
}

interface GroupFormData {
  groupName: string;
  description: string;
}

const GroupDetailTag = ({
  groupDetail,
  refreshGroupList,
}: GroupDetailTagProps) => {
  const [formData, setFormData] = useState<GroupFormData>({
    groupName: "",
    description: "",
  });
  const [listSelected, setListSelected] = useState<PageRole[]>([]);
  const [listRole, setListRole] = useState<RoleData[]>([]);
  const [pageRoleSelected, setPageRoleSelected] = useState<PageRole>();
  const [selectedRoles, setSelectedRoles] = useState<RoleData[]>([]);
  const [errors, setErrors] = useState<Partial<GroupFormData>>({});
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [isOpenDialogAccount, setIsOpenDialogAccount] = useState(false);
  const [listAccountSelected, setListAccountSelected] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (groupDetail) {
      setFormData({
        groupName: groupDetail.group.groupName || "",
        description: groupDetail.group.description || "",
      });

      setListSelected(groupDetail.pageRoles);
      setSelectedRoles([]);
      const initialSelectedRoles = groupDetail.pageRoles.flatMap((page) =>
        page.roleId
          ? [
              {
                pageId: page.id,
                id: page.roleId,
                roleName:
                  listRole.find((r) => r.id === page.roleId)?.roleName || "",
              },
            ]
          : []
      );
      setSelectedRoles(initialSelectedRoles);
    }
  }, [groupDetail, listRole, listSelected]);
 
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

  const handleOpenDialogDelete = () => {
    setIsOpenDialogDelete(!isOpenDialogDelete);
  };

  const handleOpenDialogAccount = () => {
    setIsOpenDialogAccount(!isOpenDialogAccount);
  };

  const comfirmDeleteGroup = async () => {
    try {
      if (!groupDetail?.group.id) {
        toast.error("Không tìm thấy ID nhóm");
        return;
      }
      await deleteGroup(groupDetail.group.id);
      toast.success("Xóa nhóm thành công");
      refreshGroupList();
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Có lỗi xảy ra khi xóa nhóm");
    }
    setIsOpenDialogDelete(false);
  };
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      if (!groupDetail?.group.id) {
        toast.error("Không tìm thấy ID nhóm");
        return;
      }
      const rolesString = selectedRoles
        .map((role) => `${role.pageId}-${role.id}`)
        .join(",");
      const payload = {
        groupName: formData.groupName,
        groupId: groupDetail.group.id,
        description: formData.description,
        status: 1,
        groupPage: rolesString,
      };

      await updateGroup(groupDetail.group.id, payload);
      toast.success("Cập nhật nhóm thành công");
      // setListRole([]);
      refreshGroupList();
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Có lỗi xảy ra khi cập nhật nhóm");
    } finally {
      setIsLoading(false);
    }
  };


  const handleRoleSelection = (roles: RoleData[]) => {
    setSelectedRoles(roles);
    listSelected.forEach((page) => {
      const hasRole = roles.some((role) => role.pageId === page.id);
      if (!hasRole) {
        handlePageSelection(page, false);
      }
    });
  };
  const handlePageSelection = (page: PageRole, isSelected: boolean) => {
    if (isSelected) {
      const pageRoles = listRole.filter((role) => role.pageId === page.id);
      const newSelectedRoles = [...selectedRoles];
      pageRoles.forEach((role) => {
        if (!newSelectedRoles.some((r) => r.id === role.id)) {
          newSelectedRoles.push(role);
        }
      });
      setSelectedRoles(newSelectedRoles);
    } else {
      setSelectedRoles((prev) =>
        prev.filter((role) => role.pageId !== page.id)
      );
    }
  };
  const handleConfirmAccount = async () => {
    try {
      if (!groupDetail?.group.id) {
        toast.error("Không tìm thấy ID nhóm");
        return;
      }
      await updateListUser(groupDetail.group.id, listAccountSelected);
      toast.success("Cập nhật danh sách tài khoản thành công");
      refreshGroupList();
    } catch (error) {
      console.error("Error updating list user:", error);
      toast.error("Có lỗi xảy ra khi cập nhật danh sách tài khoản");
    }
    setIsOpenDialogAccount(false);
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
              onClick={handleOpenDialogDelete}
            >
              Xóa
              <TrashIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-22 text-white bg-redberry hover:bg-redberry/90 hover:text-white rounded-[3px]"
              onClick={handleUpdate}
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
                maxWidthClass="lg:max-w-[100%]"
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
                maxWidthClass="lg:max-w-[100%]"
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
                onSetListRole={setListRole}
                onSetPageRoleSelected={setPageRoleSelected}
                selectedRoles={selectedRoles}
                onPageSelection={handlePageSelection}
                setSelectedRoles={setSelectedRoles}
              />
            </div>
            <div className="w-full md:w-1/2 h-full">
              <TableRole
                listSelected={listSelected}
                listRole={listRole}
                pageRoleSelected={pageRoleSelected}
                selectedRoles={selectedRoles}
                onRoleSelection={handleRoleSelection}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="accounts" className="mt-6">
          <div className="p-3 rounded-none h-16 flex gap-4 px-4 py-1">
            <div className="w-full flex gap-2 h-full">
              <div className="w-[50%] h-full flex items-center justify-start gap-1 truncate">
                Danh sách người dùng
                <span className="text-lg text-redberry">{`(${groupDetail.users.length})`}</span>
                <div className="border-r border-gray-200 h-[80%] flex items-center pl-4"></div>
              </div>
              <div className="w-[50%] h-full flex items-center justify-end gap-1">
                <Button
                  onClick={handleOpenDialogAccount}
                  variant="outline"
                  size="sm"
                  className="min-w-16 text-sm px-4 flex flex-row items-center gap-2 shadow-lg bg-redberry text-white h-9 hover:bg-[#A84B52] hover:text-white"
                >
                  Cập Nhật Danh Sách Tài Khoản
                </Button>
              </div>
            </div>
          </div>
          <TableAccount groupDetail={groupDetail} />
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        isOpen={isOpenDialogDelete}
        onOpenChange={handleOpenDialogDelete}
        title="Xóa nhóm"
        message={
          <p className="text-sm">
            Bạn có chắc muốn xóa nhóm người dùng{" "}
            <span className="font-medium text-md text-[#F44336]">
              {groupDetail?.group.groupName}
            </span>{" "}
            không?
          </p>
        }
        onConfirm={comfirmDeleteGroup}
      />
      <ConfirmDialog
        isOpen={isOpenDialogAccount}
        large={true}
        onOpenChange={handleOpenDialogAccount}
        title="Cập nhật danh sách tài khoản"
        message={<MessageAccount groupDetail={groupDetail} listUserSelected={listAccountSelected} setListUserSelected={setListAccountSelected} />}
        onConfirm={() => handleConfirmAccount()}
      />
    </div>
  );
};

export default GroupDetailTag;
