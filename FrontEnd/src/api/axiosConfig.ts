import axios from 'axios';
import { API } from './apiConfig';


// const DOMAIN = 'https://econimal.com'; // 임시 URL
const DOMAIN = 'https://econimal.com/api/v1'; // 임시 URL

export const axiosInstance = axios.create({
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
    return response; //응답 그대로 전달
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error('Bad Request, 400에러 : 클라이언트 오류');
          break;
        case 401:
          console.error('Unauthorized, 401에러 : 인증 오류');
          // 로그아웃 처리 또는 토큰 갱신 로직
          break;
        case 403:
          console.error('Forbidden, 403에러 : 권한 오류');
          break;
        case 404:
          console.error('Not Found, 404에러 : 페이지 없음 오류');
          break;
        default:
          console.error('Server Error, 500에러 외 모든 에러 : 서버 측 에러');
      }
    } else if (error.request) {
      console.error('네트워크 에러');
    } else {
      console.error('Error', error.message);
    }
    return Promise.reject(error);
  },
);

// ------------------------- 서버 fetching api 로직 ---------------------------

//캐릭터 api
//직관적으로 매개변수, get/post 요청을 무엇으로 보내는지 알기 위해서
//한꺼번에 api로 관리하기 위해서 분리하였습니다.
export const characterListAPI = {
  getCharList: () => axiosInstance.get(`${DOMAIN}/${API.CHARACTERS.LIST}`),
};

// axiosInstance를 기본 내보내기로 설정
export default axiosInstance;
