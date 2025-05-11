<script setup lang="ts">
import { ItemCategoryEnum } from "../../api/openapi";
import ItemCard from "../molecules/ItemCard.vue";
import { ref, computed } from "vue";
import { useFetchItems } from "../../api/user/queries.ts";

const { data: items } = useFetchItems();
const selectedCategory = ref("");
const categories = Object.values(ItemCategoryEnum);
const filteredItems = computed(() =>
  selectedCategory.value
    ? items.value?.filter((item) => item.category === selectedCategory.value)
    : items.value
);
</script>

<template>
  <div class="home-page">
    <v-tabs v-model="selectedCategory">
      <v-tab v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </v-tab>
    </v-tabs>
    <div class="items">
      <div v-for="item in filteredItems" :key="item.id">
        <ItemCard :item="item" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  .items {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 16px;
    justify-content: center;
  }

  .v-tabs {
    margin-bottom: 16px;
    justify-self: center;
  }
}
</style>
