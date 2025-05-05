import type { RawAxiosRequestConfig } from 'axios';
import { getJWTToken } from '../../utils/jwtUtils';

function setAuthorizationHeader(options: RawAxiosRequestConfig = {}, token: string | null): RawAxiosRequestConfig {
    return {
        ...options,
        headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
}

export function withUserAuthorization(options: any = {}) {
    return setAuthorizationHeader(options, getJWTToken());
}

export function withAdminAuthorization(options: any = {}) {
    return setAuthorizationHeader(options, getJWTToken());
}