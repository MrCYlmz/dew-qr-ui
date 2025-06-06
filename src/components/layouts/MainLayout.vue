<script setup lang="ts">
import OrderSummary from "../organism/OrderSummary.vue";
</script>

<template>
    <v-layout>
      <OrderSummary />
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
</template>
