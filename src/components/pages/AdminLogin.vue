<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminLogin } from "../../api/auth/mutations.ts";
import { rules } from "../../utils/rules.ts";
const { required, maxLength } = rules;
const credentials = ref({ username: "", password: "" });
const router = useRouter();
const { mutate } = useAdminLogin();

function login() {
  mutate(credentials.value, {
    onSuccess: () => {
      router.push("/admin/order-manager");
    },
    onError: (error: { message: string }) => {
      alert("Login failed: " + error.message);
    },
  });
}
const isFormValid = ref();
</script>
<template>
  <v-container>
    <v-card class="pa-4" max-width="400">
      <v-card-title class="text-h5">Admin Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login" v-model="isFormValid">
          <v-text-field
            v-model="credentials.username"
            label="Username"
            :rules="[required, maxLength(50)]"
          ></v-text-field>
          <v-text-field
            v-model="credentials.password"
            label="Password"
            type="password"
            required
            :rules="[required, maxLength(50)]"
          ></v-text-field>
          <v-btn type="submit" color="primary" :disabled="!isFormValid" block
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
