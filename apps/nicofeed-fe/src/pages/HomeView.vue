<template>
  <Navigation>
    <div v-for="(video, index) in videos" :key="video.id" class="video-item">
      <!-- 날짜 헤더 표시 -->
      <div v-if="shouldDisplayDateHeader(index)" class="font-weight-bold text-h6 mt-5">
        {{ formatDate(video.videoPubDate) }}
      </div>
      <v-card @click="() => openVideo(video.videoLink)" class="mt-4">
        <v-row class="d-flex align-center">
          <v-col cols="3">
            <v-img :src="video.videoThumbnail" class="pa-5 ms-2" />
          </v-col>
          <v-col class="me-2 mt-2 mb-2">
            <span class="text-body-1">{{ video.videoTitle }}</span>
            <br />
            <span class="text-body-2">{{ video.follower.uploaderUserName }}</span>
            <br />
            <p class="text-caption text-right">
              {{ formatRelativeTime(video.videoPubDate) }}
            </p>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <div v-if="hasMore" v-intersect="loadMoreVideos" class="infinite-scroll-trigger" />
  </Navigation>
</template>

<script setup lang="ts">
import axios from '../api/api';
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import { getLastPathWithoutQuery } from '../utils/url';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

const videos = ref<any[]>([]);
const hasMore = ref(true);
const isLoading = ref(false);
let page = 1;

async function loadMoreVideos() {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;

  try {
    const response = await axios.get(`/videos?page=${page}`);
    if (response.data.length < 10) hasMore.value = false;
    videos.value.push(...response.data);
    page++;
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 250)
  }
}

function openVideo(link: string) {
  const smId = getLastPathWithoutQuery(link);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isAndroid) {
    const intentUrl = `nicofeed://${smId}`;
    window.open(intentUrl, '_blank');

     setTimeout(() => {
      if (document.visibilityState === 'visible') {
        alert("컴패니언 앱이 설치되어 있지 않습니다.");
        window.open('https://github.com/WindSekirun/NicoFeed/raw/refs/heads/main/NicoFeedCompanion/app-debug.apk', '_blank');
      }
    }, 1500);
  } else if (isiOS) {
    const intentUrl = `nico://watch/${smId}`;
    window.open(intentUrl, '_blank');
  }  else {
    window.open(link, '_blank');
  }
}

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

function formatRelativeTime(date: string): string {
  return dayjs(date).tz("Asia/Tokyo").fromNow();
}

function shouldDisplayDateHeader(index: number): boolean {
  if (index === 0) return true;
  const currentVideoDate = dayjs(videos.value[index].videoPubDate).format('YYYY-MM-DD');
  const previousVideoDate = dayjs(videos.value[index - 1].videoPubDate).format('YYYY-MM-DD');
  return currentVideoDate !== previousVideoDate;
}
</script>

<style scoped>
.infinite-scroll-trigger {
  height: 1px;
}
</style>
