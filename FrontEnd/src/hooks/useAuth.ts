// useAuth.ts
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/store";
import { isAxiosError } from 'axios';
import axiosInstance, { 
  setAccessToken, 
  getAccessToken,
  setTokenExpiry,
  isTokenExpired,
  clearTokenData
} from "@/api/axiosConfig";

interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  birth: string;
  coin: number;
  role: string;
  lastLoginAt: string;
  townName: string;
  userId: number;
}

interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  isFirst: boolean;
  timeToLive: number; // 만료 시간 (밀리초)
}

// 회원가입 인터페이스
interface SignupData {
  email: string;
  password1: string;
  password2: string;
  name: string;
  nickname: string;
  birth: string;
  userType: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAccessToken());
  const navigate = useNavigate();
  const { token, setToken, clearToken } = useAuthStore();
  const [hasCharacter, setHasCharacter] = useState<boolean>(false);
  
  // useRef를 사용하여 타이머 ID 관리
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tokenCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 토큰 만료 확인 및 자동 로그아웃 함수
  const checkTokenExpiry = () => {
    if (isTokenExpired()) {
      console.log("토큰이 만료되었습니다. 자동 로그아웃");
      handleLogout();
      return true;
    }
    return false;
  };
  
  // 정기적인 토큰 만료 확인 설정
  const setupTokenExpiryCheck = () => {
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
      tokenCheckIntervalRef.current = null;
    }
    
    // 60초마다 토큰 만료 확인
    tokenCheckIntervalRef.current = setInterval(() => {
      if (isTokenExpired()) {
        console.log("토큰 만료 확인 - 로그아웃 처리");
        handleLogout();
      }
    }, 60000);
  };
  
  // 로그인 함수
  // login 함수의 해당 부분만 수정
