import {useQuery} from "@tanstack/vue-query";
import {itemKey} from "../key.ts";
import {userApi, type Item} from "../openapi";
import {withUserAuthorization} from "../auth/utils.ts";

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