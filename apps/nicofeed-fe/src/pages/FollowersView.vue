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

    <div class="mt-10" />

    <div v-if="followers">
      Total {{ followers.length }} followers
    </div>
    <div v-else>
      No Followers to track
    </div>

    <v-card v-for="follower in followers" :key="follower.id" class="mt-4">
      <v-row class="d-flex align-center">
        <v-col cols="3">
          <v-img :src="follower.uploaderUserThumbnail" />
        </v-col>
        <v-col>
          <span class="text-h6">{{ follower.uploaderUserName }}</span>
        </v-col>
        <v-col cols="2">
          <v-btn icon variant="flat" @click="removeFollower">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
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
  await axios.post('/followers/sync', {
    apiResponse: apiResponse.value,
  });

  await loadList();
};

const loadList = async () => {
  const response = await axios.get('/followers');
  followers.value = response.data;
};

async function removeFollower(followerId: number) {
  await axios.delete(`/followers/${followerId}`);
  await loadList();
}

onMounted(async () => {
  await loadList();
});
</script>
