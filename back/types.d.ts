import {JwtPayload} from "jsonwebtoken";

export interface AdminDef {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  isActive: boolean;
}

interface JwtAdminPayload extends JwtPayload {
  id: string;
}