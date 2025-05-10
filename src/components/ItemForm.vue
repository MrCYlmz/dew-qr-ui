<script setup lang="ts">
import { ItemCategoryEnum, type Item } from "../api/openapi";

const item = defineModel<Item>("item", {
    required: true,
    default: {
        name: "",
        description: "",
        category: "BEVERAGE",
        price: 0,
        available: true,
    },
});
const imageData = defineModel<File | undefined>("imageData", {
    required: true,
    default: undefined,
});
const emit = defineEmits(["submit"]);

function handleSubmit() {
    emit("submit");
}
const items = Object.values(ItemCategoryEnum).map((category) => ({
  title: category.toLowerCase(),
  value: category,
}));

</script>

<template>
    <v-form @submit.prevent="handleSubmit">
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="item.name"
            label="Name"
          ></v-text-field>
          
          <v-text-field v-model.number="item.price" label="Price" type="number"></v-text-field>
          <v-text-field
            class="description-input"
            v-model="item.description"
            label="Description"
          ></v-text-field>
          <v-select v-model="item.category" :items="items" label="Category"></v-select>
          <v-switch v-model="item.available" label="Available"></v-switch>
          <v-file-input
            id="file-input"
            v-model="imageData"
            label="Image"
            accept="image/*"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit" variant="flat" color="primary">Add Item</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
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