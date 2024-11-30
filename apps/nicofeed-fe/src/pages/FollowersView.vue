<template>
  <Navigation>
    <v-card>
      <v-card-title @click="toggleParentCollapse">
        팔로워 목록 가져오기
        <v-icon>{{ parentCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
      </v-card-title>
      <v-expand-transition>
        <v-card-text v-show="!parentCollapsed">
          niconico 의 cookie.txt 파일을 업로드하여 팔로워 목록을 찾아옵니다. 약
          1분 소요됩니다.
          <div class="mt-4"></div>
          <input type="file" @change="onFileChange" accept=".txt" />
          <div class="mt-2"></div>
          또는 아래 COOKIES 버튼으로 쿠키 정보를 입력해주세요.
        </v-card-text>
      </v-expand-transition>
      <v-card-actions v-show="!parentCollapsed">
        <v-btn color="info" @click="clickChrome()"> Chrome </v-btn>
        <v-btn color="info" @click="clickFirefox()"> Firefox </v-btn>
        <v-btn color="info" @click="dialog = true">Cookies</v-btn>
        <v-spacer />
        <v-btn
          :disabled="!file && !cookies"
          @click="uploadFile"
          color="primary"
          :loading="loading"
        >
          업로드
        </v-btn>
      </v-card-actions>
    </v-card>

    <div class="mt-10" />

    <div v-if="followers">Total {{ followers.length }} followers</div>
    <div v-else>No Followers to track</div>

    <v-card v-for="follower in followers" :key="follower.id" class="mt-4">
      <v-row class="d-flex align-center">
        <v-col cols="3">
          <v-img :src="getUploaderThumbnail(follower)" />
        </v-col>
        <v-col>
          <p class="text-caption">#{{ follower.uploaderUserId }}</p>
          <p class="text-h6">{{ follower.uploaderUserName }}</p>
        </v-col>
        <v-col cols="2">
          <v-btn @click="removeFollower(follower.id)" icon variant="flat">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="headline">Enter Cookies</v-card-title>
        <v-card-text>
          <v-textarea label="cookies.txt contents" v-model="cookies"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Navigation>
</template>

<script setup lang="ts">
import axios from '../api/api';
import { onMounted, ref } from 'vue';
import { Follower } from '../model/Followers';
import { useLocalStorage } from '@vueuse/core';

const followers = ref<Follower[]>([]);
const file = ref<File | null>(null);
const loading = ref(false);
const dialog = ref(false);
const cookies = useLocalStorage('cookies_text', '');
const parentCollapsed = useLocalStorage('follower_load_collapsed', true);

const toggleParentCollapse = () => {
  parentCollapsed.value = !parentCollapsed.value;
};

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
  }
}

const getUploaderThumbnail = (item: Follower) => {
  const sliced = item.uploaderUserId.slice(0, -4);
  return `https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/${sliced}/${item.uploaderUserId}.jpg`;
};

const clickChrome = async () => {
  window.open(
    'https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc',
    '_blank'
  );
};

const clickFirefox = async () => {
  window.open(
    'https://addons.mozilla.org/en-US/firefox/addon/cookies-txt/',
    '_blank'
  );
};

const uploadFile = async () => {
  loading.value = true;
  try {
    if (file.value) {
      const formData = new FormData();
      formData.append('file', file.value);

      await axios.post('/followers/sync/cookies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else if (cookies.value) {
      await axios.post('/followers/sync/cookies/string', { cookies: cookies.value });
    }
    await loadList();
  } catch (err) {
    console.error(`Error fetching videos: ${err}`);
  } finally {
    loading.value = false;
  }
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
