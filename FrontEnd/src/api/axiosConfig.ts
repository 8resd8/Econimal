// axiosConfig.ts
import axios from 'axios';
import { API } from './apiConfig';
import { handleApiError } from '@/utils/errorHandler';

// 환경 변수에서 API 도메인 가져오기
const DOMAIN = import.meta.env.VITE_API_DOMAIN;

// -------------------- 토큰 관련 --------------------
// 전역 액세스 토큰 저장소 (메모리에만 존재)
let accessToken: string | null = null;
// 토큰 만료 시간 저장
let tokenExpiryTime: number | null = null;

// 토큰 setter/getter 함수
export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    sessionStorage.setItem('accessToken', token);
  } else {
    sessionStorage.removeItem('accessToken');
  }
};

// getAccessToken 함수 수정
export const getAccessToken = () => {
  if (!accessToken) {
    // 메모리에 없으면 sessionStorage에서 복원
    accessToken = sessionStorage.getItem('accessToken');

    // 복원 시 토큰 만료 여부 즉시 확인
    if (accessToken && isTokenExpired()) {
      console.log('복원된 토큰이 이미 만료됨');
      clearTokenData();
      return null;
    }
  }
  return accessToken;
};

// 토큰 만료 시간 관리 함수
export const setTokenExpiry = (expiresIn: number) => {
  tokenExpiryTime = Date.now() + expiresIn;
  sessionStorage.setItem('tokenExpiry', tokenExpiryTime.toString());
};

export const getTokenExpiry = () => {
  if (!tokenExpiryTime) {
    // 메모리에 없으면 sessionStorage에서 복원
    const storedExpiry = sessionStorage.getItem('tokenExpiry');
    if (storedExpiry) {
      tokenExpiryTime = parseInt(storedExpiry);
    }
  }
  return tokenExpiryTime;
};

export const isTokenExpired = () => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  return Date.now() >= expiry;
};

export const clearTokenData = () => {
  accessToken = null;
  tokenExpiryTime = null;
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('tokenExpiry');
};

// -------------------- axios 인스턴스, 인터셉터 --------------------
export const axiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 5000,
  withCredentials: true, // 리프레시 토큰을 쿠키로 받기 위해 필요
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.baseURL = 'https://j12a504.p.ssafy.io/api';

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log('요청 헤더:', config.headers);
    console.log(`요청 URL: ${config.url}`);
    console.log(`withCredentials 설정: ${config.withCredentials}`);

    // 리프레시 요청 자체는 체크하지 않음
    if (config.url?.includes('/users/refresh')) {
      return config;
    }

    // 로그인 요청도 체크하지 않음
    if (config.url?.includes('/users/login')) {
      return config;
    }

    // 토큰 만료 확인
    if (isTokenExpired()) {
      console.log('토큰 만료됨, 갱신 시도');

      try {
        // 토큰 갱신 요청 - withCredentials 제거
        const refreshResponse = await axiosInstance.post('/users/refresh', {});

        console.log('토큰 갱신 성공:', refreshResponse.data);
        const newToken = refreshResponse.data.accessToken;

        // 새 토큰 저장
        setAccessToken(newToken);
        // 새 토큰 만료 시간 저장
        if (refreshResponse.data.timeToLive) {
          setTokenExpiry(refreshResponse.data.timeToLive);
        }

        // 원래 요청 헤더에 새 토큰 설정
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${newToken}`;
        }

        return config;
      } catch (error) {
        console.error('토큰 갱신 실패:', error);
        return Promise.reject(new Error('Token refresh failed'));
      }
    }

    // 헤더에 토큰 추가
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('전체 응답:', response);
    console.log('응답 헤더:', response.headers);

    // 현재 쿠키 상태 확인 (HttpOnly 쿠키는 보이지 않음)
    console.log('현재 쿠키:', document.cookie);

    return response;
  },
  (error) => {
    console.error('API 요청 오류:', error);
    // console.error('API 요청 오류:', error);

    // 중앙화된 에러 처리 함수 호출
    handleApiError(error);

    // 401 오류 로깅
    // if (error.response?.status === 401) {
    //   console.log('401 인증 오류 발생');
    // }

    return Promise.reject(error);
  },
);

// -------------------- 에러 중앙 관리 --------------------
// 에러 발견되면 해당 에러 코드에 맞는 페이지로 보내기

// 이전 코드는 그대로 두고, 파일 끝부분에 다음을 추가합니다
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
  // 최초 캐릭터 선택
  patchMyChar: (userCharacterId: number) => {
    return axiosInstance.post(
      `${API.CHARACTERS.FIRST_MAIN_CHAR}/${userCharacterId}`,
    );
  },

  // 캐릭터 선택 => 대표 캐릭터 선택
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
  pathEditCheckList: (checklistId: string, description: string) =>
    axiosInstance.patch(`${API.CHECKLIST.CUSTOM}/${checklistId}`, {
      description,
    }),
  //커스텀 체크리스트 삭제
  deleteCheckList: (checklistId: string) =>
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
  // 배경 아이템 목록/ 조회(추가)
  getShopBackList: () => axiosInstance.get(`${API.SHOP.BACKLIST}`),
  // 배경 아이템 구매
  postShopBackItem: (productId: number) =>
    axiosInstance.post(`${API.SHOP.BACKLIST}/${productId}`),

  // ---------------- 상품 구매 ---------------
  //캐릭터 선택 대표 캐릭터 선택
  patchShopMyChar: (userCharacterId: number) => {
    return axiosInstance.patch(
      `${API.CHARACTERS.MAIN_CHAR}/${userCharacterId}`,
    );
  },
  //배경 선택 대표 배경 선택
  patchShopMyBack: (userBackgroundId: number) => {
    return axiosInstance.patch(
      `${API.CHARACTERS.MAIN_CHAR}/${userBackgroundId}`,
    );
  },
};

// 기본 내보내기
export default axiosInstance;
