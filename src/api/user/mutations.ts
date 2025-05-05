import {userApi, type Order} from "../openapi";
import {withUserAuthorization} from "../auth/utils.ts";
import {useMutation, useQueryClient} from "@tanstack/vue-query";
import {userOrdersKey} from "../key.ts";

export function usePlaceOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (order: Order) => {
            const response = await userApi.placeOrder(order, withUserAuthorization());
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: userOrdersKey(),
            });
        },
    });
}