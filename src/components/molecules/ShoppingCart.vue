<script setup lang="ts">
import { computed } from 'vue';
import { useShoppingCart } from "../../composables/useShoppingCart.ts";
import { usePlaceOrder } from '../../api/user/mutations.ts';
import { getIdFromJWT } from '../../utils/jwtUtils.ts';
import type { FrontendOrder } from '../../api/openapi';

defineProps({
  isVisible: {
    type: Boolean,
    default: true,
  },
});
const { shoppingCart, decrementItemQuantity, clearCart,incrementItemQuantity } = useShoppingCart();
const cartItems = computed(() => shoppingCart?.items);
const hasItemsInCart = computed(() => cartItems.value.length > 0);

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const payload = computed<FrontendOrder>(() => {
  return {
    customer: { id: getIdFromJWT()! }, // Ensure this matches the OrderCustomer type
    items: shoppingCart?.items!,
    totalPrice: totalPrice.value,
    orderedAt: new Date().toISOString(),
  };
});

const { mutate: placeOrder } = usePlaceOrder();
const checkout = () => {
  if (shoppingCart) {
    placeOrder( payload.value , {
      onSuccess: () => {
        console.log('Order placed successfully');
        clearCart();
      },
      onError: (error: { message: string }) => {
        alert('Order failed: ' + error.message);
      },
    });
  }
};
</script>
<template>
      <v-menu v-if="isVisible" offset-y :close-on-content-click="false">
      <template #activator="{ props }">
         <v-btn stacked>
        <v-badge
          v-bind="props"
          color="red"
          dot
          v-model="hasItemsInCart"
        >
          <v-icon class="shopping-cart-icon">mdi-cart</v-icon>
        </v-badge>
        </v-btn>
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
        <v-list-item-subtitle>Price: {{ item.price * item.quantity }} $</v-list-item-subtitle>
        <v-btn icon @click="decrementItemQuantity(item.itemId)">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn icon @click="incrementItemQuantity(item)">
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
    </v-menu>
  
</template>
