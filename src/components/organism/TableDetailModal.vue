<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { RestaurantTable, CustomerGroup } from "../../api/openapi";
import { useFetchGroups, useFetchPendingUsers, useFetchOrders } from "../../api/admin/queries";
import { useApproveUser, useRejectUser, useCloseGroup, useDeleteTable } from "../../api/admin/mutations";
import { GroupStatus } from "../../api/openapi";

const props = defineProps<{
  table: RestaurantTable;
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const activeTab = ref("registrations");
const rejectReason = ref("");
const showRejectDialog = ref(false);
const userToReject = ref<string | null>(null);

const { data: allGroups } = useFetchGroups(GroupStatus.OPEN);
const { data: pendingUsers, refetch: refetchPendingUsers } = useFetchPendingUsers(props.table.id);
const { data: tableOrders } = useFetchOrders(undefined, props.table.id);

const { mutate: approveUser, isPending: isApproving } = useApproveUser();
const { mutate: rejectUser, isPending: isRejecting } = useRejectUser();
const { mutate: closeGroup, isPending: isClosing } = useCloseGroup();
const { mutate: deleteTable, isPending: isDeleting } = useDeleteTable();

const openGroup = computed<CustomerGroup | undefined>(() => {
  return allGroups.value?.find(g => g.tableId === props.table.id);
});

const tablePendingUsers = computed(() => {
  return pendingUsers.value?.filter(u => u.tableId === props.table.id) || [];
});

const activeOrdersTotal = computed(() => {
  if (!tableOrders.value) return 0;
  return tableOrders.value
    .filter(order => order.status !== 'CANCELLED')
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    refetchPendingUsers();
  }
});

function handleApprove(userId: string) {
  approveUser(userId, {
    onError: (error: any) => {
      alert("Failed to approve user: " + error.message);
    },
  });
}

function openRejectDialog(userId: string) {
  userToReject.value = userId;
  rejectReason.value = "";
  showRejectDialog.value = true;
}

function handleReject() {
  if (!userToReject.value) return;
  rejectUser(
    {
      userId: userToReject.value,
      request: rejectReason.value ? { reason: rejectReason.value } : undefined,
    },
    {
      onSuccess: () => {
        showRejectDialog.value = false;
        userToReject.value = null;
      },
      onError: (error: any) => {
        alert("Failed to reject user: " + error.message);
      },
    }
  );
}

function handleCloseGroup() {
  if (!openGroup.value) return;
  if (!confirm("Are you sure you want to close this group? All users will be logged out.")) return;

  closeGroup(openGroup.value.id, {
    onError: (error: any) => {
      alert("Failed to close group: " + error.message);
    },
  });
}

function handleDeleteTable() {
  if (!confirm("Are you sure you want to delete this table?")) return;

  deleteTable(props.table.id, {
    onSuccess: () => {
      emit("close");
    },
    onError: (error: any) => {
      alert("Failed to delete table: " + error.message);
    },
  });
}
</script>

