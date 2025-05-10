<script setup lang="ts">
import { ref, watch } from "vue";
import rfdc from "rfdc";
import { useFetchItems } from "../api/user/queries";
import { type Item } from "../api/openapi";
import ItemForm from "./ItemForm.vue";
import { useItemSubmit } from "../composables/useItemSubmit";

const clone = rfdc();

const selectedItemId = ref<string | null>(null);
const clonedItem = ref<Item>({} as Item);
const imageData = ref<File>();

const { data: items } = useFetchItems();
const { handleSubmit } = useItemSubmit();

watch(selectedItemId, (id) => {
  if (id) {
    const item = items.value?.find((i: Item) => i.id === id);
    clonedItem.value = item ? clone(item) : {} as Item;
  }
});

const submitForm = async () => {
  await handleSubmit({ item: clonedItem.value, imageData: imageData.value, isUpdate: true });
};
</script>

<template>
  <v-card>
    <v-card-text>
      <v-select
        v-model="selectedItemId"
        :items="items?.map(item => ({ text: item.name, value: item.id }))"
        label="Select Item"
        item-text="text"
        item-value="value"
      ></v-select>
    </v-card-text>
    <v-divider></v-divider>
    <ItemForm
      v-model:item="clonedItem"
      v-model:imageData="imageData"
      @submit="submitForm"
    />
  </v-card>
</template>
