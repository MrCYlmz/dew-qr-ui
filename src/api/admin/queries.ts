import { useQuery } from "@tanstack/vue-query";
import { orderKey, tablesKey, groupsKey, groupDetailKey, pendingUsersKey } from "../key.ts";
import {
    OrderStatusEnum,
    GroupStatus,
    adminApi,
    type AdminOrder,
    type RestaurantTable,
    type CustomerGroup,
    type CustomerGroupDetail,
    type PendingUser
} from "../openapi";
import { withUserAuthorization } from "../auth/utils.ts";

export function useFetchOrders(status?: OrderStatusEnum, tableNumber?: number, numberOfOrders?: number) {
    return useQuery({
        queryKey: orderKey(status, tableNumber),
        queryFn: async (): Promise<AdminOrder[]> => {
            const response = await adminApi.fetchOrders(status, tableNumber, numberOfOrders, withUserAuthorization());
            return response.data;
        },
    });
}

export function useFetchTables() {
    return useQuery({
        queryKey: tablesKey.queryKey,
        queryFn: async (): Promise<RestaurantTable[]> => {
            const response = await adminApi.fetchTables(withUserAuthorization());
            return response.data;
        },
    });
}

export function useFetchGroups(status?: GroupStatus) {
    return useQuery({
        queryKey: groupsKey(status),
        queryFn: async (): Promise<CustomerGroup[]> => {
            const response = await adminApi.fetchGroups(status, withUserAuthorization());
            return response.data;
        },
    });
}

export function useFetchGroupDetail(groupId: string) {
    return useQuery({
        queryKey: groupDetailKey(groupId),
        queryFn: async (): Promise<CustomerGroupDetail> => {
            const response = await adminApi.getGroupDetail(groupId, withUserAuthorization());
            return response.data;
        },
        enabled: !!groupId,
    });
}

export function useFetchPendingUsers(tableId?: string) {
    return useQuery({
        queryKey: pendingUsersKey(tableId),
        queryFn: async (): Promise<PendingUser[]> => {
            const response = await adminApi.getPendingUsers(tableId, withUserAuthorization());
            return response.data;
        },
    });
}