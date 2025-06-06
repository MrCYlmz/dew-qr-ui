<script setup lang="ts">
import { ref } from "vue";
import { type Item } from "../../api/openapi";
import ItemFormDialog from "../molecules/ItemFormDialog.vue";
import { useItemSubmit } from "../../composables/useItemSubmit.ts";

const item = ref<Item>({
  name: "",
  description: "",
  category: "BEVERAGE",
  price: 0,
  available: true,
} as Item);
const imageData = ref<File | undefined>();

const { handleSubmit } = useItemSubmit();

const submitForm = async () => {
  await handleSubmit({ item: item.value, imageData: imageData.value });
};
</script>

<template>
  <ItemFormDialog icon="mdi-plus" tooltip="Create new item" v-model:item="item" v-model:imageData="imageData" @submit="submitForm" />
</template>
