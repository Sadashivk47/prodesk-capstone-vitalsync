import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Array<"doctor" | "patient">) => SetMetadata(ROLES_KEY, roles);
