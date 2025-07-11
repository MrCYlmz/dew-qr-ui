<script setup lang="ts">
import { useFetchItems } from "../../../api/user/queries.ts";
import UpdateItem from "./UpdateItem.vue";
import CreateItem from "./CreateItem.vue";
import DisplayImage from "../molecules/DisplayImage.vue";
import { computed, ref } from "vue";
import type { Item } from "@mrcylmz/dewqr-api-generator";

const { data: items } = useFetchItems();
const headers = [
  { title: "Name", key: "name" },
  { title: "Catagory", key: "category" },
  { title: "Price", key: "price" },
  { title: "Status", key: "available" },
  { title: "Image", key: "image",sortable: false },
];
const selectedItemId = ref<string[]>([]);
const selectedItem = computed(() => {
  return (
    items.value?.find((item) => item.id === selectedItemId.value?.[0]) ??
    ({} as Item)
  );
});
const getColor = (value: boolean) => {
  return value ? "success" : "warning";
};

</script>

<template>
  <v-expansion-panel title="Manage Items">
    <v-expansion-panel-text>
      <v-data-table
        :items="items"
        :headers="headers"
        show-select
        select-strategy="single"
        item-value="id"
        v-model="selectedItemId"
      >
        <template v-slot:top>
          <v-toolbar color="primary">
            <v-toolbar-title>Items</v-toolbar-title>
            <template v-slot:append>
              <UpdateItem
                :selectedItem="selectedItem"
                :disabled="!(selectedItemId.length > 0)"
              />
              <CreateItem />
            </template>
          </v-toolbar>
        </template>
        <template v-slot:item.available="{ value }">
          <v-chip
            :border="`${getColor(value)} thin opacity-25`"
            :color="getColor(value)"
            :text="value ? 'Available' : 'Not Available'"
            size="x-small"
          ></v-chip>
        </template>
        <template v-slot:item.price="{ value }">
          {{ `${value.toFixed(2)}€` }}
        </template>
        <template v-slot:item.image="{ item }">
          <DisplayImage
            :id="item.id"
          ></DisplayImage>
        </template>
      </v-data-table>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
<style scoped lang="scss">
.v-data-table {
  text-align: start;
  .v-toolbar {
    padding: 0;
  }
  .v-toolbar-title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .v-img {
    border-radius: 4px;
    background-color: var(--v-primary-base);
    object-fit: cover;
  }
}
</style>
