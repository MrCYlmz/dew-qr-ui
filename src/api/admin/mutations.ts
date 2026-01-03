import {useMutation, useQueryClient} from "@tanstack/vue-query";
import {itemKey, orderKey} from "../key.ts";
import {adminApi ,OrderStatusEnum,type Item} from "../openapi";
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
            await adminApi.deleteItem({id:id},withAdminAuthorization());
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
export function useUpdateImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({itemId, file}: { itemId: string; file: File }) =>
            await adminApi.updateItemImage(itemId, file,withAdminAuthorization()),
        onSuccess: () => {
            queryClient.invalidateQueries(itemKey);
        },
    });
}

export function useChangeOrderStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatusEnum }) =>
            await adminApi.changeOrderStatus(orderId, status, withAdminAuthorization()),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: orderKey()});
        },
    });
}