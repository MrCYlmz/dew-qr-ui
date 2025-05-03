import {jwtDecode} from "jwt-decode";
import type { TokenRoleEnum } from "../api/openapi";

export interface JwtPayload {
  sub: string; // User ID,
  roles: TokenRoleEnum,
  iat: number; 
  exp: number; 
}
export const USER_JWT_TOKEN = 'userJwtToken';
export const ADMIN_JWT_TOKEN = 'adminJwtToken';

export function getDecodedToken(): JwtPayload | undefined {
  const token = localStorage.getItem(USER_JWT_TOKEN);
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

export function clearUserToken() {
  localStorage.removeItem(USER_JWT_TOKEN);
}
export function clearAdminToken() {
  localStorage.removeItem(ADMIN_JWT_TOKEN);
}
export function setUserToken(token: string) {
  localStorage.setItem(USER_JWT_TOKEN, token);
}
export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_JWT_TOKEN, token);
}
export function getUserToken(): string | null {
  return localStorage.getItem(USER_JWT_TOKEN);
}
export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_JWT_TOKEN);
}

