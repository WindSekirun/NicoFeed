<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Register</v-card-title>
          <v-card-text>
            <v-form
              ref="registerForm"
              v-model="valid"
              @submit.prevent="handleRegister"
            >
            <v-text-field
                v-model="passid"
                label="Passid"
                variant="solo"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="username"
                label="Username"
                variant="solo"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                variant="solo"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="[rules.required, rules.minLength]"
                required
              />
              <v-text-field
                label="Confirm Password"
                v-model="confirmPassword"
                variant="solo"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="[rules.required, passwordMatch]"
                required
              />
              <div class="mt-5" />
              <v-btn
                type="submit"
                color="primary"
                :disabled="!valid"
                class="me-5"
              >
                Register
              </v-btn>
              <v-btn @click="navigateToLogin">Back to Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../api/api';
import { useTheme } from 'vuetify/lib/framework.mjs';
import { useLocalStorage } from '@vueuse/core';
import { AxiosError } from 'axios';

const router = useRouter();
const valid = ref(false);
const passid = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const theme = useTheme();
const isDark = useLocalStorage('theme', theme.global.name.value === 'dark');

const rules = {
  required: (value: string) => !!value || 'Required.',
  minLength: (value: string) => value.length >= 8 || 'Minimum 8 characters',
};

const passwordMatch = (value: string) =>
  value === password.value || 'Passwords do not match';

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match");
    return;
  }

  try {
    await axios.post('/auth/register', {
      passid: passid.value,
      username: username.value,
      password: password.value,
    });
    router.push('/login');
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      console.error('Registration error:', error);
      alert(`Registration failed. ${error.response?.data.message}`);
    }
  }
};

const navigateToLogin = () => {
  router.push('/login');
};

onMounted(() => {
  theme.global.name.value = isDark.value ? 'dark' : 'light';
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
