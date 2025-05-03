import {useQuery} from "@tanstack/vue-query";
import {itemKey, userOrdersKey} from "../key.ts";
import {userApi, type Item } from "../openapi";
import {withUserAuthorization} from "../auth/utils.ts";
import type { FetchUserOrdersStatusEnum } from "@mrdew/dewqr-api-generator/src/gen/api.ts";

export function useFetchItems() {
    return useQuery({
        ...itemKey,
        queryFn: async (): Promise<Item[]> => {
            const response =  (await userApi.fetchItems(withUserAuthorization()));
            return response.data;
        },
        
    });
}

export function useFetchImage(itemId: string) {
    return useQuery({
        queryKey: ['images', itemId],
        queryFn: async (): Promise<Blob> => {
            const response = await userApi.fetchItemImage(
                itemId,
                withUserAuthorization({responseType: 'arraybuffer'})
            );
            return new Blob([response.data], {type: 'image/jpeg'});
        },
    });
}
export function useFetchUserOrders(userId: string, status?: FetchUserOrdersStatusEnum) {
    return useQuery({
        ...userOrdersKey,
        queryFn: async (): Promise<any> => {
            const response = await userApi.fetchUserOrders(userId, status, withUserAuthorization());
            return response.data;
        },
    });
}
