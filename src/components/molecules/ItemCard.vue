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
    <v-img :src="isFetched && imageUrl ? imageUrl : undefined" cover> </v-img>

    <v-card-title>
      {{ item.name }}
    </v-card-title>

    <v-card-actions>
      <v-btn icon="mdi-plus" color="primary" @click="addToCart"></v-btn>
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
          {{
            item.price
              ? `Price: ${item.price.toFixed(2)}€`
              : "Price not available"
          }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<style scoped lang="scss">
.v-img {
  height: 154px;
  width: 154px;
  object-fit: cover;
  background-color: var(--v-primary-base);
}
</style>
