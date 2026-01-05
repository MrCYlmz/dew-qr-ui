<script setup lang="ts">
import { ref, computed } from "vue";
import { useFetchTables, useFetchPendingUsers } from "../../api/admin/queries";
import { useCreateTable } from "../../api/admin/mutations";
import TableCard from "../molecules/TableCard.vue";
import TableDetailModal from "../organism/TableDetailModal.vue";
import type { RestaurantTable } from "../../api/openapi";

const { data: tables, isLoading: tablesLoading } = useFetchTables();
const { data: pendingUsers } = useFetchPendingUsers();

const selectedTable = ref<RestaurantTable | null>(null);
const showDetailModal = ref(false);
const showCreateDialog = ref(false);
const newTableNumber = ref<number | null>(null);
const newTableDescription = ref("");

const { mutate: createTable, isPending: isCreating } = useCreateTable();

const sortedTables = computed(() => {
  if (!tables.value) return [];
  return [...tables.value].sort((a, b) => a.tableNumber - b.tableNumber);
});

const pendingCountByTable = computed(() => {
  const counts: Record<string, number> = {};
  pendingUsers.value?.forEach(user => {
    const tableId = user.tableId;
    counts[tableId] = (counts[tableId] || 0) + 1;
  });
  return counts;
});

function openTableDetail(table: RestaurantTable) {
  selectedTable.value = table;
  showDetailModal.value = true;
}

function closeDetailModal() {
  showDetailModal.value = false;
  selectedTable.value = null;
}

function openCreateDialog() {
  newTableNumber.value = null;
  newTableDescription.value = "";
  showCreateDialog.value = true;
}

function handleCreateTable() {
  if (newTableNumber.value === null) return;
  createTable(
    {
      tableNumber: newTableNumber.value,
      description: newTableDescription.value || undefined,
    },
    {
      onSuccess: () => {
        showCreateDialog.value = false;
      },
      onError: (error: any) => {
        alert("Failed to create table: " + error.message);
      },
    }
  );
}
</script>

<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4">Tables</h1>
      <v-btn color="primary" @click="openCreateDialog">
        <v-icon start>mdi-plus</v-icon>
        Add Table
      </v-btn>
    </div>

    <v-progress-linear v-if="tablesLoading" indeterminate color="primary" />

    <div v-else-if="sortedTables.length === 0" class="text-center py-8">
      <v-icon size="64" color="grey">mdi-table-furniture</v-icon>
      <p class="text-h6 mt-4 text-grey">No tables configured</p>
      <p class="text-body-2 text-grey">Click "Add Table" to create your first table</p>
    </div>

    <v-row v-else>
      <v-col
        v-for="table in sortedTables"
        :key="table.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <TableCard
          :table="table"
          :pending-count="pendingCountByTable[table.id] || 0"
          @click="openTableDetail(table)"
        />
      </v-col>
    </v-row>

    <TableDetailModal
      v-if="selectedTable"
      :table="selectedTable"
      :show="showDetailModal"
      @close="closeDetailModal"
    />

    <v-dialog v-model="showCreateDialog" max-width="400">
      <v-card>
        <v-card-title>Create New Table</v-card-title>
        <v-card-text>
          <v-text-field
            v-model.number="newTableNumber"
            label="Table Number"
            type="number"
            :rules="[(v: any) => !!v || 'Required']"
            required
          />
          <v-text-field
            v-model="newTableDescription"
            label="Description (optional)"
            counter="100"
            maxlength="100"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="isCreating"
            :disabled="!newTableNumber"
            @click="handleCreateTable"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
