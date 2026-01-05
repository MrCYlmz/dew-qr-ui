<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { authApi } from "../../api/openapi";
import { getIdFromJWT, clearJWTToken } from "../../utils/jwtUtils";
import type { UserStatus } from "../../api/openapi";

const router = useRouter();
const userStatus = ref<UserStatus | null>(null);
const rejectionReason = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
let pollingInterval: ReturnType<typeof setInterval> | null = null;

const userName = ref(localStorage.getItem("pendingUserName") || "");
const tableNumber = ref(localStorage.getItem("pendingTableNumber") || "");

const statusMessage = computed(() => {
  if (userStatus.value === "PENDING") {
    return "Please wait for an employee to approve your registration.";
  } else if (userStatus.value === "REJECTED") {
    return rejectionReason.value
      ? `Your registration was rejected: ${rejectionReason.value}`
      : "Your registration was rejected.";
  } else if (userStatus.value === "APPROVED") {
    return "You have been approved! Redirecting...";
  }
  return "Checking your status...";
});

const statusColor = computed(() => {
  if (userStatus.value === "PENDING") return "warning";
  if (userStatus.value === "REJECTED") return "error";
  if (userStatus.value === "APPROVED") return "success";
  return "info";
});

async function checkStatus() {
  const userId = getIdFromJWT();
  if (!userId) {
    error.value = "No user session found. Please login again.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await authApi.getUserStatus(userId);
    userStatus.value = response.data.status;
    rejectionReason.value = response.data.rejectionReason || null;
    isLoading.value = false;

    if (response.data.status === "APPROVED") {
      stopPolling();
      localStorage.removeItem("pendingUserName");
      localStorage.removeItem("pendingTableNumber");
      router.push("/home");
    }
  } catch (err: any) {
    error.value = err.message || "Failed to check status";
    isLoading.value = false;
  }
}

function startPolling() {
  checkStatus();
  pollingInterval = setInterval(checkStatus, 5000);
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

function tryAgain() {
  clearJWTToken();
  localStorage.removeItem("pendingUserName");
  localStorage.removeItem("pendingTableNumber");
  router.push("/user-login?tableNumber=" + tableNumber.value);
}

onMounted(() => {
  startPolling();
});

onUnmounted(() => {
  stopPolling();
});
</script>

<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card class="pa-6 text-center" max-width="450" min-width="350">
      <v-card-title class="text-h5 mb-4">
        <v-icon size="large" class="mr-2">mdi-account-clock</v-icon>
        Waiting for Approval
      </v-card-title>

      <v-card-text>
        <div v-if="userName" class="text-h6 mb-2">
          Hello, {{ userName }}!
        </div>

        <div v-if="tableNumber" class="text-subtitle-1 mb-4">
          Table #{{ tableNumber }}
        </div>

        <v-alert
          v-if="!error"
          :type="statusColor"
          variant="tonal"
          class="mb-4"
        >
          <div class="d-flex align-center">
            <v-progress-circular
              v-if="userStatus === 'PENDING'"
              indeterminate
              size="20"
              width="2"
              class="mr-3"
            ></v-progress-circular>
            <v-icon v-else-if="userStatus === 'REJECTED'" class="mr-3">mdi-close-circle</v-icon>
            <v-icon v-else-if="userStatus === 'APPROVED'" class="mr-3">mdi-check-circle</v-icon>
            {{ statusMessage }}
          </div>
        </v-alert>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ error }}
        </v-alert>

        <div v-if="userStatus === 'PENDING'" class="text-body-2 text-grey">
          <v-icon size="small" class="mr-1">mdi-hand-wave</v-icon>
          Please call an employee to approve your registration.
        </div>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn
          v-if="userStatus === 'REJECTED' || error"
          color="primary"
          variant="elevated"
          @click="tryAgain"
        >
          <v-icon start>mdi-refresh</v-icon>
          Try Again
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>
