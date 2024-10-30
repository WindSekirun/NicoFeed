import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../pages/HomeView.vue';
import LoginView from '../pages/LoginView.vue';
import RegisterView from '../pages/RegisterView.vue';
import FollowersView from '../pages/FollowersView.vue';
import SettingsView from '../pages/SettingsView.vue';

const routes = [
  {
    path: '/',
    component: HomeView,
    name: 'Videos',
    meta: {
      requiresAuth: true,
      displayName: '신규 영상',
    },
  },
  {
    path: '/followers',
    component: FollowersView,
    name: "Followers",
    meta: {
      requiresAuth: true,
      displayName: '팔로워 목록',
    },
  },
  {
    path: '/settings',
    component: SettingsView,
    name: "Settings",
    meta: {
      requiresAuth: true,
      displayName: '설정',
    },
  },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('jwt_token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
