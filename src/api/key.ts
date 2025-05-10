import type { OrderStatusEnum } from "./openapi";

export const itemKey = { queryKey: ['items'] } 
export const userOrdersKey = (status?: OrderStatusEnum) => 
    status ?   ['userOrders', { status }] : ['userOrders'];
export const imageKey = (itemId:string) =>  ['images',itemId]
export const orderKey = (status?: OrderStatusEnum, tableNumber?: number) => 
    status ? ['orders', { status, tableNumber }] : ['orders', { tableNumber }];