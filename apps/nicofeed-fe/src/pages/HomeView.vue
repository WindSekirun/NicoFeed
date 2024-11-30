<template>
  <Navigation :follower="selectedFollower">
    <v-slide-group show-arrows class="mt-2">
      <v-slide-group-item v-for="follower in followers" :key="follower.id">
        <v-card
          class="pa-1"
          max-width="60"
          elevation="0"
          align="center"
          flat
          :color="selectedFollower == follower ? `` : `transparent`"
          @click="changeUser(follower)"
        >
          <v-avatar size="48" v-if="follower.id != noneFollower.id">
            <v-img :src="getUploaderThumbnail(follower)" alt="User Thumbnail" />
          </v-avatar>

          <v-avatar size="48" v-if="follower.id == noneFollower.id">
            <v-icon>mdi-selection-ellipse-remove</v-icon>
          </v-avatar>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>

    <v-infinite-scroll
      :items="videos"
      :onLoad="loadMoreVideosWithCallback"
      :distance="200"
    >
      <template v-for="(video, index) in videos" :key="video.id">
        <div
          v-if="shouldDisplayDateHeader(index)"
          class="font-weight-bold text-h6 mt-5"
        >
          {{ formatDate(video.videoPubDate) }}
        </div>
        <v-card
          @click="handleClick(video)"
          @mousedown="startLongClick(video)"
          @mouseup="clearLongClick"
          @mouseleave="clearLongClick"
          class="mt-4"
        >
          <v-row class="d-flex align-center">
            <v-col cols="5">
              <v-img
                :src="getVideoThumbnail(video.videoThumbnail)"
                width="100%"
              />
            </v-col>
            <v-col class="mt-2 mb-2" cols="7">
              <p class="text-body-1 video-title me-2">{{ video.videoTitle }}</p>
              <div class="d-flex align-center mt-2 me-2">
                <v-avatar size="18">
                  <v-img :src="getUploaderThumbnail(video.follower)" />
                </v-avatar>
                <span class="text-caption ms-1">
                  {{ video.follower.uploaderUserName }}
                </span>
                <span class="text-caption ms-auto">
                  {{ formatRelativeTime(video.videoPubDate) }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </v-infinite-scroll>

    <div v-if="videos.length == 0" class="d-flex align-center justify-center">
      <span class="text-body-1">팔로워 목록을 통해 팔로워를 추가해주세요.</span>
    </div>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline">Video Details</v-card-title>
        <v-card-text>
          <v-img
            :src="getVideoThumbnail(selectedVideo!.videoThumbnail)"
            width="100%"
          />
          <p class="text-body-1 mt-2">
            {{ selectedVideo!.videoTitle }}
          </p>
          <div class="d-flex align-center mt-2">
            <v-avatar size="18">
              <v-img :src="getUploaderThumbnail(selectedVideo!.follower)" />
            </v-avatar>
            <span class="text-caption ms-1">
              {{ selectedVideo!.follower.uploaderUserName }}
            </span>
          </div>
          <p class="text-body-2 mt-2">
            {{ videoDescription }}
          </p>
          <v-btn color="info" @click="selectFollower" block class="mt-2">
            Filter User Videos
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="dialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import { Follower } from '../model/Followers';
import { Video } from '../model/Video';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

const videos = ref<Video[]>([]);
const hasMore = ref(true);
const isLoading = ref(false);
const followers = ref<Follower[]>([]);
const selectedFollower = ref<Follower | undefined>(undefined);
let page = 1;
const dialog = ref(false);
const selectedVideo = ref<Video | null>(null);
let longClickTimeout: number | null = null;
let isLongClick = false;

const noneFollower: Follower = {
  id: -999,
  uploaderUserName: '',
  uploaderUserId: '',
  userid: -999,
  initialSync: false,
};

const videoDescription = ref<string>('');

type DoneCallback = (result: string) => void;

const changeUser = async (follower: Follower) => {
  if (
    selectedFollower.value?.id == follower.id ||
    follower.id == noneFollower.id
  ) {
    selectedFollower.value = undefined;
  } else {
    selectedFollower.value = follower;
  }
  hasMore.value = true;

  await loadMoreVideos(true);
};

const loadMoreVideos = async (clear: boolean = false) => {
  if (clear) {
    page = 1;
    hasMore.value = true;
    videos.value = [];
  }

  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;

  const uploaderUserId = selectedFollower.value
    ? `&uploader_user_id=${selectedFollower.value.uploaderUserId}`
    : '';

  try {
    const response = await axios.get(`/videos?page=${page}${uploaderUserId}`);
    if (response.data.length < 10) hasMore.value = false;
    videos.value.push(...response.data);
    page++;
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 250);
  }
};

const loadMoreVideosWithCallback = async ({ done }: { done: DoneCallback }) => {
  await loadMoreVideos(false);
  done('ok');
};

const openVideo = async (smId: string) => {
  const link = `https://www.nicovideo.jp/watch/${smId}`;
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isAndroid) {
    const intentUrl = `nicofeed://${smId}`;
    window.open(intentUrl, '_blank');

    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        alert('컴패니언 앱이 설치되어 있지 않습니다.');
        window.open(
          'https://github.com/WindSekirun/NicoFeed/raw/refs/heads/main/NicoFeedCompanion/app-debug.apk',
          '_blank'
        );
      }
    }, 1500);
  } else if (isiOS) {
    const intentUrl = `nico://watch/${smId}`;
    window.open(intentUrl, '_blank');
  } else {
    window.open(link, '_blank');
  }
};

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY. MM. DD.');
};

const formatRelativeTime = (date: string) => {
  return dayjs(date).tz('Asia/Tokyo').fromNow();
};

const shouldDisplayDateHeader = (index: number) => {
  if (index === 0) return true;
  const currentVideoDate = dayjs(videos.value[index].videoPubDate).format(
    'YYYY-MM-DD'
  );
  const previousVideoDate = dayjs(videos.value[index - 1].videoPubDate).format(
    'YYYY-MM-DD'
  );
  return currentVideoDate !== previousVideoDate;
};

const getUploaderThumbnail = (item: Follower) => {
  const sliced = item.uploaderUserId.slice(0, -4);
  return `https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/${sliced}/${item.uploaderUserId}.jpg`;
};

const getVideoThumbnail = (thumbnail: string) => {
  return `https://nicovideo.cdn.nimg.jp/thumbnails/${thumbnail}.L`;
};

const fetchVideoDescription = async (videoLink: string) => {
  videoDescription.value = (await axios.get(`/videos/description/${videoLink}`)).data.description;
};

const startLongClick = (video: Video) => {
  isLongClick = false;
  longClickTimeout = window.setTimeout(async () => {
    isLongClick = true;
    selectedVideo.value = video;
    await fetchVideoDescription(video.videoLink);
    dialog.value = true;
  }, 250);
};

const clearLongClick = () => {
  if (longClickTimeout) {
    clearTimeout(longClickTimeout);
    longClickTimeout = null;
  }
};

const handleClick = (video: Video) => {
  if (!isLongClick) {
    openVideo(video.videoLink);
  }
};

const selectFollower = () => {
  if (selectedVideo.value) {
    selectedFollower.value = selectedVideo.value.follower;
    dialog.value = false;
    loadMoreVideos(true);
  }
};

onMounted(async () => {
  const recent = (await axios.get('/followers/recent')).data;
  if (recent.length != 0) {
    followers.value = [noneFollower, ...recent];
  }
});
</script>

<style>
.video-title {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: break-spaces;
  min-height: 2.5em;
}
</style>
