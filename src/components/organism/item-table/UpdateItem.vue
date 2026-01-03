<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { type Item } from "../../../api/openapi";
import ItemFormDialog from "../../molecules/ItemFormDialog.vue";
import { useItemSubmit } from "../../../composables/useItemSubmit";
import rfdc from "rfdc";

const props = defineProps<{
  selectedItem?: Item
  disabled: boolean;
}>();
const clone = rfdc();
const clonedItem = ref<Item>({} as Item);
const imageData = ref<File>();
const { updateImageMutation, updateItemWithImage } = useItemSubmit();
watch(
  () => props.selectedItem,
  (newValue) => {
    if (newValue) {
      clonedItem.value = clone(newValue);
    }
  },
  { immediate: true }
);
const isFormUpdated = computed(() => {
  return JSON.stringify(clonedItem.value) !== JSON.stringify(props.selectedItem);
});
const isFormDisabled = computed(() => !isFormUpdated.value && !imageData.value);

const submitForm = async () => {
  if (isFormUpdated.value)
    await updateItemWithImage({ item: clonedItem.value, imageData: imageData.value });
  else{
  if (imageData.value){
    await updateImageMutation({ itemId: clonedItem.value.id, imageData: imageData.value });
  }
  else  return;
  }
  resetForm();
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
      :isFormDisabled="isFormDisabled"
      @submit="submitForm"
      @reset="resetForm"
    />
</template>
