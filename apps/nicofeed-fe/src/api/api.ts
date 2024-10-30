import axios from 'axios';
import router from '../router';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token'); // 토큰 제거
      router.push('/login'); // 로그인 페이지로 이동
    }
    return Promise.reject(error); // 에러를 다시 던져서 호출한 쪽에서 처리하도록 함
  }
);

export default api;