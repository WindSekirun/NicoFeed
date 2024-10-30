<template>
  <Navigation>
    <v-card
      v-for="video in videos"
      :key="video.id"
      @click="openVideo(video.videoLink)"
      class="mt-4"
    >
      <v-row class="d-flex align-center">
        <v-col cols="3">
          <v-img :src="video.videoThumbnail"></v-img>
        </v-col>
        <v-col>
          <span class="text-body-1">{{ video.videoTitle }}</span>
          <br />
          <span class="text-caption">{{ convertToUTC9(video.videoPubDate) }}</span>
        </v-col>
      </v-row>
    </v-card>
    <v-btn v-if="hasMore" block @click="loadMoreVideos" class="mt-5">Load More</v-btn>
  </Navigation>
</template>

<script setup lang="ts">
import axios from '../api/api';
import { onMounted, ref } from 'vue';
import { convertToUTC9 } from '../utils/date'

const videos = ref<any[]>([]);
const hasMore = ref(true);
let page = 1;

async function loadMoreVideos() {
  const response = await axios.get(`/videos?page=${page}`);
  if (response.data.length < 10) hasMore.value = false;
  videos.value.push(...response.data);
  page++;
}

function openVideo(link: string) {
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (isAndroid) {
    const packageName = 'jp.nicovideo.android';
    const intentUrl = `intent://${link.replace('https://', '')}#Intent;package=${packageName};scheme=https;end;`;
    window.location.href = intentUrl;
  } else {
    window.open(link, '_blank');
  }
}

onMounted(loadMoreVideos);
</script>
