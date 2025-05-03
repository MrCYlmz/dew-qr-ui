import {useMutation, useQueryClient} from "@tanstack/vue-query";
import {itemKey} from "../key.ts";
import {adminApi ,type Item} from "../openapi";
import { withAdminAuthorization } from "../auth/utils.ts";
export function useAddItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (item: Item) => {
            return await adminApi.addItem(item,withAdminAuthorization());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(itemKey);
        },
    });
}

export function useUpdateItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (item: Item) => {
            return await adminApi.updateItem(item,withAdminAuthorization());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(itemKey);
        },
    });
}

export function useDeleteItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await adminApi.deleteItem(id,withAdminAuthorization());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(itemKey);
        },
    });
}

export function useAddImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({itemId, file}: { itemId: string; file: File }) =>
            await adminApi.uploadItemImage(itemId, file,withAdminAuthorization()),
        onSuccess: () => {
            queryClient.invalidateQueries(itemKey);
        },
    });
}