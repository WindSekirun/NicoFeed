<template>
  <div>
    <h1>Followers</h1>
    <v-card v-for="follower in followers" :key="follower.id">
      <v-img :src="follower.uploaderUserThumbnail" />
      <p>{{ follower.uploaderUserName }}</p>
      <v-btn @click="removeFollower(follower.id)">Remove</v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/api';

const followers = ref([]);

onMounted(async () => {
  const response = await api.get('/followers');
  followers.value = response.data;
});

async function removeFollower(followerId: number) {
  await api.delete(`/followers/${followerId}`);
  followers.value = followers.value.filter((f) => f.id !== followerId);
}
</script>
