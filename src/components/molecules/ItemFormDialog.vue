<script setup lang="ts">
import { ref } from "vue";
import { ItemCategoryEnum, type Item } from "../../api/openapi";
import { rules } from "../../utils/rules";
defineProps<{
  icon: string,
  tooltip: string
  disabled?: boolean
}>();
const item = defineModel<Item>("item", {
    required: true,
});
const imageData = defineModel<File | undefined>("imageData", {
    required: true,
    default: undefined,
});
const emit = defineEmits(["submit", "reset"]);

const {required, fileSize, price, maxLength } = rules;

const dialog = ref(false);
function handleClose() {
    emit("reset");
    dialog.value = false;
}
function handleSubmit() {
    if (isFormValid.value) {
      emit("submit");
      dialog.value = false;
    }
}
const items = Object.values(ItemCategoryEnum).map((category) => ({
  title: category.toLowerCase(),
  value: category,
}));

const isFormValid = ref();

</script>

<template>
  <v-dialog v-model="dialog">
    <template #activator="{ props: activatorProps }">
      <v-tooltip :text="tooltip">
        <template #activator="{ props: tooltipProps }">
          <v-btn v-bind="{ ...activatorProps, ...tooltipProps }" :icon="icon" :disabled="disabled" />
        </template>
      </v-tooltip>
    </template>
    <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
      <v-card>
        <v-card-title class="d-flex justify-end pa-2">
          <v-btn icon @click="handleClose()" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="item.name"
            label="Name"
            :rules="[required, maxLength(50)]"
          ></v-text-field>
          
          <v-text-field
            v-model.number="item.price"
            label="Price"
            type="number"
            :rules="[required, price]"
          ></v-text-field>
          
          <v-text-field
            class="description-input"
            v-model="item.description"
            label="Description"
            :rules="[required, maxLength(255)]"
          ></v-text-field>
          
          <v-select
            v-model="item.category"
            :items="items"
            label="Category"
            :rules="[required]"
          ></v-select>
          
          <v-switch
            v-model="item.available"
            label="Available"
          ></v-switch>
          
          <v-file-input
            id="file-input"
            v-model="imageData"
            label="Image"
            accept="image/*"
            :rules="[fileSize(500)]"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn
            type="submit"
            variant="flat"
            color="primary"
            :disabled="!isFormValid"
          >
            Add Item
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<style scoped lang="scss">
.v-card-text {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  .v-file-input {
    grid-column: span 2;
  }
  .description-input {
    grid-column: span 2;
  }
  .v-select {
    grid-column: span 2;
  }

}
</style>