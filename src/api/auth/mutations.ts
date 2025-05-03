import { useMutation } from "@tanstack/vue-query";
import { authApi } from "../openapi";
import { setUserToken, setAdminToken } from "../../utils/jwtUtils";
export function useUserLogin() {
  return useMutation({
    mutationFn: async (credentials: { name: string; tableNumber: number }) => {
      const response = await authApi.loginUser(credentials);
      setUserToken(response.data.accessToken);
      return response.data.accessToken;
    },
  });
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await authApi.loginAdmin(credentials);
      setAdminToken(response.data.accessToken);
      return response.data.accessToken;
    },
  });
}
