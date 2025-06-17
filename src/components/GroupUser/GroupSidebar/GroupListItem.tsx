import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { Group } from "@/types/User";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import api from "@/services/api";

interface GroupListItemProps {
  groupList: Group[];
  refreshGroupList: () => void;
  handleSelectGroup: (groupId: number) => void;
  selectedGroupId: number | null;
}

interface GroupFormData {
  groupName: string;
  description: string;
}

const GroupListItem = ({ 
  groupList, 
  refreshGroupList, 
  handleSelectGroup,
  selectedGroupId 
}: GroupListItemProps) => {
  const [isOpenDialogCreateGroup, setIsOpenDialogCreateGroup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<GroupFormData>({
    groupName: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<GroupFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialogCreateGroup = () => {
    setIsOpenDialogCreateGroup(!isOpenDialogCreateGroup);
    if (!isOpenDialogCreateGroup) {
      setFormData({ groupName: "", description: "" });
      setErrors({});
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id as keyof GroupFormData]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };
  const handleCreateGroup = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/group", {
        groupName: formData.groupName,
        description: formData.description,
        groupPage: "",
        status: 1,
      });
      if (response.status >= 200 && response.status < 300) {
        toast.success("Tạo nhóm thành công");
        setIsOpenDialogCreateGroup(false);
        setFormData({ groupName: "", description: "" });
        refreshGroupList();
      } else {
        toast.error("Có lỗi xảy ra khi tạo nhóm");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo nhóm");
      console.error("Error creating group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCreateGroup = () => {
    handleCreateGroup();
    setIsOpenDialogCreateGroup(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGroupSelect = (groupId: number) => {
    handleSelectGroup(groupId);
  };

  const filteredGroups = groupList.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const messageCreateGroup = () => {
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col gap-2">
          <Input
            id="groupName"
            type="text"
            placeholder="Nhập tên nhóm (*)"
            required
            tabIndex={0}
            className="w-full h-14"
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
            className="w-full h-14 mb-6"
            value={formData.description}
            onChange={handleInputChange}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if(groupList.length > 0) {
      handleGroupSelect(groupList[0].id);
    }
  }, [groupList, handleSelectGroup]);

  return (
    <div className="w-full lg:w-1/3 flex flex-col border gap-4 border-gray-200 justify-start items-center rounded-lg">
      <div className="w-full h-17 p-4 flex flex-row justify-between items-center">
        <p className="text-xl font-normal">Nhóm người dùng</p>
        <Button
          onClick={handleOpenDialogCreateGroup}
          variant="outline"
          size="sm"
          className="min-w-16 flex flex-row items-center gap-2 shadow-lg bg-[#A2122B] text-white h-9 hover:bg-[#A84B52] hover:text-white"
        >
          Thêm mới
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full h-10 p-4">
        <Input
          type="text"
          placeholder="Tìm kiếm"
          className="w-full h-10 rounded-[4px] placeholder:text-lg"
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Tìm kiếm nhóm"
        />
      </div>
      <div className="w-full h-full p-4 border-none">
        {filteredGroups.map((group) => (
          <Button
            variant="group"
            size="sm"
            className={`w-full h-10 px-4  flex items-center justify-start border-none rounded-[3px] ${
              selectedGroupId === group.id 
                ? "bg-[#A2122B] text-white" 
                : "hover:bg-[#F9F9F9] hover:text-[#000]"
            }`}
            key={group.id}
            onClick={() => handleGroupSelect(group.id)}
          >
            {group.groupName}
          </Button>
        ))}
      </div>
      <ConfirmDialog
        isOpen={isOpenDialogCreateGroup}
        onOpenChange={handleOpenDialogCreateGroup}
        title="Thêm nhóm người dùng"
        message={messageCreateGroup()}
        onConfirm={handleConfirmCreateGroup}
      />
    </div>
  );
};

export default GroupListItem;
