import axios from 'axios';
import { useAuthStore } from '@/store/store'; // Zustand 상태 관리 사용
// import.meta.env

// const DOMAIN = 'http://localhost:8080'; // 임시 URL
const DOMAIN = import.meta.env.VITE_API_DOMAIN;

export const axiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 5000,
  withCredentials: true, // refreshToken을 쿠키로 받기 위해 필요
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 헤더에 토큰 추가
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Cache-Control 헤더 추가 (API 명세에 필요한 경우)
    // if (config.url?.includes('users/login')) {
    //   config.headers['Cache-Control'] = 'no-store';
    // }

    return config;
  },
  (error) => {
    // 요청 오류 처리
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 오류이고, 재시도하지 않은 경우, 토큰 갱신 요청이 아닌 경우
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/users/token/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 요청 - 직접 API 호출 대신 별도 함수 호출
        // 여기서는 직접 API를 호출해야 함 (훅 사용 불가)
        const response = await axiosInstance.post('/users/token/refresh');
        const newToken = response.data.accessToken;
        
        // 토큰 저장
        useAuthStore.getState().setToken(newToken);
        
        // 원래 요청 헤더 업데이트
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        // 원래 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 로그인 페이지에 있지 않을 경우만 리디렉션
        if (window.location.pathname !== '/login') {
          useAuthStore.getState().clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// axiosInstance를 기본 내보내기로 설정
export default axiosInstance;
