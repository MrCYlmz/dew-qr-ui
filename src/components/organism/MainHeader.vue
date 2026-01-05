<script setup lang="ts">
import { computed, ref } from "vue";
import { useFetchUserOrders } from "../../api/user/queries.ts";
import { getIdFromJWT } from "../../utils/jwtUtils.ts";
import OrderList from "../molecules/OrderList.vue";
import ShoppingCart from "../molecules/ShoppingCart.vue";
import { OrderStatusEnum } from "../../api/openapi/index.ts";
import { useUserOrderSse } from "../../composables/useUserOrderSse.ts";

const userId = getIdFromJWT();
const { data: cancelledOrders } = useFetchUserOrders(userId!, OrderStatusEnum.CANCELLED);
const { data: completedOrders } = useFetchUserOrders(userId!, OrderStatusEnum.COMPLETED);
const { data: pendingOrders } = useFetchUserOrders(userId!, OrderStatusEnum.PENDING);

useUserOrderSse(userId!);
const totalPrice = computed(() =>
  [...(pendingOrders.value || []), ...(completedOrders.value || [])].reduce(
    (acc, order) => acc + order.totalPrice,
    0
  )
);
const expanded = ref(false);
</script>

<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="expanded = !expanded"
    ></v-app-bar-nav-icon>

    <v-toolbar-title>My App</v-toolbar-title>

    <ShoppingCart />
  </v-app-bar>

  <v-navigation-drawer v-model="expanded" location="left" temporary>
    <v-list>
      <v-list-item>
        <v-list-item-title class="text-h6">Order Summary</v-list-item-title>
      </v-list-item>
      <v-list-item>
          Total Price: {{ totalPrice }}$
      </v-list-item>
      <v-list-item>
        <v-expansion-panels variant="accordion">
          <OrderList title="Cancelled Orders" :orders="cancelledOrders" />
          <OrderList title="Pending Orders" :orders="pendingOrders" />
          <OrderList title="Completed Orders" :orders="completedOrders" />
        </v-expansion-panels>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped lang="scss"></style>
