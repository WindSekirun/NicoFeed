<template>
  <v-container fluid>
    <v-app-bar :elevation="2">
      <v-app-bar-title>NicoFeed - {{ router.currentRoute.value.meta.displayName }}</v-app-bar-title>
    </v-app-bar>
    <slot />
    <v-bottom-navigation
      v-model="currentTab"
      color="pink"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentTab = ref(router.currentRoute.value.name);

const navigate = (name: string) => {
  if (name && name !== currentTab.value) {
    router.push({ name });
  }
};
</script>
