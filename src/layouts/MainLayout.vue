<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ShoppingCart from '../components/ShoppingCart.vue';

const route = useRoute();
const isAdminPath = computed(() => route.path === '/admin');
</script>
<template>
<header>
  <p>My App</p>
  <nav>
    <router-link to="/home">Home</router-link>
    <router-link to="/admin">Admin</router-link>
    <!-- Shopping cart menu -->
    <v-menu v-if="!isAdminPath" offset-y :close-on-content-click="false">
      <template #activator="{ props }">
        <v-badge
          v-bind="props"
          color="red"
          dot
        >
          <v-icon class="shopping-cart-icon">mdi-cart</v-icon>
        </v-badge>
      </template>
      <ShoppingCart />
    </v-menu>
  </nav>
</header>
<main>
  <router-view />
</main>
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


</style>
