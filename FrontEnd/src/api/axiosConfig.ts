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
      console.log("복원된 토큰이 이미 만료됨");
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

export const clearAllCookies = () => {
  const cookieNames = ['refreshToken', 'JSESSIONID']; // 알려진 쿠키 이름들 추가
  
  // 가능한 모든 경로 조합
  const paths = ['/', '/api', '/api/', '', '/j12a504.p.ssafy.io', '/j12a504.p.ssafy.io/api'];
  
  // 가능한 모든 도메인 조합
  const domain = window.location.hostname;
  let domains = [domain, `.${domain}`, '']; 
  
  // 서브도메인이 있을 경우 루트 도메인도 시도
  const domainParts = domain.split('.');
  if (domainParts.length > 2) {
    const rootDomain = `.${domainParts.slice(-2).join('.')}`;
    domains.push(rootDomain);
  }

  // 모든 쿠키 이름 가져오기
  document.cookie.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0].trim();
    if (name) cookieNames.push(name);
  });

  // 중복 제거
  const uniqueCookieNames = [...new Set(cookieNames)];
  
  // 다양한 옵션 조합으로 쿠키 삭제 시도
  uniqueCookieNames.forEach(name => {
    // 기본 삭제
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    
    // 모든 경로와 도메인 조합으로 삭제 시도
    for (const path of paths) {
      for (const dom of domains) {
        // 다양한 보안 옵션으로 시도
        const sameSiteOptions = ['', 'SameSite=None;', 'SameSite=Lax;', 'SameSite=Strict;'];
        const secureOptions = ['', 'Secure;'];
        
        for (const sameSite of sameSiteOptions) {
          for (const secure of secureOptions) {
            if (dom) {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${dom}; ${sameSite} ${secure}`;
            } else {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; ${sameSite} ${secure}`;
            }
          }
        }
      }
    }
  });
};

// axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 5000,
  withCredentials: true, // 리프레시 토큰을 쿠키로 받기 위해 필요
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.baseURL = 'https://j12a504.p.ssafy.io/api';

// 인증이 필요 없는 요청 경로 목록
const noAuthRequired = [
  '/users/refresh',
  '/users/login',
  '/users/signup',
  '/users/email-validation',
  '/users/password/reset/request',
  '/users/email/password/reset/request',
  '/users/email/password/reset/confirm'
];

// 요청 인터셉터 수정
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log('요청 헤더:', config.headers);
    console.log(`요청 URL: ${config.url}`);
    console.log(`withCredentials 설정: ${config.withCredentials}`);

    // 인증이 필요 없는 요청인지 확인
    const currentPath = config.url || '';
    const isAuthExempt = noAuthRequired.some(path => currentPath.includes(path));
    
    // 인증이 필요 없는 요청이면 토큰 검사 건너뛰기
    if (isAuthExempt) {
      return config;
    }

    // 토큰 만료 확인
    if (isTokenExpired()) {
      console.log('토큰 만료됨, 갱신 시도');

      try {
        const refreshResponse = await axiosInstance.post('/users/refresh', {});

        console.log('토큰 갱신 성공:', refreshResponse.data);
        
        const newToken = refreshResponse.data.accessToken;

        // 새 토큰 저장
        setAccessToken(newToken);
        // 새 토큰 만료 시간 저장
        if (refreshResponse.data.timeToLive) {
          setTokenExpiry(refreshResponse.data.timeToLive);
        }

        // 이벤트 발행: 토큰이 갱신되었음을 알림
        window.dispatchEvent(new CustomEvent('token-refreshed', { 
          detail: { accessToken: newToken, timeToLive: refreshResponse.data.timeToLive } 
        }));

        // 원래 요청 헤더에 새 토큰 설정
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${newToken}`;
        }

        return config;
      } catch (error) {
        console.error('토큰 갱신 실패:', error);
        // 토큰 갱신 실패 이벤트 발행
        window.dispatchEvent(new CustomEvent('token-refresh-failed'));
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
  response => {
    console.log('전체 응답:', response);
    console.log('응답 헤더:', response.headers);
    
    // 로그아웃 요청에 대한 응답인 경우
    if (response.config.url?.includes('/users/logout')) {
      console.log('로그아웃 응답 감지, 쿠키 삭제 시도');
      clearAllCookies();
    }
    
    // 현재 쿠키 상태 확인 (HttpOnly 쿠키는 보이지 않음)
    console.log('현재 쿠키:', document.cookie);
    
    return response;
  },
  (error) => {
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  },
);

// 로그아웃 인터셉터 설정 함수
export const setupLogoutInterceptor = () => {
  // 로그아웃 성공 응답에 대한 인터셉터 추가
  const interceptorId = axiosInstance.interceptors.response.use(
    response => {
      // 로그아웃 요청에 대한 응답인 경우
      if (response.config.url?.includes('/users/logout')) {
        console.log('로그아웃 응답 감지, 쿠키 삭제 시도');
        clearAllCookies();
      }
      return response;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  return interceptorId;
};

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