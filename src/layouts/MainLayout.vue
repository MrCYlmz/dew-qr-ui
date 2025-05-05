<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ShoppingCart from "../components/ShoppingCart.vue";
import OrderSummary from "../components/OrderSummary.vue";

const route = useRoute();
const isAdminPath = computed(() => route.path === "/admin-dashboard");
</script>
<template>
  <header>
    <p>My App</p>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/admin-dashboard">Admin</router-link>
    </nav>
    <ShoppingCart :is-visible="!isAdminPath" />
  </header>
  <main>
    <router-view />
  </main>
  <footer>
    <OrderSummary :is-visible="!isAdminPath" />
  </footer>
</template>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  nav a {
    margin: 0 8px;
    text-decoration: none;
    color: #333;
  }

  .shopping-cart-icon {
    margin-left: auto;
    cursor: pointer;
    color: #333;
  }
}

main {
  padding: 1rem;
  justify-self: center;
}

footer {
  position: fixed;
  bottom: 5rem;
  left: 0;
  width: 100%;
  z-index: 1000;
}
</style>
