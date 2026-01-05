<script setup lang="ts">
import { computed } from "vue";
import type { RestaurantTable } from "../../api/openapi";

const props = defineProps<{
  table: RestaurantTable;
  pendingCount: number;
}>();

defineEmits<{
  click: [];
}>();

const isOccupied = computed(() => props.table.hasOpenGroup);

const statusColor = computed(() => {
  if (!props.table.active) return "grey";
  return isOccupied.value ? "error" : "success";
});

const statusText = computed(() => {
  if (!props.table.active) return "Inactive";
  return isOccupied.value ? "Occupied" : "Available";
});
</script>

<template>
  <v-card
    class="table-card"
    :class="{ 'table-card--inactive': !table.active }"
    hover
    @click="$emit('click')"
  >
    <div class="table-card__header" :class="`bg-${statusColor}`">
      <span class="text-h4 font-weight-bold">{{ table.tableNumber }}</span>
    </div>

    <v-card-text class="pa-3">
      <div class="d-flex justify-space-between align-center mb-2">
        <v-chip
          :color="statusColor"
          size="small"
          variant="tonal"
        >
          {{ statusText }}
        </v-chip>

        <v-badge
          v-if="pendingCount > 0"
          :content="pendingCount"
          color="warning"
          inline
        >
          <v-icon size="small">mdi-account-clock</v-icon>
        </v-badge>
      </div>

      <p v-if="table.description" class="text-body-2 text-grey mb-0 text-truncate">
        {{ table.description }}
      </p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.table-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
  overflow: hidden;
}

.table-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.table-card--inactive {
  opacity: 0.6;
}

.table-card__header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