<template>
  <v-dialog :model-value="show" max-width="600" @update:model-value="$emit('close')">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-table-furniture</v-icon>
        Table #{{ table.tableNumber }}
        <v-chip
          class="ml-2"
          :color="table.hasOpenGroup ? 'error' : 'success'"
          size="small"
        >
          {{ table.hasOpenGroup ? "Occupied" : "Available" }}
        </v-chip>
        <v-spacer />
        <v-btn icon variant="text" @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-tabs v-model="activeTab" bg-color="transparent">
        <v-tab value="registrations">
          <v-badge
            v-if="tablePendingUsers.length > 0"
            :content="tablePendingUsers.length"
            color="warning"
            inline
          >
            Registrations
          </v-badge>
          <span v-else>Registrations</span>
        </v-tab>
        <v-tab value="orders">
          <v-badge
            v-if="tableOrders?.length"
            :content="tableOrders.length"
            color="primary"
            inline
          >
            Orders
          </v-badge>
          <span v-else>Orders</span>
        </v-tab>
        <v-tab value="info">Info</v-tab>
      </v-tabs>

      <v-card-text class="pa-0">
        <v-tabs-window v-model="activeTab">
          <!-- Registrations Tab -->
          <v-tabs-window-item value="registrations">
            <v-list v-if="tablePendingUsers.length > 0" lines="two">
              <v-list-item
                v-for="user in tablePendingUsers"
                :key="user.id"
              >
                <template #prepend>
                  <v-avatar color="primary" size="40">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title>{{ user.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  Waiting since {{ new Date(user.createdAt).toLocaleTimeString() }}
                </v-list-item-subtitle>

                <template #append>
                  <v-btn
                    color="success"
                    variant="tonal"
                    size="small"
                    class="mr-2"
                    :loading="isApproving"
                    @click.stop="handleApprove(user.id)"
                  >
                    <v-icon start>mdi-check</v-icon>
                    Approve
                  </v-btn>
                  <v-btn
                    color="error"
                    variant="tonal"
                    size="small"
                    @click.stop="openRejectDialog(user.id)"
                  >
                    <v-icon start>mdi-close</v-icon>
                    Reject
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <div v-else class="pa-8 text-center">
              <v-icon size="48" color="grey">mdi-account-check</v-icon>
              <p class="text-body-1 mt-4 text-grey">No pending registrations</p>
            </div>
          </v-tabs-window-item>

          <!-- Orders Tab -->
          <v-tabs-window-item value="orders">
            <v-list v-if="tableOrders?.length" lines="two">
              <v-list-item
                v-for="order in tableOrders"
                :key="order.id"
              >
                <template #prepend>
                  <v-avatar :color="order.status === 'PENDING' ? 'warning' : order.status === 'COMPLETED' ? 'success' : 'error'" size="40">
                    <v-icon>mdi-receipt</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="d-flex align-center">
                  Order #{{ order.id?.slice(0, 8) }}
                  <v-chip class="ml-2" :color="order.status === 'PENDING' ? 'warning' : order.status === 'COMPLETED' ? 'success' : 'error'" size="x-small">
                    {{ order.status }}
                  </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ order.items?.map(i => `${i.name} x${i.quantity}`).join(', ') }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  price: {{ order.totalPrice }}$ • {{ new Date(order.orderedAt!).toLocaleString() }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider v-if="tableOrders?.length" />
            <div v-if="tableOrders?.length" class="pa-4 d-flex justify-space-between align-center">
              <span class="text-body-1 font-weight-medium">Total (excl. cancelled)</span>
              <span class="text-h6 font-weight-bold">{{ activeOrdersTotal.toFixed(2) }}$</span>
            </div>

            <div v-else class="pa-8 text-center">
              <v-icon size="48" color="grey">mdi-receipt-text-outline</v-icon>
              <p class="text-body-1 mt-4 text-grey">No orders for this table</p>
            </div>
          </v-tabs-window-item>

          <!-- Info Tab -->
          <v-tabs-window-item value="info">
            <div class="pa-4">
              <v-list density="compact">
                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-identifier</v-icon>
                  </template>
                  <v-list-item-title>Table Number</v-list-item-title>
                  <v-list-item-subtitle>{{ table.tableNumber }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="table.description">
                  <template #prepend>
                    <v-icon>mdi-text</v-icon>
                  </template>
                  <v-list-item-title>Description</v-list-item-title>
                  <v-list-item-subtitle>{{ table.description }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title>Status</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ table.active ? "Active" : "Inactive" }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="openGroup">
                  <template #prepend>
                    <v-icon>mdi-account-group</v-icon>
                  </template>
                  <v-list-item-title>Current Group</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ openGroup.userCount }} user(s), {{ openGroup.orderCount }} order(s)
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          v-if="openGroup"
          color="warning"
          variant="tonal"
          :loading="isClosing"
          @click="handleCloseGroup"
        >
          <v-icon start>mdi-account-off</v-icon>
          Close Group
        </v-btn>

        <v-spacer />

        <v-btn
          color="error"
          variant="text"
          :loading="isDeleting"
          @click="handleDeleteTable"
        >
          <v-icon start>mdi-delete</v-icon>
          Delete Table
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Reject Dialog -->
    <v-dialog v-model="showRejectDialog" max-width="400">
      <v-card>
        <v-card-title>Reject User</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="rejectReason"
            label="Reason (optional)"
            rows="3"
            counter="255"
            maxlength="255"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showRejectDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            :loading="isRejecting"
            @click="handleReject"
          >
            Reject
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>
