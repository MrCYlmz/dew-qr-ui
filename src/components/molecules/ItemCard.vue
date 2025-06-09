<script setup lang="ts">
import type { Item } from "../../api/openapi";
import { ref } from "vue";
import { useShoppingCart } from "../../composables/useShoppingCart.ts";
import DisplayImage from "./DisplayImage.vue";

const show = ref(false);
const props = defineProps<{ item: Item }>();
const { incrementItemQuantity } = useShoppingCart();

const addToCart = () =>
  incrementItemQuantity({
    itemId: props.item.id!,
    name: props.item.name!,
    price: props.item.price,
  });
</script>
<template>
  <v-card>
    <DisplayImage
      :id="item.id"
    ></DisplayImage>
    <v-card-title>
      {{ item.name }}
    </v-card-title>

    <v-card-actions>
      <v-btn icon="mdi-cart-plus" color="primary" @click="addToCart"></v-btn>
      <v-spacer></v-spacer>

      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        color="primary"
        @click="show = !show"
      ></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          {{ item.description || "Default subtitle" }}
          <br />
          {{`Price: ${item.price.toFixed(2)}€`}}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
