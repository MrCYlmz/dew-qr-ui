import {jwtDecode} from "jwt-decode";
import type { TokenRoleEnum } from "../api/openapi";

export interface JwtPayload {
  sub: string; // User ID,
  roles: TokenRoleEnum,
  iat: number; 
  exp: number; 
}

export function getDecodedToken(): JwtPayload | undefined {
  const token = localStorage.getItem('userJwtToken');
  if (!token) return undefined;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Invalid JWT token", error);
    return undefined;
  }
}

export function getUserId(): string | undefined {
  const decoded = getDecodedToken();
  return decoded?.sub || undefined;
}

export function getUserRole(): TokenRoleEnum | undefined {
  const decoded = getDecodedToken();
  return decoded?.roles || undefined;
}
