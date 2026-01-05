<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";
import { clearJWTToken } from "../../utils/jwtUtils";
import { useFetchPendingUsers } from "../../api/admin/queries";

const router = useRouter();
const route = useRoute();

const { data: pendingUsers } = useFetchPendingUsers();

const pendingCount = computed(() => pendingUsers.value?.length || 0);

const navItems = [
  { title: "Tables", icon: "mdi-table-furniture", to: "/admin/tables" },
  { title: "Orders", icon: "mdi-clipboard-list", to: "/admin/order-manager" },
];

const currentPath = computed(() => route.path);

function logout() {
  clearJWTToken();
  router.push("/admin-login");
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>
        <v-icon class="mr-2">mdi-shield-account</v-icon>
        Admin Panel
      </v-app-bar-title>

      <template #append>
        <v-badge
          v-if="pendingCount > 0"
          :content="pendingCount"
          color="warning"
          class="mr-4"
        >
          <v-icon>mdi-account-clock</v-icon>
        </v-badge>

        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer permanent>
      <v-list nav density="compact">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :active="currentPath === item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        >
          <template v-if="item.to === '/admin/tables' && pendingCount > 0" #append>
            <v-badge :content="pendingCount" color="warning" inline />
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
