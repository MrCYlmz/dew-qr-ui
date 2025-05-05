<script setup lang="ts">
import type { Order } from "../api/openapi";
import { defineProps } from "vue";

defineProps<{
  title: string;
  orders: Order[] | undefined;
}>();
</script>

<template>
  <div>
    <v-expansion-panel v-if="orders && orders.length > 0" :title="title">
      <v-expansion-panel-text>
        <v-list>
            <v-list-item
            v-for="order in orders || []"
            :key="order.id"
          >
            <v-list-item-content>
              <v-list-item-title
                >Ordered at #{{ order.orderedAt }}</v-list-item-title
              >
              <v-list-item-subtitle
                v-for="item in order.items"
                :key="item.name"
              >
                {{ item.name }} x {{ item.quantity }} {{ item.price }}$
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                Total Price: {{ order.totalPrice }}$
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </div>
</template>

<style scoped lang="scss">
.v-list-item {
  border-bottom: 1px solid #e0e0e0;
}
</style>
