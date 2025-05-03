<script setup lang="ts">
import type { Item } from "../api/openapi";
import { computed, ref, watch, inject } from "vue";
import {useFetchImage} from "../api/user/queries.ts";

const show = ref(false);
const props = defineProps<{ item: Item }>();
const { data: imageBlob, isFetched } = useFetchImage(props.item.id!);
const imageUrl = computed(() =>
  imageBlob.value ? URL.createObjectURL(imageBlob.value) : undefined
);

const shoppingCart = inject<{ items: { id: string; name: string; quantity: number, price: number }[] }>('shoppingCart');

const addToCart = () => {
  if (props.item.id && shoppingCart) {
    const existingItem = shoppingCart.items.find(cartItem => cartItem.id === props.item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      shoppingCart.items.push({ id: (props.item.id), name: props.item.name!, quantity: 1, price: props.item.price });
    }
    console.log('Added to cart:', props.item.id);
  }
};

watch(
  imageBlob,
  (newValue) => {
    if (newValue) {
      console.log("imageBlob", newValue);
      console.log("imageUrl", imageUrl.value);
    }
  },
  { immediate: true }
);
</script>
<template>
  <v-card>
    <v-img v-if="isFetched && imageUrl" :src="imageUrl" cover></v-img>

    <v-card-title>
      {{ item.name }}
    </v-card-title>

    <v-card-subtitle>
      {{ item.description || "Default subtitle" }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn variant="flat" color="primary" @click="addToCart">Order</v-btn>

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
          {{ item.description || "Default description" }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
