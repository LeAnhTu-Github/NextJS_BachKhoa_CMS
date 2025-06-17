import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleData } from "./GroupDetailTag";
import { PageRole } from "@/types/pageRole";

interface TableRoleProps {
  listSelected: PageRole[];
  listRoleSelected: RoleData[];
  pageRoleSelected: PageRole | undefined;
  selectedRoles: RoleData[];
  onRoleSelection: (roles: RoleData[]) => void;
}

const TableRole = ({
  listRoleSelected,
  pageRoleSelected,
  selectedRoles,
  onRoleSelection,
  listSelected,
}: TableRoleProps) => {
  const [localSelectedRoles, setLocalSelectedRoles] = useState<RoleData[]>([]);
  useEffect(() => {
    setLocalSelectedRoles(selectedRoles);
  }, [selectedRoles]);

  useEffect(() => {
    if (listRoleSelected.length > 0 && listSelected.length > 0) {
      const selectedPageIds = new Set(listSelected.map((page) => page.roleId));
      const rolesToSelect = listRoleSelected.filter((role) =>
        selectedPageIds.has(role.id)
      );

      if (rolesToSelect.length > 0) {
        const newSelected = [...localSelectedRoles];
        rolesToSelect.forEach((role) => {
          if (!newSelected.some((selected) => selected.id === role.id)) {
            newSelected.push(role);
          }
        });
        setLocalSelectedRoles(newSelected);
        onRoleSelection(newSelected);
      }
    }
  }, [listRoleSelected, listSelected]);

  const result = listRoleSelected.filter(
    (role) => role.pageId === pageRoleSelected?.id
  );
  const isAllSelected =
    result.length > 0 &&
    result.every((role) =>
      localSelectedRoles.some((selected) => selected.id === role.id)
    );

  const handleSelectAll = () => {
    if (isAllSelected) {
      const newSelected = localSelectedRoles.filter(
        (role) => role.pageId !== pageRoleSelected?.id
      );
      setLocalSelectedRoles(newSelected);
      onRoleSelection(newSelected);
    } else {
      const newSelected = [...localSelectedRoles];
      result.forEach((role) => {
        if (!newSelected.some((selected) => selected.id === role.id)) {
          newSelected.push(role);
        }
      });
      setLocalSelectedRoles(newSelected);
      onRoleSelection(newSelected);
    }
  };

  const handleSelectRole = (role: RoleData) => {
    const isCurrentlySelected = localSelectedRoles.some(
      (selected) => selected.id === role.id
    );
    let newSelected: RoleData[];

    if (isCurrentlySelected) {
      newSelected = localSelectedRoles.filter(
        (selected) => selected.id !== role.id
      );
    } else {
      newSelected = [...localSelectedRoles, role];
    }

    setLocalSelectedRoles(newSelected);
    onRoleSelection(newSelected);
  };

  return (
    <Table className="w-full">
      <TableHeader className="sticky top-0 bg-white z-10">
        <TableRow className="bg-[#F1EFEF]">
          <TableHead className="w-12 flex flex-row items-center text-sm font-bold">
            <Checkbox
              className="bg-white data-[state=checked]:bg-[#A2122B] data-[state=checked]:border-none"
              aria-label={`Chọn tất cả`}
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <div className="pl-4">
              <span className="text-sm font-medium">{`CHỨC NĂNG ${
                pageRoleSelected?.pageName
                  ? `TRANG ${pageRoleSelected?.pageName.toUpperCase()}`
                  : ""
              }`}</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="h-[524px] overflow-y-auto block w-full">
        {result.length === 0 ? (
          <TableRow className="w-full">
            <TableCell className="w-full flex justify-center items-center text-muted-foreground text-center">
              Vui lòng chọn trang
            </TableCell>
          </TableRow>
        ) : (
          result.map((role) => (
            <TableRow
              key={role.id}
              tabIndex={0}
              aria-label={`Vai trò ${role.roleName}, ID ${role.id}, Page ID ${role.pageId}`}
              className=""
              role="row"
              onClick={() => handleSelectRole(role)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelectRole(role);
                }
              }}
            >
              <TableCell className="w-12">
                <Checkbox
                  className="data-[state=checked]:bg-[#A2122B] data-[state=checked]:border-none"
                  aria-label={`Chọn ${role.roleName}`}
                  checked={localSelectedRoles.some(
                    (selected) => selected.id === role.id
                  )}
                  onCheckedChange={() => handleSelectRole(role)}
                />
              </TableCell>
              <TableCell className="w-full">{role.roleName}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TableRole;
