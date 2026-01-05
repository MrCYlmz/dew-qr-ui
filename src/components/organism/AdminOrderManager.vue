<script setup lang="ts">
import { ref } from "vue";
import { useFetchOrders } from "../../api/admin/queries.ts";
import { useChangeOrderStatus } from "../../api/admin/mutations.ts";
import { OrderStatusEnum } from "../../api/openapi";
import OrderList from "../molecules/OrderList.vue";
import { useAdminOrderSse } from "../../composables/useAdminOrderSse.ts";

const numberOfOrders = ref<number | undefined>(5);

const { mutate: changeOrderStatus } = useChangeOrderStatus();

const {data:pendingOrders} = useFetchOrders(OrderStatusEnum.PENDING);
const {data: completedOrders} = useFetchOrders(OrderStatusEnum.COMPLETED, undefined, numberOfOrders.value);
const {data: cancelledOrders} = useFetchOrders(OrderStatusEnum.CANCELLED, undefined, numberOfOrders.value);

useAdminOrderSse();

function completeOrder(orderId: string) {
  changeOrderStatus({ orderId, status:OrderStatusEnum.COMPLETED  });
}

function cancelOrder(orderId: string) {
  changeOrderStatus({ orderId, status: OrderStatusEnum.CANCELLED });
}

function showAllCompletedOrders() {
  numberOfOrders.value = undefined;
}

function showAllCancelledOrders() {
  numberOfOrders.value = undefined;
}
</script>

<template>
  
    <OrderList
      title="Pending Orders"
      :orders="pendingOrders"
      :actions="[
        { label: 'Complete', color: 'success', action: completeOrder },
        { label: 'Cancel', color: 'error', action: cancelOrder }
      ]"
    />
    <OrderList
      :orders="completedOrders"
      title="Completed Orders"
    >
      <template #footer>
        <v-btn block color="primary" @click="showAllCompletedOrders">Show All Orders</v-btn>
      </template>
    </OrderList>

    <OrderList
      title="Cancelled Orders"
      :orders="cancelledOrders"
    >
      <template #footer>
        <v-btn block color="primary" @click="showAllCancelledOrders">Show All Orders</v-btn>
      </template>
    </OrderList>
</template>
