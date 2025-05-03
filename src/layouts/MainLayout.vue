<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAdminPath = computed(() => route.path === '/admin');

const shoppingCart = inject<{ items: { id: number; name: string; quantity: number }[] }>('shoppingCart');
const cartItems = computed(() => shoppingCart?.items || []);
const hasItemsInCart = computed(() => {
  console.log('cartItems', cartItems.value);
  console.log('hasItemsInCart', cartItems.value.length > 0);
  return cartItems.value.length > 0});

const increaseQuantity = (index: number) => {
  if (shoppingCart) shoppingCart.items[index].quantity++;
};

const decreaseQuantity = (index: number) => {
  if (shoppingCart && shoppingCart.items[index].quantity > 1) {
    shoppingCart.items[index].quantity--;
  } else if (shoppingCart) {
    shoppingCart.items.splice(index, 1);
  }
};
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
          v-model="hasItemsInCart"
          color="red"
          dot
        >
          <v-icon class="shopping-cart-icon">mdi-cart</v-icon>
        </v-badge>
      </template>
      <v-card>
        <v-card-title>Shopping Cart</v-card-title>
        <v-divider></v-divider>
        <v-list>
          <v-list-item
            v-for="(item, index) in cartItems"
            :key="index"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>Quantity: {{ item.quantity }}</v-list-item-subtitle>
            <v-btn icon @click="decreaseQuantity(index)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn icon @click="increaseQuantity(index)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" block>Checkout</v-btn>
        </v-card-actions>
      </v-card>
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
