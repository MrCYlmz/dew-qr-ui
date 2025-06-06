<script setup lang="ts">
import { ref, watch } from "vue";
import { type Item } from "../../api/openapi";
import ItemFormDialog from "../molecules/ItemFormDialog.vue";
import { useItemSubmit } from "../../composables/useItemSubmit.ts";
import rfdc from "rfdc";

const props = defineProps<{
  selectedItem?: Item
  disabled?: boolean;
}>();
const clone = rfdc();

const clonedItem = ref<Item>({} as Item);
const imageData = ref<File>();
const { handleSubmit } = useItemSubmit();
watch(
  () => props.selectedItem,
  (newValue) => {
    if (newValue) {
      clonedItem.value = clone(newValue);
    }
  },
  { immediate: true }
);
const submitForm = async () => {
  if(clonedItem.value) {
    await handleSubmit({ item: clonedItem.value, imageData: imageData.value, isUpdate: true });
  }
};
const resetForm = () => {
  clonedItem.value = props.selectedItem ? clone(props.selectedItem) : ({} as Item);
  imageData.value = undefined;
};
</script>

<template>

    <ItemFormDialog
      icon="mdi-pencil"
      tooltip="Update item"
      v-model:item="clonedItem"
      v-model:imageData="imageData"
      :disabled="disabled"
      @submit="submitForm"
      @reset="resetForm"
    />
</template>
