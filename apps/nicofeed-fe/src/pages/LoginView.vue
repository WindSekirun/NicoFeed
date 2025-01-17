<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>NicoFeed Login</v-card-title>
          <v-card-text>
            <v-form
              ref="loginForm"
              v-model="valid"
              @submit.prevent="handleLogin"
            >
              <v-text-field
                class="mt-2"
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
                :rules="[rules.required]"
                required
                @click:append="showPassword = !showPassword"
              />
              <div class="mt-3" />
              <v-btn
                type="submit"
                color="primary"
                :disabled="!valid"
                class="me-5"
                block
                rounded="xl"
              >
                Login
              </v-btn>
              <v-btn
                @click="navigateToRegister"
                color="secondary"
                class="mt-3 me-5"
                block
                rounded="xl"
              >
                Register
              </v-btn>
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
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const theme = useTheme();
const isDark = useLocalStorage('theme', theme.global.name.value === 'dark');

const rules = {
  required: (value: string) => !!value || 'Required.',
};

const handleLogin = async () => {
  try {
    const response = await axios.post('/auth/login', {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem('jwt_token', response.data.access_token);
    router.push('/');
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      console.error('Login error:', error);
      alert(`Login failed. ${error.response?.data.message}`);
    }
  }
};

const navigateToRegister = () => {
  router.push('/register');
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
