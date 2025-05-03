import type { RawAxiosRequestConfig } from 'axios';
import { getUserToken, getAdminToken } from '../../utils/jwtUtils';

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
    const userToken = getUserToken();
    const tokenToUse = userToken || getAdminToken(); // Use admin token if user token is not available
    return setAuthorizationHeader(options, tokenToUse);
}

export function withAdminAuthorization(options: any = {}) {
    return setAuthorizationHeader(options, getAdminToken());
}