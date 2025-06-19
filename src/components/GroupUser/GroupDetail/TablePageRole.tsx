import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { getPageRoles } from "@/services/groupService"; 
import { Checkbox } from "@/components/ui/checkbox";
import { PageRole } from "@/types/pageRole";
import { RoleData } from "@/types/pageRole";

interface TablePageRoleProps {
  listSelected?: PageRole[];
  onSetListRole: (listRoleSelected: RoleData[]) => void;
  onSetPageRoleSelected: (pageRoleSelected: PageRole) => void;
  selectedRoles: RoleData[];
  onPageSelection: (page: PageRole, isSelected: boolean) => void;
  setSelectedRoles: (roles: RoleData[]) => void;
}

const TablePageRole = ({ 
  listSelected = [], 
  onSetListRole, 
  onSetPageRoleSelected,
  selectedRoles,
  onPageSelection ,
  setSelectedRoles
}: TablePageRoleProps) => {
  const [selected, setSelected] = useState<PageRole[]>([]);
  const [listRole, setListRole] = useState<RoleData[]>([]);
  const [listPageRoles, setListPageRoles] = useState<PageRole[]>([]); 
  const isAllSelected = selected.length === listPageRoles.length && listPageRoles.length > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
      setSelectedRoles([]);
      listPageRoles.forEach(page => onPageSelection(page, false));
    } else {
      setSelected([...listPageRoles]);
      const allRoles = listRole.filter(role =>
        listPageRoles.some(page => role.pageId === page.id)
      );
      setSelectedRoles(allRoles);
    }
  };

  const fetchPageRoles = async () => {
    try {
      const { pages, roles } = await getPageRoles();
      setListPageRoles(pages);
      onSetListRole(roles);
      setListRole(roles);
    } catch (error) {
      console.error("Error fetching page roles:", error);
    }
  };

  const handleSelect = (role: PageRole) => {
    const isCurrentlySelected = selected.some((r) => r.id === role.id);
    const newSelected = isCurrentlySelected
      ? selected.filter((r) => r.id !== role.id)
      : [...selected, role];
    
    setSelected(newSelected);
    onPageSelection(role, !isCurrentlySelected);
  };
  useEffect(() => {
    fetchPageRoles();
  }, []);

  useEffect(() => {
    if (listPageRoles.length > 0) {
      if (listSelected.length === 0) {
        setSelected([]);
        return;
      }
      console.log('listSelected - 1', listSelected);
      console.log('selectedRoles - 1', selectedRoles);
      const selectedPageIds = new Set([
        ...listSelected.map(page => page.id),
        ...selectedRoles.map(role => role.pageId)
      ]);
      const newSelected = listPageRoles.filter(page => selectedPageIds.has(page.id));
      setSelected(newSelected);
    }
  }, [listSelected, listPageRoles, selectedRoles]);

  useEffect(() => {
    if (listPageRoles.length > 0) {
      console.log('listSelected - 2', listSelected);
      console.log('selectedRoles - 2', selectedRoles);
      const selectedPageIds = new Set(
        selectedRoles.map(role => role.pageId)
      );
      const newSelected = listPageRoles.filter(page => selectedPageIds.has(page.id));
      setSelected(newSelected);
    }
  }, [selectedRoles, listPageRoles]);

  return (
    <Table className="w-full">
      <TableHeader className="sticky top-0 bg-white z-10">
        <TableRow className="bg-[#F1EFEF]">
          <TableHead className="w-12 flex flex-row items-center text-sm font-bold">
            <Checkbox
              className="bg-white data-[state=checked]:bg-redberry data-[state=checked]:border-none"
              aria-label={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              tabIndex={0}
            />
            <div className="pl-4">
              <span className="text-sm font-medium">TRANG</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="h-[524px] overflow-y-auto block">
        {listPageRoles.map((role) => {
          const checked = selected.some((r) => r.id === role.id);
          return (
            <TableRow
              key={role.id}
              data-state={checked ? "selected" : undefined}
              className={checked ? "bg-gray-100" : ""}
              tabIndex={0}
              aria-label={role.pageName}
              onClick={() => {
                onSetPageRoleSelected(role);
              }}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onSetPageRoleSelected(role);
                }
              }}
              role="row"
            >
              <TableCell className="w-12">
                <Checkbox
                  className="data-[state=checked]:bg-redberry data-[state=checked]:border-none"
                  aria-label={
                    checked
                      ? `Bỏ chọn ${role.pageName}`
                      : `Chọn ${role.pageName}`
                  }
                  checked={checked}
                  onCheckedChange={() => handleSelect(role)}
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </TableCell>
              <TableCell className="w-full text-base data-[state=checked]:bg-[#757575] pl-4">
                {role.pageName}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TablePageRole;