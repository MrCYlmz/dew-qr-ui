import {useMutation} from "@tanstack/vue-query";
import {authApi} from "../openapi";

export function useUserLogin() {
    return useMutation({
        mutationFn: async (credentials: { name: string; tableNumber: number }) => {
            const response = await authApi.loginUser(credentials);
            localStorage.setItem('userJwtToken', response.data.accessToken);
            return response.data.accessToken;
        },
    });
}

export function useAdminLogin() {
    return useMutation({
        mutationFn: async (credentials: { username: string; password: string }) => {
            const response = await authApi.loginAdmin(credentials);
            localStorage.setItem('adminJwtToken', response.data.accessToken);
            return response.data.accessToken;
        },
    });
}