import type { FetchUserOrdersStatusEnum } from "@mrdew/dewqr-api-generator/src/gen"

export const itemKey = { queryKey: ['items'] } 
export const userOrdersKey = (status?: FetchUserOrdersStatusEnum) => 
    status ? ['userOrders'] : ['userOrders', { status }];
export const imageKey = (itemId:string) =>  ['images',itemId]