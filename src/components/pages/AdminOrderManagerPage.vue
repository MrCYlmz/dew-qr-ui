<script setup lang="ts">
import { ref } from 'vue';
import AdminOrderManager from '../organism/AdminOrderManager.vue';
import ItemTable from '../organism/item-table/ItemTable.vue';
const panels = ref([0])
</script>

<template>
    <v-expansion-panels v-model="panels" multiple variant="accordion" >
      <AdminOrderManager />
      <ItemTable />
</v-expansion-panels>
  
</template>
