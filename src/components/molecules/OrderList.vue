<script setup lang="ts">
import type { FrontendOrder, AdminOrder } from "../../api/openapi";

defineProps<{
  title: string;
  orders?: FrontendOrder[] | AdminOrder[] ;
  actions?: { label: string; color: string; action: (orderId: string) => void }[];
}>();
function clickDegugger(orderId: string, action: (orderId: string) => void) {
  console.log("Clicked order ID: ", orderId);
  action(orderId);
}
</script>

<template>
    <v-expansion-panel :title="title">
      <v-expansion-panel-text>
        <v-list>
          <v-list-item v-for="order in orders || []" :key="order.id">
              <v-list-item-title>
                <slot name = "title">
                  Ordered at: {{ order.orderedAt }}
                </slot>
                
              </v-list-item-title>
              <v-list-item-subtitle v-for="item in order.items" :key="item.name">
                {{ item.name }} x {{ item.quantity }} {{ item.price }}$
              </v-list-item-subtitle>
              <v-list-item-subtitle>Total Price: {{ order.totalPrice }}$</v-list-item-subtitle>
            <div class="actions" v-if="actions">
              <v-btn
                v-for="action in actions"
                :key="action.label"
                :color="action.color"
                @click="clickDegugger(order.id!, action.action)"
              >
                {{ action.label }}
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
        <slot name="footer"></slot>
      </v-expansion-panel-text>
    </v-expansion-panel>

</template>

<style scoped lang="scss">
.v-list-item {
  border-bottom: 1px solid #e0e0e0;
}
</style>
