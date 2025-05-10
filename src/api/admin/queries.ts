import {useQuery} from "@tanstack/vue-query";
import { orderKey} from "../key.ts";
import {OrderStatusEnum, adminApi, type AdminOrder } from "../openapi";
import {withUserAuthorization} from "../auth/utils.ts";

export function useFetchOrders(status?: OrderStatusEnum, tableNumber?: number, numberOfOrders?: number) {
    return useQuery({
        queryKey: orderKey(status, tableNumber),
        queryFn: async (): Promise<AdminOrder[]> => {
            const response = await adminApi.fetchOrders(status, tableNumber,numberOfOrders, withUserAuthorization());
            return response.data;
        },
    });
}