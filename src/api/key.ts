import type { OrderStatusEnum, GroupStatus } from "./openapi";

export const itemKey = { queryKey: ['items'] }
export const userOrdersKey = (status?: OrderStatusEnum) =>
    status ?   ['userOrders', { status }] : ['userOrders'];
export const imageKey = (itemId:string) =>  ['images',itemId]
export const orderKey = (status?: OrderStatusEnum, tableNumber?: number) =>
    status ? ['orders', { status, tableNumber }] : ['orders', { tableNumber }];

// Table & Group management keys
export const tablesKey = { queryKey: ['tables'] };
export const groupsKey = (status?: GroupStatus) =>
    status ? ['groups', { status }] : ['groups'];
export const groupDetailKey = (groupId: string) => ['groups', groupId];
export const pendingUsersKey = (tableId?: string) =>
    tableId ? ['pendingUsers', { tableId }] : ['pendingUsers'];