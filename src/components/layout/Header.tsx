import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, User2, Shield, Phone, Mail, Lock } from "lucide-react";
import { User } from "@/types/User";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { PageRole } from "@/types/pageRole";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface UserProps {
  user: User;
  logout: () => void;
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  pageRoles: PageRole[];
}

const Header = ({ user, logout, sheetOpen, onSheetOpenChange, pageRoles }: UserProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const handleUserMenuClick = () => setOpen((prev) => !prev);
  const handleUserMenuKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") setOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
  };

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{
      pageName: "Trang chủ",
      pageUrl: "/",
    }];
    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const matchingPage = pageRoles.find(page => page.pageUrl === currentPath);
      if (matchingPage) {
        breadcrumbs.push({
          pageName: matchingPage.pageName,
          pageUrl: matchingPage.pageUrl,
        });
      }
    }
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  return (
    <header className="fixed inset-0 z-50 flex h-16 justify-between items-center px-6 py-2 bg-gray-50 w-full lg:w-[calc(100%-90px)] lg:left-[90px]">
      {isMobile && (
        <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
          <SheetTrigger asChild>
            <i className="mdi mdi-menu text-2xl text-red-700"></i>
          </SheetTrigger>
        </Sheet>
      )}
      <Breadcrumb className="hidden lg:flex">
        <BreadcrumbList>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.pageUrl}>
              <BreadcrumbItem>
                {idx === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className={idx === 0 ? "text-red-700" : "text-gray-400"}>
                    {crumb.pageName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={crumb.pageUrl}
                    className={idx === 0 ? "text-red-700" : "text-gray-400"}
                  >
                    {crumb.pageName}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            tabIndex={0}
            aria-label="User menu"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
            onClick={handleUserMenuClick}
            onKeyDown={handleUserMenuKeyDown}
            type="button"
          >
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="text-2xl bg-gradient-to-tr from-red-700 to-red-400 text-white">
                {user.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {!isMobile && (
              <>
                <div className="flex flex-col items-start">
                  <span className="text-red-700 font-medium leading-none">
                    {user.fullName}
                  </span>
                  <span className="text-gray-400 text-sm leading-none">
                    {user.email}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-[400px]  h-auto p-0 rounded-xl shadow-lg"
        >
          <div className="p-4">
            <div className="text-xl font-medium mb-4">Thông tin người dùng</div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-700 to-red-400 flex items-center justify-center mb-2 border-2 border-red-700">
                <User2 className="w-16 h-16 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900">
                  {user.fullName}
                </span>
                <div className="flex items-center text-gray-700 text-sm gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{user.position}</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone || "Không có"}</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 my-2" />
          <button
            tabIndex={0}
            aria-label="Đổi mật khẩu"
            className="flex items-center gap-2 px-6 py-3 w-full text-gray-700  focus:outline-none"
            type="button"
          >
            <Lock className="w-5 h-5 text-gray-500" />
            <span className="text-base font-medium">Đổi mật khẩu</span>
          </button>
          <div className="px-6 pb-6 pt-2">
            <button
              tabIndex={0}
              aria-label="Đăng Xuất"
              onClick={handleLogout}
              className="w-full border border-red-700 text-red-700 rounded-xl py-2 font-medium text-lg hover:bg-red-50 focus:bg-red-100 focus:outline-none transition"
              type="button"
            >
              Đăng Xuất
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
};

export default Header;
