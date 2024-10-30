<template>
  <Navigation>
    <v-textarea
      v-model="apiResponse"
      label="API 응답 결과"
      append-inner-icon="mdi-help-circle-outline"
      variant="solo"
    />
    <v-btn rounded="xl" block color="blue" @click="refreshFollowers">
      팔로워 목록 새로고침
    </v-btn>

    <div class="mt-10"/>

    <v-card v-for="follower in followers" :key="follower.id" class="mt-4">
      <v-row class="d-flex align-center">
        <v-col>
          <v-img
            :src="follower.uploaderUserThumbnail"
            width="100"
            height="100"
          />
        </v-col>
        <v-col>
          <span>{{ follower.uploaderUserName }}</span>
        </v-col>
      </v-row>
    </v-card>
  </Navigation>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import axios from '../api/api';
import { onMounted, ref } from 'vue';

const followers = ref([]);
const apiResponse = useLocalStorage('apiResponse', '');

const refreshFollowers = async () => {
  const response = await axios.post('/api/followers/sync', {
    apiResponse: apiResponse.value,
  });

  await loadList();
};

const loadList = async () => {
  const response = await axios.get('/api/followers');
  followers.value = response.data;
}

onMounted(async () => {
  await loadList();
});
</script>
