<script setup lang="ts">
import { ref, computed } from "vue";
import { useFetchUserOrders } from "../api/user/queries.ts";
import type { Order } from "../api/openapi";
import { getUserId} from "../utils/jwtUtils.ts";
const show = ref(false);
const userId = getUserId();
const { data: orders, isFetched } = useFetchUserOrders(userId!);

const groupedOrders = computed(() => {
  if (!orders.value) return {};
  return orders.value.reduce((acc, order) => {
    if (!acc[order.status!]) acc[order.status!] = [];
    acc[order.status!].push(order);
    return acc;
  }, {} as Record<string, Order[]>);
});

const totalPrice = computed(() =>
  orders.value
    ?.filter((order) => order.status !== "CANCELLED")
    .reduce((sum, order) => sum + order.totalPrice, 0) || 0
);
</script>

<template>
  <div class="order-summary">
    <v-btn
      class="toggle-btn"
      :icon="show ? 'mdi-chevron-down' : 'mdi-chevron-up'"
      @click="show = !show"
    >
      Orders (Total: {{ totalPrice }})
    </v-btn>

    <v-expansion-panels v-show="show" class="order-details">
      <div v-if="isFetched && orders">
        <v-expansion-panel
          v-for="(orders, status) in groupedOrders"
          :key="status"
          class="order-group"
        >
          <v-expansion-panel-title>{{ status }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card-text>
              <div v-for="order in orders" :key="order.id" class="order-item">
                <p><strong>Order ID:</strong> {{ order.id }}</p>
                <p><strong>Total Price:</strong> {{ order.totalPrice }}</p>
                <v-list>
                  <v-list-item
                    v-for="item in order.items"
                    :key="item.itemId"
                    class="order-item-detail"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>Price: {{ item.price }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
              </div>
            </v-card-text>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </div>
      <div v-else>
        <p>Loading orders...</p>
      </div>
    </v-expansion-panels>
  </div>
</template>

<style scoped>
.order-summary {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  border-top: 1px solid #ccc;
  padding: 1rem;
}

.toggle-btn {
  width: 100%;
  text-align: left;
}

.order-details {
  padding: 1rem;
}

.order-group {
  margin-bottom: 1rem;
}

.order-item {
  margin-bottom: 1rem;
}

.order-item-detail {
  margin-left: 1rem;
}
</style>
