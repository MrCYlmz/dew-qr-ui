<script setup lang="ts">
import type { Item } from "../../api/openapi";
import { computed, ref } from "vue";
import { useFetchImage } from "../../api/user/queries.ts";
import { useShoppingCart } from "../../composables/useShoppingCart.ts";

const show = ref(false);
const props = defineProps<{ item: Item }>();
const { data: imageBlob, isFetched } = useFetchImage(props.item.id!);
const imageUrl = computed(() =>
  imageBlob.value ? URL.createObjectURL(imageBlob.value) : undefined
);
const { addItem } = useShoppingCart();

const addToCart = () =>
  addItem({
    itemId: props.item.id!,
    name: props.item.name!,
    price: props.item.price,
  });
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
