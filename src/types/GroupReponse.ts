import { Group, User } from "./User";
import { PageRole } from "./pageRole";

export type GroupResponse = {
  group: Group;
  users: User[];
  pageRoles: PageRole[];
};