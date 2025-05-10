<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import {useUserLogin} from "../../api/auth/mutations.ts";
  
  const credentials = ref({ name: '', tableNumber: 0 });
  const router = useRouter();
  const { mutate } = useUserLogin();
  
  function login() {
      mutate(credentials.value, {
        onSuccess: () => {
          router.push('/'); 
        },
        onError: (error: { message: string }) => {
          alert('Login failed: ' + error.message);
        },
      });
  }
</script>
<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="pa-4" max-width="400">
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="credentials.name"
            label="Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="credentials.tableNumber"
            label="Table Number"
            type="number"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary" block>Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

