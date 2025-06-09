<script setup lang="ts">
import MainHeader from "../organism/MainHeader.vue";
</script>

<template>
    <v-layout>
      <MainHeader />
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
</template>
