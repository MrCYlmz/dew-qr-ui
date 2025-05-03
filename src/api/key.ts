export const itemKey = { queryKey: ['items'] } 
export const userOrdersKey = { queryKey: ['userOrders'] }
export const imageKey = (itemId:string) =>  ['images',itemId]