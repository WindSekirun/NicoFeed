<!-- <template>
  <div>
    <h1>Videos</h1>
    <div
      v-for="video in videos"
      :key="video.id"
      @click="openVideo(video.videoLink)"
    >
      <v-img :src="video.videoThumbnail"></v-img>
      <h3>{{ video.videoTitle }}</h3>
      <p>{{ video.videoPubDate }}</p>
    </div>
    <v-btn v-if="hasMore" @click="loadMoreVideos">Load More</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/api';

const videos = ref([]);
const hasMore = ref(true);
let page = 1;

async function loadMoreVideos() {
  const response = await api.get(`/videos?page=${page}`);
  if (response.data.length < 10) hasMore.value = false;
  videos.value.push(...response.data);
  page++;
}

function openVideo(link: string) {
  window.open(link, '_blank');
}

onMounted(loadMoreVideos);
</script> -->
