<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserLogin } from "../../api/auth/mutations.ts";

import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { rules } from "../../utils/rules.ts";

const { required, maxLength } = rules;
const route = useRoute();
const credentials = ref({ name: "", tableNumber: 0 });

onMounted(() => {
  const tableNumber = route.query.tableNumber;
  if (tableNumber) {
    credentials.value.tableNumber = parseInt(tableNumber as string, 10);
  }
});
const router = useRouter();
const { mutate } = useUserLogin();
const isFormValid = ref();
function login() {
  mutate(credentials.value, {
    onSuccess: () => {
      router.push("/");
    },
    onError: (error: { message: string }) => {
      alert("Login failed: " + error.message);
    },
  });
}
</script>
<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card class="pa-4" max-width="400">
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login" v-model="isFormValid">
          <v-text-field
            v-model="credentials.name"
            label="Name"
            :rules="[required, maxLength(50)]"
          ></v-text-field>
          <v-text-field
            v-model="credentials.tableNumber"
            label="Table Number"
            type="number"
            required
            readonly
          ></v-text-field>
          <v-btn type="submit" color="primary" block :disabled="!isFormValid"
            >Login</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<style lang="scss" scoped>
.v-container {
  height: 100vh;
  .v-card {
    justify-self: center;
    align-self: center;
    min-width: 300px;
    max-width: 400px;
  }
}
</style>
