import React, { useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { PageRole } from "@/types/pageRole";
import "@mdi/font/css/materialdesignicons.css";
import NextLink from "next/link";

interface SidebarComponentProps {
  pageRoles: PageRole[];
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
}
const mdiStyles = `
  .mdi::before {
    width: 24px !important;
    height: 24px !important;
    font-size: 24px !important;
  }
`;

const SidebarComponent = ({ pageRoles, sheetOpen, onSheetOpenChange }: SidebarComponentProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [selectedLv1Id, setSelectedLv1Id] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lv1Roles = pageRoles
    .filter((role) => role.level === 1)
    .sort((a, b) => a.id - b.id);

  const lv2Roles = selectedLv1Id
    ? pageRoles.filter(
        (role) => role.level === 2 && role.parentId === selectedLv1Id
      )
    : [];

  const handleLv1Click = (roleId: number) => {
    const hasLv2 = pageRoles.some(
      (role) => role.level === 2 && role.parentId === roleId
    );

    if (hasLv2) {
      if (selectedLv1Id === roleId) {
        setIsCollapsed(false);
        setSelectedLv1Id(null);
      } else {
        setSelectedLv1Id(roleId);
        setIsCollapsed(true);
      }
    } else {
      setSelectedLv1Id(null);
      setIsCollapsed(false);
      router.push(lv1Roles.find((role) => role.id === roleId)?.pageUrl || "/");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, roleId: number) => {
    if (e.key === "Enter" || e.key === " ") {
      handleLv1Click(roleId);
    }
  };

  return (
    <>
      <style>{mdiStyles}</style>
      {isMobile && sheetOpen ? (
        <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange }>
          <SheetTitle className="sr-only">Sidebar</SheetTitle>
          <SheetContent side="left" className={`w-[300px] h-screen bg-[#A72832] p-1 flex flex-col`}>
          <nav className="flex flex-col w-full mt-4">
            {lv1Roles.map((role) => (
              <React.Fragment key={role.id}>
                <button
                  className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg focus:outline-none
                    ${selectedLv1Id === role.id ? "bg-[#B94B52]" : "hover:bg-[#B94B52]"}
                    text-white transition-colors`}
                  tabIndex={0}
                  aria-label={role.pageName}
                  onClick={() => handleLv1Click(role.id)}
                  onKeyDown={(e) => handleKeyDown(e, role.id)}
                >
                  <i className={`mdi ${role.pageIcon} text-2xl`}></i>
                  <span className="text-[16px] font-normal">{role.pageName}</span>
                  {pageRoles.some(r => r.level === 2 && r.parentId === role.id) && (
                    <span className="ml-auto">
                      <i className={`mdi ${selectedLv1Id === role.id ? "mdi-chevron-up" : "mdi-chevron-down"} text-xl`} />
                    </span>
                  )}
                </button>
                {selectedLv1Id === role.id && lv2Roles.length > 0 && (
                  <div className="flex flex-col pl-10">
                    {lv2Roles.map((lv2) => (
                      <button
                        key={lv2.id}
                        className="text-white text-[15px] font-thin text-left py-2 px-4 rounded-lg hover:bg-[#B94B52] focus:outline-none truncate"
                        tabIndex={0}
                        aria-label={lv2.pageName}
                        onClick={() => router.push(lv2.pageUrl)}
                      >
                        {lv2.pageName}
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>
          </SheetContent>
        </Sheet>
      ) : (
        <>
        <Sidebar className="flex h-screen p-1 bg-[#A72832] border-none !w-[90px]">
          <SidebarContent className="flex flex-col items-center bg-[#A72832] w-full">
            <SidebarHeader className="h-15 p-1">
              <NextLink href="/">
                <NextImage
                  src="/images/logosidebar.png"
                  alt="logo"
                  width={40}
                  height={40}
                />
              </NextLink>
            </SidebarHeader>
            <nav className="flex flex-col w-full">
              {lv1Roles.map((role) => (
                <button
                  key={role.id}
                  className={`flex flex-col gap-[2px] items-center w-full py-1 rounded-lg focus:outline-none
                  ${
                    selectedLv1Id === role.id
                      ? "bg-[#B94B52]"
                      : "hover:bg-[#B94B52]"
                  }
                  text-white transition-colors`}
                  tabIndex={0}
                  aria-label={role.pageName}
                  onClick={() => handleLv1Click(role.id)}
                  onKeyDown={(e) => handleKeyDown(e, role.id)}
                >
                  <i className={`mdi ${role.pageIcon} text-2xl`}></i>
                  <span className="text-[13px] font-thin">{role.pageName}</span>
                </button>
              ))}
            </nav>
          </SidebarContent>
        </Sidebar>
        {isCollapsed && (
          <div
          className={`bg-[#A72832] z-100 fixed top-0 left-[90px] min-w-75 h-screen flex flex-col gap-2 p-2 transition-transform duration-300 overflow-y-auto${
            isCollapsed ? "w-0" : "w-75"
          }`}
        >
          {lv2Roles.map((role) => (
            <button
              key={role.id}
              className="text-white text-[15px] font-thin text-left py-2 px-4 rounded-lg hover:bg-[#B94B52] focus:outline-none truncate"
              tabIndex={0}
              aria-label={role.pageName}
              onClick={() => router.push(role.pageUrl)}
            >
              {role.pageName}
            </button>
          ))}
        </div>
        )}
        </>
      )}
    </>
  );
};

export default SidebarComponent;
