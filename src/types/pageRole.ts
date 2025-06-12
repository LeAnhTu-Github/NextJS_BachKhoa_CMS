export type PageRole = {
  id: number;
  level: number;
  menuIndex: number;
  pageIcon: string;
  pageName: string;
  pageType: number;
  pageUrl: string;
  parentId: number;
  roleId: number;
  roles: string;
};

export type PageRoles = PageRole[];