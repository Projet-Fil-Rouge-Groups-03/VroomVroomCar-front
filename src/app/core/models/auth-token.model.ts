import { UserStatus } from "./user.model";

export interface AuthToken {
  sub: string;
  roles: UserStatus;
  exp: number;
}