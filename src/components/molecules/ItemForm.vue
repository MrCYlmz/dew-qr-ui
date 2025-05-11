<script setup lang="ts">
import { ref } from "vue";
import { ItemCategoryEnum, type Item } from "../../api/openapi";
import { rules } from "../../utils/rules";

const {required, fileSize, price, maxLength } = rules;
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

const isFormValid = ref();

</script>

<template>
    <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="item.name"
            label="Name"
            :rules="[required maxLength(50)]"
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