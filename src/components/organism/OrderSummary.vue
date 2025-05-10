<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { useFetchUserOrders } from "../../api/user/queries.ts";
import { getIdFromJWT } from "../../utils/jwtUtils.ts";
import OrderList from "../molecules/OrderList.vue";

const props = defineProps({
  expanded: Boolean,
});

const emit = defineEmits(["toggle"]);

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
</script>

<template>
  <div class="order-summary" :class="{ expanded: props.expanded }" color="primary">
    <div class="summary-header">
      <v-btn block color="primary" @click="$emit('toggle')">
        {{ props.expanded ? "Collapse" : "Expand" }}
      </v-btn>
      <strong>Total Price: {{ totalPrice }}$</strong>
    </div>
    <div v-if="props.expanded" class="summary-details">
      <v-expansion-panels>
        <OrderList title="Cancelled Orders" :orders="cancelledOrders" />
        <OrderList title="Pending Orders" :orders="pendingOrders" />
        <OrderList title="Completed Orders" :orders="completedOrders" />
        <v-divider></v-divider>
      </v-expansion-panels>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-summary {
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);

  &.expanded {
    padding: 1.5rem;
  }

  .summary-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .summary-details {
    margin-top: 1rem;
  }

  &.expanded .summary-header {
    align-items: flex-start;
  }
}
</style>
