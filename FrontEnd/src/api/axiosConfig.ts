import axios from 'axios';
import { API } from './apiConfig';
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

    if (config.data instanceof FormData) {
      //post 요청시 interceptor가 application/json으로
      //설정했을 때 오류가 발생할 수 있음 따라서
      delete config.headers['Content-Type']; //content-type 자체를 삭제해서 자체적으로
      //axios에서 부여할 수 있도록 설정한다.
      return config;
    }

    return config;
  },
  (error) => {
    // 요청 오류 처리
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  // (error) => {
  //   if (error.response) {
  //     switch (error.response.status) {
  //       case 400:
  //         console.error('Bad Request, 400에러 : 클라이언트 오류');
  //         break;
  //       case 401:
  //         console.error('Unauthorized, 401에러 : 인증 오류');
  //         // 로그아웃 처리 또는 토큰 갱신 로직
  //         break;
  //       case 403:
  //         console.error('Forbidden, 403에러 : 권한 오류');
  //         break;
  //       case 404:
  //         console.error('Not Found, 404에러 : 페이지 없음 오류');
  //         break;
  //       default:
  //         console.error('Server Error, 500에러 외 모든 에러 : 서버 측 에러');
  //     }
  //   } else if (error.request) {
  //     console.error('네트워크 에러');
  //   } else {
  //     console.error('Error', error.message);
  //   }

  // 오류 응답 처리
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
  },
);

// ------------------------- 서버 fetching api 로직 ---------------------------

//캐릭터 api
//직관적으로 매개변수, get/post 요청을 무엇으로 보내는지 알기 위해서
//한꺼번에 api로 관리하기 위해서 분리하였습니다.
//domain interceptor로 했기 때문에 중복 요청X
export const characterListAPI = {
  //캐릭터 리스트 조회 -> 보유한 캐릭터 목록 조회
  getCharList: () => axiosInstance.get(API.CHARACTERS.LIST),

  // 상세 캐릭터 정보 -> 캐릭터 상세 조회
  getCharInfo: (userCharacterId: number) => {
    return axiosInstance.get(`${API.CHARACTERS.LIST}/${userCharacterId}`);
  },
  //내 캐릭터 정보 -> 유저 캐릭터 정보 조회 (경험치 관련)
  getMyCharInfo: () => axiosInstance.get(API.CHARACTERS.MAIN_CHAR),

  //캐릭터 리스트 중 캐릭터 선택 => 대표 캐릭터 선택택
  // 캐릭터 선택 => 대표 캐릭터 선택
  patchMyChar: (userCharacterId: number) => {
    return axiosInstance.patch(
      `${API.CHARACTERS.MAIN_CHAR}/${userCharacterId}`,
    );
  },
};

export const checklistAPI = {
  getCheckList: () => axiosInstance.get(`${API.CHECKLIST}`),
  postCheckList: (checklistId: number) =>
    axiosInstance.post(`${API.CHECKLIST.DONE}`, {
      checklistId,
    }),
};

// axiosInstance를 기본 내보내기로 설정
export default axiosInstance;
