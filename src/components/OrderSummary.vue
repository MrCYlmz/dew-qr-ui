<script setup lang="ts">
import { ref, computed } from "vue";
import { useFetchUserOrders } from "../api/user/queries.ts";
import type { Order } from "../api/openapi";
import { getUserId } from "../utils/jwtUtils.ts";
import OrderList from "./OrderList.vue";

const show = ref(true);
const userId = getUserId();
const { data: cancelledOrders } = useFetchUserOrders(userId!, "CANCELLED");
const { data: completedOrders } = useFetchUserOrders(userId!, "COMPLETED");
const { data: pendingOrders } = useFetchUserOrders(userId!, "PENDING");

const totalPrice = computed(() =>
  [...(pendingOrders.value || []), ...(completedOrders.value || [])].reduce(
    (acc, order) => acc + order.totalPrice,
    0
  )
);

const menuOpen = ref(false);
</script>

<template>
  <v-menu
    v-model="menuOpen"
    :close-on-content-click="false"
    activator="parent"
    v-if="show"
  >
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">View Orders</v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-expansion-panels>
          <OrderList title="Cancelled Orders" :orders="cancelledOrders" />
          <OrderList title="Pending Orders" :orders="pendingOrders" />
          <OrderList title="Completed Orders" :orders="completedOrders" />

          <v-divider class="my-4"></v-divider>
          <strong>Total Price (Including All Orders): {{ totalPrice }}$</strong>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<style scoped lang="scss">
.v-list-item {
  border-bottom: 1px solid #e0e0e0;
}
</style>
