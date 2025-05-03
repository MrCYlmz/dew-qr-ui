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

export function clearUserToken() {
  localStorage.removeItem('userJwtToken');
}
export function clearAdminToken() {
  localStorage.removeItem('adminJwtToken');
}
export function setUserToken(token: string) {
  localStorage.setItem('userJwtToken', token);
}
export function setAdminToken(token: string) {
  localStorage.setItem('adminJwtToken', token);
}  
