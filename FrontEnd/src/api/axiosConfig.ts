import axios from 'axios';

const DOMAIN = 'https://econimal.com'; // 임시 URL

const axiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 5000,
  // withCredentials: true, // httpOnly 쿠키를 사용한다면
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청이 전달되기 전에 작업 수행
    return config;
  },
  (error) => {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터가 있는 작업 수행
    return response;
  },
  (error) => {
    // 응답 오류가 있는 작업 수행
    return Promise.reject(error);
  },
);
