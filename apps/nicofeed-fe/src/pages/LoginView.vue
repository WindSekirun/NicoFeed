<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-form
              ref="loginForm"
              v-model="valid"
              @submit.prevent="handleLogin"
            >
              <v-text-field
                label="Username"
                v-model="username"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                label="Password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="[rules.required]"
                required
              />
              <v-btn
                type="submit"
                color="primary"
                :disabled="!valid"
                class="me-5"
              >
                Login
              </v-btn>
              <v-btn text @click="navigateToRegister">Register</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../api/api';

const router = useRouter();
const valid = ref(false);
const username = ref('');
const password = ref('');
const showPassword = ref(false);

const rules = {
  required: (value: string) => !!value || 'Required.',
};

const handleLogin = async () => {
  try {
    const response = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem('jwt_token', response.data.access_token);
    router.push('/');
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please check your username and password.');
  }
};

const navigateToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
