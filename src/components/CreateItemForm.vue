<script setup lang="ts">
import { computed, ref } from "vue";
import { ItemCategoryEnum , type Item} from "../api/openapi";
import {useAddImage, useAddItem} from "../api/admin/mutations.ts";

const { mutate: addItem } = useAddItem();
const { mutate: addImage } = useAddImage();

const name = ref<string>("");
const description = ref<string>("");
const category = ref<ItemCategoryEnum>('BEVERAGE');
const price = ref<number>(0);
const available = ref<boolean>(false);
const imageData = ref<File | null>(null);

const items = Object.values(ItemCategoryEnum).map((category) => ({
  title: category.toLowerCase(),
  value: category,
}));
const payload = computed(() => ({
  name: name.value,
  description: description.value,
  category: category.value,
  price: price.value,
  available: available.value,
}));

const handleAddItem = async () => {
  try {
    addItem(payload.value as Item, {
      onSuccess: (res) => {
        const item = res.data;
        if (imageData.value) {
          const formData = new FormData();
          formData.append("file", imageData.value);
          addImage({ itemId: item.id!, file: imageData.value });
        }
      },
      onError: () => {
        // Handle error (e.g., show an error message)
      },
    });
    // Handle success (e.g., show a success message)
  } catch (error) {
    // Handle error (e.g., show an error message)
  }
};
</script>

<template>

    <v-form @submit.prevent="handleAddItem">
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="name"
            label="Name"
          ></v-text-field>
          
          <v-text-field v-model.number="price" label="Price" type="number"></v-text-field>
          <v-text-field
            class="description-input"
            v-model="description"
            label="Description"
          ></v-text-field>
          <v-select v-model="category" :items="items" label="Category"></v-select>
          <v-switch v-model="available" label="Available"></v-switch>
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
  .v-select{
    .input {
      opacity: 0;
    }
  }
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
