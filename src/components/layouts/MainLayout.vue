<script setup lang="ts">
import ShoppingCart from "../molecules/ShoppingCart.vue";
import OrderSummary from "../organism/OrderSummary.vue";
import { ref } from "vue";

const isOrderSummaryExpanded = ref(false);
</script>

<template>
  <div class="main-layout">
    <header v-if="!isOrderSummaryExpanded">
      <p>My App</p>
      <ShoppingCart />
    </header>
    <main v-if="!isOrderSummaryExpanded">
      <router-view />
    </main>
    <footer>
      <OrderSummary :expanded="isOrderSummaryExpanded" @toggle="isOrderSummaryExpanded = !isOrderSummaryExpanded" />
    </footer>
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;

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
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }

  footer {
    position: relative;
    transition: all 0.3s ease;
    overflow: hidden;

    &.expanded {
      height: 100%;
    }
  }
}
</style>
