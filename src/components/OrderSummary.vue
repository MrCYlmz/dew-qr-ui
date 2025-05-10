<script setup lang="ts">
import { ref, computed } from "vue";
import { useFetchUserOrders } from "../api/user/queries.ts";
import { getIdFromJWT } from "../utils/jwtUtils.ts";
import OrderList from "./molecules/OrderList.vue";

const userId = getIdFromJWT();
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
    location="top"
    
  >
    <template #activator="{ props }">
      <v-btn v-bind="props" block color="primary">View Orders</v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-expansion-panels>
          <OrderList title="Cancelled Orders" :orders="cancelledOrders" />
          <OrderList title="Pending Orders" :orders="pendingOrders" />
          <OrderList title="Completed Orders" :orders="completedOrders" />

          <v-divider></v-divider>
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
