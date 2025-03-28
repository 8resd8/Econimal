// axiosConfig.ts
import axios from 'axios';
import { API } from './apiConfig';

// 환경 변수에서 API 도메인 가져오기
const DOMAIN = import.meta.env.VITE_API_DOMAIN;

// 전역 액세스 토큰 저장소 (메모리에만 존재)
let accessToken: string | null = null;
// 토큰 만료 시간 저장
let tokenExpiryTime: number | null = null;

// 토큰 setter/getter 함수
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

// 토큰 만료 시간 관리 함수
export const setTokenExpiry = (expiresIn: number) => {
  tokenExpiryTime = Date.now() + expiresIn;
};

export const getTokenExpiry = () => {
  return tokenExpiryTime;
};

export const isTokenExpired = () => {
  if (!tokenExpiryTime) return true;
  return Date.now() >= tokenExpiryTime;
};

export const clearTokenData = () => {
  accessToken = null;
  tokenExpiryTime = null;
};

// axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 5000,
  withCredentials: true, // 리프레시 토큰을 쿠키로 받기 위해 필요
  headers: { 'Content-Type': 'application/json' }
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰 만료 확인 - 로그인 요청은 제외
    if (isTokenExpired() && !config.url?.includes('/users/login')) {
      console.log("토큰 만료됨, 요청 취소");
      // 로그인 페이지로 리디렉션은 handleLogout에서 처리
      return Promise.reject(new Error('Token expired'));
    }
    
    // 헤더에 토큰 추가 - 메모리에서 직접 가져옴
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // FormData 처리
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 오류이고, 로그인 페이지가 아닌 경우
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes('/users/login')
    ) {
      console.log("401 에러 - 인증 실패");
      // 실제 로그아웃 처리는 useAuth의 handleLogout에서 함
    }

    return Promise.reject(error);
  }
);

// ------------------------- 서버 fetching api 로직 ---------------------------
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
    return axiosInstance.post(
      `${API.CHARACTERS.FIRST_MAIN_CHAR}/${userCharacterId}`,
    );
  },
};

export const checklistAPI = {
  // 체크리스트 조회(서버/커스텀 내용)
  getCheckList: () => axiosInstance.get(`${API.CHECKLIST.LIST}`),
  // 체크리스트 등록
  postCheckList: (checklistId: string, type: string) =>
    axiosInstance.post(`${API.CHECKLIST.DONE}`, {
      type: type.toUpperCase(),
      checklistId,
    }),
  //커스텀 체크리스트 추가
  postAddCheckList: (description: string) =>
    axiosInstance.post(`${API.CHECKLIST.CUSTOM}`, { description }),
  //커스텀 체크리스트 수정
  pathEditCheckList: (checklistId: number, description: string) =>
    axiosInstance.post(`${API.CHECKLIST.CUSTOM}/${checklistId}`, {
      description,
    }),
  //커스텀 체크리스트 삭제
  deleteCheckList: (checklistId: number) =>
    axiosInstance.delete(`${API.CHECKLIST.CUSTOM}/${checklistId}`),
  //커스텀 체크리스트 검증
  postValidationCheckList: (description: string) =>
    axiosInstance.post(`${API.CHECKLIST.CUSTOM_VALIDATE}`, { description }),
};

export const shopAPI = {
  // 캐릭터 아이템 목록 조회
  getShopCharList: () => axiosInstance.get(`${API.SHOP.CHARLIST}`),
  // 캐릭터 아이템 구매
  postShopCharItem: (productId: number) =>
    axiosInstance.post(`${API.SHOP.CHARLIST}/${productId}`),
  // 배경 아이템 목록 조회(추가)
  getShopBackList: () => axiosInstance.get(`${API.SHOP.BACKLIST}`),
  // 배경 아이템 구매
  postShopBackItem: (productId: number) =>
    axiosInstance.post(`${API.SHOP.BACKLIST}/${productId}`),
};

// axiosInstance를 기본 내보내기로 설정
export default axiosInstance;