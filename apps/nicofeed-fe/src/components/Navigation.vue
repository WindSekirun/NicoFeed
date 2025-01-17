<template>
  <v-container fluid>
    <v-app-bar :elevation="2">
      <v-app-bar-title>
        <p class="text-body-1 pa-0">{{ title }}</p>
        <p class="text-caption pa-0">NicoFeed - {{ version }}</p>
      </v-app-bar-title>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{
          isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'
        }}</v-icon>
      </v-btn>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main class="main-content">
      <slot />
    </v-main>
    <v-bottom-navigation
      v-model="currentTab"
      :color="isDark ? '#8fbcbb' : '#5e81ac'"
      grow
      app
      @input="navigate"
    >
      <v-btn value="followers" :to="{ name: 'Followers' }">
        <v-icon>mdi-heart</v-icon>
        <span>팔로워</span>
      </v-btn>

      <v-btn value="video" :to="{ name: 'Videos' }" exact>
        <v-icon>mdi-video</v-icon>
        <span>영상</span>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify/lib/framework.mjs';
import { Follower } from '../model/Followers';

const props = defineProps<{
  follower?: Follower;
}>();

const router = useRouter();
const currentTab = ref(router.currentRoute.value.name);
const theme = useTheme();
const isDark = useLocalStorage('theme', theme.global.name.value === 'dark');

const title = computed(() => {
  const base = router.currentRoute.value.meta.displayName;
  if (props.follower) {
    return `${props.follower.uploaderUserName} ${base}`;
  } else {
    return base;
  }
})

const navigate = (name: string) => {
  if (name && name !== currentTab.value) {
    router.push({ name });
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  theme.global.name.value = isDark.value ? 'dark' : 'light';
};

const logout = () => {
  localStorage.removeItem('jwt_token');
  router.push('/login');
};

const version = computed(() => {
  const commitHash = import.meta.env.VITE_APP_COMMIT_HASH;
  const commitDate = import.meta.env.VITE_APP_COMMIT_DATE;
  return `${commitHash}(${commitDate})`;
});

onMounted(() => {
  theme.global.name.value = isDark.value ? 'dark' : 'light';
});
</script>

<style scoped>
.main-content {
  padding-top: 0 !important; /* 상단 패딩 제거 */
}
</style>