const login = async (email: string, password: string) => {
  try {
    const res = await axiosInstance.post<LoginResponse>("/users/login", {
      email,
      password
    }, {
      withCredentials: true 
    });
    
    console.log("로그인 응답:", res.data);
    console.log("쿠키 설정 확인:", document.cookie);
    
    // 액세스 토큰과 만료 시간 저장
    setAccessToken(res.data.accessToken);
    setToken(res.data.accessToken);
    setTokenExpiry(res.data.timeToLive);
    setIsAuthenticated(true);
    
    // isFirst 값에 따라 캐릭터 존재 여부 설정
    const characterExists = !res.data.isFirst;
    setHasCharacter(characterExists);
    
    // 나머지 코드는 동일하게 유지
      
      // 사용자 정보 가져오기
      await fetchUserData();
      
      // 토큰 만료 확인 타이머 설정
      setupTokenExpiryCheck();
      
      // 프롤로그 시청 여부 확인
      const hasPrologViewed = localStorage.getItem('prologViewed') === 'true';
      
      // 프롤로그를 아직 보지 않았다면 프롤로그 페이지로 이동
      if (!hasPrologViewed) {
        navigate('/prolog');
      } else if (characterExists) {
        navigate("/"); // 캐릭터가 있으면 홈으로
      } else {
        navigate("/charsel"); // 캐릭터가 없으면 캐릭터 생성 페이지로
      }
      
      return res.data;
    } catch (error) {
      console.error("로그인 실패", error);
      throw error;
    }
  };

  // 회원가입 함수
  const signup = async (
    email: string, 
    password1: string, 
    password2: string, 
    name: string, 
    nickname: string, 
    birth: string, 
    userType: string = "USER"
  ) => {
    try {
      // API 명세서에 맞게 데이터 구성
      const signupData: SignupData = {
        email,
        password1,
        password2,
        name,
        nickname,
        birth,
        userType
      };
      
      // API 요청 보내기
      await axiosInstance.post("/users/signup", signupData);
      
      // 회원가입 성공 후 로그인 페이지로 이동
      navigate("/login");
      
      return { success: true };
    } catch (error: any) {
      console.error("회원가입 실패", error);
      throw error;
    }
  };

  const setupRefreshTimer = (expiresIn: number) => {
    // 기존 타이머 정리
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    // 만료 시간의 80%가 지난 후에 갱신 시도
    // 최소 30초, 최대는 만료 시간의 90%
    const refreshDelay = Math.min(
      Math.max(30000, expiresIn * 0.8),
      expiresIn * 0.9
    );
    
    console.log(`토큰 만료 시간: ${expiresIn}ms, ${refreshDelay}ms 후 갱신 예정`);
    
    refreshTimerRef.current = setTimeout(() => {
      console.log("자동 토큰 갱신 시도:", new Date().toISOString());
      refreshToken().then(success => {
        if (!success) {
          console.log("토큰 갱신 실패, 재시도 중...");
          // 실패 시 1초 후에 다시 시도
          setTimeout(() => refreshToken(), 1000);
        }
      });
    }, refreshDelay);
  };

  // 액세스 토큰 갱신
  const refreshToken = async () => {
    try {
      console.log("토큰 갱신 시도 - 시간:", new Date().toISOString());
      
      // withCredentials 명시적 설정
      const res = await axiosInstance.post<LoginResponse>("/users/refresh", {}, {
        withCredentials: true
      });
      
      console.log("토큰 갱신 성공 응답:", res.data);
      
      if (!res.data.accessToken) {
        console.error("응답에 토큰이 없음:", res.data);
        return false;
      }
      
      // 액세스 토큰 저장
      setAccessToken(res.data.accessToken);
      setToken(res.data.accessToken);
      setTokenExpiry(res.data.timeToLive);
      
      // 다음 갱신 타이머 설정
      const newExpiresIn = res.data.timeToLive || 900000;
      setupRefreshTimer(newExpiresIn);
      
      return true;
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      
      // 에러 상세 정보 로깅
      if (isAxiosError(error) && error.response) {
        console.error("응답 상태:", error.response.status);
        console.error("응답 데이터:", error.response.data);
      }
      
      // 로그인 페이지로 이동하지 않고 실패만 반환
      return false;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (리프레시 토큰 무효화)
      await axiosInstance.post("/users/logout", {}, {
        withCredentials: true
      });
      
      handleLogout();
    } catch (error) {
      console.error("로그아웃 요청 실패", error);
      // 서버 요청이 실패해도 클라이언트에서는 로그아웃
      handleLogout();
    }
  };
  
  // 로그아웃 처리 공통 함수
  const handleLogout = () => {
    // 타이머 정리
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    // 토큰 체크 인터벌 정리
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
      tokenCheckIntervalRef.current = null;
    }
    
    // 메모리에서 토큰 제거
    clearTokenData();
    // Zustand 스토어 정리
    clearToken();
    setIsAuthenticated(false);
    setUser(null);
    
    // 로그인 페이지로 이동
    navigate("/login");
  };

  // 사용자 정보 가져오기
  const fetchUserData = async () => {
    try {
      // 액세스 토큰이 메모리에 있으면 요청 헤더에 자동으로 포함됨
      const res = await axiosInstance.get("/users/info");
      
      const userData = res.data.userInfo || res.data;
      
      if (!userData || typeof userData !== 'object') {
        console.error("유저 데이터가 올바른 형식이 아닙니다:", userData);
        return null;
      }
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("유저 정보 가져오기 실패:", error);
      
      // 401 에러인 경우 토큰 갱신 시도
      if (isAxiosError(error) && error.response?.status === 401) {
        console.log("인증 에러 - 토큰 갱신 시도");
        const refreshSuccessful = await refreshToken();
        if (!refreshSuccessful) {
          handleLogout();
        } else {
          // 갱신 성공 시 다시 사용자 정보 요청
          return fetchUserData();
        }
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 닉네임 변경 함수
  const changeNickname = async (updateNickname: string) => {
    try {
      // 현재 닉네임과 동일한지 체크
      if (user?.nickname === updateNickname) {
        throw new Error("현재 닉네임과 동일합니다.");
      }

      // API 명세에 맞게 필드명 수정
      await axiosInstance.patch("/users/nickname", { updateNickname });
      
      // 성공 시 사용자 정보 업데이트
      setUser(prev => prev ? { ...prev, nickname: updateNickname } : null);
      
      return { success: true, message: "닉네임이 성공적으로 변경되었습니다." };
    } catch (error: any) {
      console.error("닉네임 변경 실패", error);
      return { 
        success: false, 
        message: error.message || "닉네임 변경에 실패했습니다."
      };
    }
  };

  // 비밀번호 찾기 요청
  const requestPasswordReset = async (email: string) => {
    try {
      await axiosInstance.post("/users/password/reset/request", { email });
      return { success: true, message: "비밀번호 재설정 이메일이 발송되었습니다." };
    } catch (error: any) {
      console.error("비밀번호 찾기 요청 실패", error);
      return {
        success: false,
        message: error.response?.data?.message || "요청 처리에 실패했습니다."
      };
    }
  };

  // 비밀번호 변경 함수
  const changePassword = async (newPassword1: string, newPassword2: string) => {
    try {
      // 비밀번호 일치 여부 확인
      if (newPassword1 !== newPassword2) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      // user가 null이 아닌지 확인
      if (!user) {
        throw new Error("사용자 정보가 없습니다. 다시 로그인해주세요.");
      }

      // 사용자 ID 확인
      const userId = user?.id || user.userId;
      
      if (!userId) {
        throw new Error("사용자 ID를 찾을 수 없습니다.");
      }
  
      // 비밀번호 변경 요청
      await axiosInstance.patch("/users/password", {
        userId,
        newPassword1,
        newPassword2
      });
      
      return { success: true, message: "비밀번호가 성공적으로 변경되었습니다." };
    } catch (error: any) {
      console.error("비밀번호 변경 실패", error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || "비밀번호 변경에 실패했습니다."
      };
    }
  };

  // 이메일 중복 확인
  const validateEmail = async (email: string) => {
    try {
      const response = await axiosInstance.post("/users/email-validation", { email });
      
      // 응답 구조에 따라 조건문 추가
      if (response.data.isDuplicate) {
        return { isValid: false, message: "이미 사용 중인 이메일입니다." };
      }
      
      return { isValid: true, message: "사용 가능한 이메일입니다." };
    } catch (error: any) {
      console.error("이메일 중복 확인 실패", error);
      return { 
        isValid: false, 
        message: error.response?.data?.message || "이메일 검증에 실패했습니다." 
      };
    }
  };

  // 이메일 인증 코드 전송 함수
  const sendEmailVerification = async (email: string) => {
    try {
      const response = await axiosInstance.post("/users/email/password/reset/request", { email });
      return { success: true, message: "인증 코드가 이메일로 전송되었습니다." };
    } catch (error: any) {
      console.error("이메일 인증 코드 전송 실패", error);
      return {
        success: false,
        message: error.response?.data?.message || "인증 코드 전송에 실패했습니다."
      };
    }
  };

  // 이메일 인증 코드 확인 함수
  const verifyEmailCode = async (email: string, authCode: string) => {
    try {
      await axiosInstance.post("/users/email/password/reset/confirm", { email, authCode });
      return { success: true, message: "이메일이 성공적으로 인증되었습니다." };
    } catch (error: any) {
      console.error("이메일 인증 코드 확인 실패", error);
      return {
        success: false,
        message: error.response?.data?.message || "인증 코드가 올바르지 않습니다."
      };
    }
  };

  // 초기 로드 시 실행
  useEffect(() => {
    // 메모리에 토큰이 있으면 인증된 상태로 간주
    const currentToken = getAccessToken();
    
    if (currentToken) {
      setIsAuthenticated(true);
      // Zustand 스토어 상태도 업데이트
      setToken(currentToken);
      
      // 토큰 만료 여부 확인
      if (isTokenExpired()) {
        console.log("저장된 토큰이 만료됨");
        handleLogout();
        return;
      }
      
      console.log("초기 로드 - 저장된 토큰 존재");
      
      // 토큰 만료 확인 타이머 설정
      setupTokenExpiryCheck();
      
      // 사용자 정보 가져오기
      fetchUserData().then(() => {
        console.log("사용자 정보 로드 성공");
      }).catch(error => {
        console.error("사용자 정보 로드 실패", error);
        // 사용자 정보 로드 실패 시 토큰 갱신 시도
        refreshToken();
      });
      
      // 토큰 갱신 타이머 설정
      setupRefreshTimer(300000); // 5분마다 토큰 갱신 시도
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
      }
    };
  }, []);

  // 반환 객체 - 모든 필요한 함수와 상태 포함
  return {
    user,
    loading,
    isAuthenticated,
    hasCharacter,
    login,
    logout,
    signup,
    refreshToken,
    changeNickname,
    requestPasswordReset,
    changePassword,
    validateEmail,
    sendEmailVerification,
    verifyEmailCode,
    fetchUserData
  };
};