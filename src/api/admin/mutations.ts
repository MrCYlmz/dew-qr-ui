import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { itemKey, orderKey, tablesKey, groupsKey, pendingUsersKey } from "../key.ts";
import {
    adminApi,
    OrderStatusEnum,
    type Item,
    type CreateTableRequest,
    type UpdateTableRequest,
    type RejectUserRequest
} from "../openapi";
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

export function useCreateTable() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (request: CreateTableRequest) => {
            const response = await adminApi.createTable(request, withAdminAuthorization());
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(tablesKey);
        },
    });
}

export function useUpdateTable() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, request }: { id: string; request: UpdateTableRequest }) => {
            const response = await adminApi.updateTable(id, request, withAdminAuthorization());
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(tablesKey);
        },
    });
}

export function useDeleteTable() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await adminApi.deleteTable(id, withAdminAuthorization());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(tablesKey);
        },
    });
}

export function useCloseGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (groupId: string) => {
            const response = await adminApi.closeGroup(groupId, withAdminAuthorization());
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupsKey() });
            queryClient.invalidateQueries(tablesKey);
        },
    });
}

export function useApproveUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await adminApi.approveUser(userId, withAdminAuthorization());
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pendingUsersKey() });
            queryClient.invalidateQueries({ queryKey: groupsKey() });
            queryClient.invalidateQueries(tablesKey);
        },
    });
}

export function useRejectUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, request }: { userId: string; request?: RejectUserRequest }) => {
            const response = await adminApi.rejectUser(userId, request, withAdminAuthorization());
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pendingUsersKey() });
        },
    });
}