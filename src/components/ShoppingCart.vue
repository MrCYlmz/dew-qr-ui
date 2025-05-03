<script setup lang="ts">
import { computed, inject } from 'vue';
import { usePlaceOrder } from '../api/user/mutations';
import { getUserId } from '../utils/jwtUtils';

const shoppingCart = inject<{ items: { itemId: string; name: string; quantity: number , price: number }[] }>('shoppingCart');
const cartItems = computed(() => shoppingCart?.items || []);
const hasItemsInCart = computed(() => cartItems.value.length > 0);

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

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

const payload = computed(() => {
  return {
    userId: getUserId()!,
    items: shoppingCart?.items!,
  };
});

const { mutate: placeOrder } = usePlaceOrder();
const checkout = () => {
  if (shoppingCart) {
    placeOrder( payload.value , {
      onSuccess: () => {
        console.log('Order placed successfully');
        shoppingCart.items.splice(0, shoppingCart.items.length);
      },
      onError: (error: { message: string }) => {
        alert('Order failed: ' + error.message);
      },
    });
  }
};
</script>
<template>
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
        <v-list-item-subtitle>Price: {{ item.price * item.quantity }} $</v-list-item-subtitle>
        <v-btn icon @click="decreaseQuantity(index)">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn icon @click="increaseQuantity(index)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-card-text>
      <strong>Total Price: {{ totalPrice }} $</strong>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="primary" block @click="checkout">Checkout</v-btn>
    </v-card-actions>
  </v-card>
</template>
