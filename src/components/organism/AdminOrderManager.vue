<script setup lang="ts">
import { ref, watch } from "vue";
import { useFetchOrders } from "../../api/admin/queries.ts";
import { useChangeOrderStatus } from "../../api/admin/mutations.ts";
import { OrderStatusEnum } from "../../api/openapi";
import OrderList from "../molecules/OrderList.vue";

const numberOfOrders = ref<number | undefined>(5);

const { mutate: changeOrderStatus } = useChangeOrderStatus();

const {data:pendingOrders, refetch: refetchPendingOrders} = useFetchOrders(OrderStatusEnum.PENDING);
const {data: completedOrders, refetch : refetchCompletedOrders} = useFetchOrders(OrderStatusEnum.COMPLETED, undefined, numberOfOrders.value);
const {data: cancelledOrders, refetch: refetchCancelledOrders} = useFetchOrders(OrderStatusEnum.CANCELLED, undefined, numberOfOrders.value);

setInterval(() => {
  refetchCancelledOrders();
  refetchCompletedOrders();
  refetchPendingOrders();
}, 300000);

watch(
  () => [pendingOrders.value, completedOrders.value, cancelledOrders.value],
  () => {
    console.log("Pending Orders: ", pendingOrders.value);
    console.log("Completed Orders: ", completedOrders.value);
    console.log("Cancelled Orders: ", cancelledOrders.value);
  },
  { immediate: true }
);

function completeOrder(orderId: string) {
  changeOrderStatus({ orderId, status:OrderStatusEnum.COMPLETED  });
}

function cancelOrder(orderId: string) {
  changeOrderStatus({ orderId, status: OrderStatusEnum.CANCELLED });
}

function showAllCompletedOrders() {
  numberOfOrders.value = undefined;
  refetchCompletedOrders();
}

function showAllCancelledOrders() {
  numberOfOrders.value = undefined;
  refetchCancelledOrders();
}
</script>

<template>
  <v-expansion-panels>
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
  </v-expansion-panels>
</template>
