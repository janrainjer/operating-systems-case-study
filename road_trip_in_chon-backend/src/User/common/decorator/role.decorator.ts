import { SetMetadata } from "@nestjs/common";
import { UserRole as UserSchemaUserRole } from "../../schemas/user.schema";

export const ROLES_KEY = "roles";
export const UserRoleGuard = (...userrole: UserSchemaUserRole[]) =>
  SetMetadata(ROLES_KEY, userrole);
