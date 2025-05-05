import {jwtDecode} from "jwt-decode";
import type { TokenRoleEnum } from "../api/openapi";

export interface JwtPayload {
  sub: string; // User ID,
  roles: TokenRoleEnum,
  iat: number; 
  exp: number; 
}
export const JWT_TOKEN = 'JwtToken';

export function getDecodedToken(): JwtPayload | undefined {
  const token = localStorage.getItem(JWT_TOKEN);
  if (!token) return undefined;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Invalid JWT token", error);
    return undefined;
  }
}

export function getIdFromJWT(): string | undefined {
  const decoded = getDecodedToken();
  return decoded?.sub || undefined;
}

export function getRoleFromJWT(): TokenRoleEnum | undefined {
  const decoded = getDecodedToken();
  return decoded?.roles || undefined;
}

export function clearJWTToken() {
  localStorage.removeItem(JWT_TOKEN);
}

export function setJWTToken(token: string) {
  localStorage.setItem(JWT_TOKEN, token);
}
export function getJWTToken(): string | null {
  return localStorage.getItem(JWT_TOKEN);
}

