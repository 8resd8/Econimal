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
      console.log("토큰이 만료되었습니다. 갱신 시도");
      // 자동 로그아웃 대신 토큰 갱신 시도
      refreshToken().catch(() => {
        // 갱신 실패 시에만 로그아웃
        handleLogout(true);
      });
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
    tokenCheckIntervalRef.current = setInterval(checkTokenExpiry, 60000);
  };
  
  // 로그인 함수 - rememberMe 매개변수 추가
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const res = await axiosInstance.post<LoginResponse>("/users/login", {
        email,
        password,
        rememberMe  // 서버에 자동 로그인 여부 전달 (API가 지원하는 경우)
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
      
      // 자동 로그인 설정 저장
      if (rememberMe) {
        localStorage.setItem('autoLogin', 'true');
        // 사용자 이메일 저장 (선택적)
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('autoLogin');
        localStorage.removeItem('userEmail');
      }
      
      // isFirst 값에 따라 캐릭터 존재 여부 설정
      const characterExists = !res.data.isFirst;
      setHasCharacter(characterExists);
      
      // 사용자 정보 가져오기
      await fetchUserData();
      
      // 토큰 만료 확인 타이머 설정
      setupTokenExpiryCheck();
      
      // 토큰 갱신 타이머 설정
      setupRefreshTimer(res.data.timeToLive);
      
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
    
    // 만료 시간의 70%가 지난 후에 갱신 시도 (더 안전한 마진)
    const refreshDelay = Math.min(
      Math.max(3000, expiresIn * 0.7),
      expiresIn * 0.8
    );
    
    console.log(`토큰 만료 시간: ${expiresIn}ms, ${refreshDelay}ms 후 갱신 예정 (만료 ${Math.min(10000, expiresIn)}ms 전)`);
    
    refreshTimerRef.current = setTimeout(() => {
      console.log("자동 토큰 갱신 시도:", new Date().toISOString());
      refreshToken().then(isSuccess => {
        if (!isSuccess) {
          console.log("토큰 갱신 실패, 재시도 중...");
          // 실패 시 즉시 재시도
          refreshToken();
        } else {
          console.log("토큰 갱신 성공");
        }
      }).catch(error => {
        console.error("토큰 갱신 중 오류 발생:", error);
      });
    }, refreshDelay);
  };

  // 액세스 토큰 갱신
  const refreshToken = async () => {
    try {
      console.log("리프레시 토큰 요청 시작");
      const res = await axiosInstance.post("/users/refresh", {}, {
        withCredentials: true
      });
      
      console.log("리프레시 응답:", res.data);
      
      if (!res.data.accessToken) {
        console.error("응답에 토큰이 없음");
        throw new Error("응답에 토큰이 없음");
      }
      
      setAccessToken(res.data.accessToken);
      setToken(res.data.accessToken);
      setTokenExpiry(res.data.timeToLive);
      setIsAuthenticated(true);
      
      console.log("새 토큰 설정 완료, 만료 시간:", new Date(Date.now() + res.data.timeToLive).toISOString());
      
      // 토큰 갱신 성공 이벤트 발행
      window.dispatchEvent(new CustomEvent('token-refreshed', { 
        detail: { accessToken: res.data.accessToken, timeToLive: res.data.timeToLive } 
      }));
      
      // 토큰 갱신 타이머 재설정
      setupRefreshTimer(res.data.timeToLive);
      
      return true;
    } catch (error: unknown) {
      console.error("토큰 갱신 실패 상세 정보:", error);
      
      // 타입 가드를 사용하여 안전하게 접근
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number;
            data?: any;
          } 
        };
        
        if (axiosError.response) {
          console.error("서버 응답 상태:", axiosError.response.status);
          console.error("서버 응답 데이터:", axiosError.response.data);
        }
      }
      
      // 토큰 갱신 실패 이벤트 발행
      window.dispatchEvent(new CustomEvent('token-refresh-failed'));
      
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
      
      handleLogout(true);
    } catch (error) {
      console.error("로그아웃 요청 실패", error);
      // 서버 요청이 실패해도 클라이언트에서는 로그아웃
      handleLogout(true);
    }
  };
  
  // 로그아웃 처리 공통 함수
  const handleLogout = (redirectToLogin = true) => {
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
    
    // 자동 로그인 설정 제거 (명시적으로 로그아웃한 경우)
    localStorage.removeItem('autoLogin');
    
    // 메모리에서 토큰 제거
    clearTokenData();
    // Zustand 스토어 정리
    clearToken();
    setIsAuthenticated(false);
    setUser(null);
    
    // redirectToLogin이 true일 때만 로그인 페이지로 이동
    if (redirectToLogin) {
      navigate("/login");
    }
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
          // 토큰 갱신 실패 시 로그아웃하지만 리디렉션은 하지 않음
          handleLogout(false);
          
          // 토큰 갱신 실패 이벤트 발행 (이미 refreshToken 함수에서 발행됨)
          // window.dispatchEvent(new CustomEvent('token-refresh-failed'));
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

  // 자동 로그인 처리 함수
  const handleAutoLogin = async () => {
    const autoLogin = localStorage.getItem('autoLogin') === 'true';
    const savedEmail = localStorage.getItem('userEmail');
    
    if (autoLogin && savedEmail && !isAuthenticated) {
      // 토큰이 유효한지 확인
      if (!isTokenExpired()) {
        // 토큰이 유효하면 사용자 정보 로드
        await fetchUserData();
        return true;
      }
    }
    return false;
  };

  // 토큰 갱신 성공/실패 이벤트 리스너 추가
  useEffect(() => {
    // 토큰 갱신 성공 이벤트 리스너
    const handleTokenRefreshed = (event: any) => {
      console.log('토큰 갱신 감지됨:', event.detail);
      const { accessToken, timeToLive } = event.detail;
      
      // Zustand 스토어에 토큰 설정
      setToken(accessToken);
      
      // 인증 상태 업데이트
      setIsAuthenticated(true);
      
      // 토큰 갱신 타이머 재설정
      setupRefreshTimer(timeToLive);
      
      // 사용자 정보 재로드 (선택적)
      fetchUserData();
    };
    
    // 토큰 갱신 실패 이벤트 리스너
    const handleTokenRefreshFailed = () => {
      console.log('토큰 갱신 실패 감지됨');
      
      // 자동 로그인이 설정되어 있는지 확인
      const autoLogin = localStorage.getItem('autoLogin') === 'true';
      
      if (autoLogin) {
        // 자동 로그인이 활성화되어 있으면 다시 시도
        refreshToken().catch(() => {
          // 두 번째 시도도 실패하면 세션 정리하되 페이지는 유지
          clearTokenData();
          clearToken();
          setIsAuthenticated(false);
          setUser(null);
          
          // 로그인 페이지로 리디렉션하는 대신 모달 표시 또는 토스트 메시지만 표시
          // (모달은 App.tsx에서 처리)
        });
      } else {
        // 자동 로그인이 비활성화되어 있으면 로그아웃 (리디렉션 없이)
        handleLogout(false);
      }
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('token-refreshed', handleTokenRefreshed);
    window.addEventListener('token-refresh-failed', handleTokenRefreshFailed);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('token-refreshed', handleTokenRefreshed);
      window.removeEventListener('token-refresh-failed', handleTokenRefreshFailed);
    };
  }, []);

  // 초기 로드 시 실행 (기존 useEffect의 리팩토링)
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true); // 명시적으로 로딩 상태 설정
      
      try {
        // 메모리에 토큰이 있으면 인증된 상태로 간주
        const currentToken = getAccessToken();
        const autoLogin = localStorage.getItem('autoLogin') === 'true';
        
        if (currentToken) {
          // Zustand 스토어 상태 업데이트
          setToken(currentToken);
          
          // 토큰 만료 여부 확인
          if (isTokenExpired()) {
            console.log("저장된 토큰이 만료됨");
            
            // 자동 로그인 설정이 되어 있으면 토큰 갱신 시도
            if (autoLogin) {
              const refreshSuccessful = await refreshToken();
              if (!refreshSuccessful) {
                handleLogout(false); // 리디렉션 없이 로그아웃
                setLoading(false);
                return;
              }
            } else {
              handleLogout(false); // 리디렉션 없이 로그아웃
              setLoading(false);
              return;
            }
          }
          
          // 토큰이 유효하면 사용자 정보 로드 및 타이머 설정
          console.log("초기 로드 - 저장된 토큰 존재");
          setIsAuthenticated(true);
          
          // 토큰 만료 확인 타이머 설정
          setupTokenExpiryCheck();
          
          // 사용자 정보 가져오기
          try {
            await fetchUserData();
            console.log("사용자 정보 로드 성공");
          } catch (error) {
            console.error("사용자 정보 로드 실패", error);
            await refreshToken();
          }
          
          // 토큰 갱신 타이머 설정
          setupRefreshTimer(3000); // 5분마다 토큰 갱신 시도
        } else {
          // 토큰이 없지만 자동 로그인 설정이 있는 경우
          if (autoLogin) {
            console.log("자동 로그인 설정 확인됨, 하지만 토큰이 없음");
            // 여기서 저장된 자격 증명으로 로그인 시도 로직을 추가할 수 있음
          }
          
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("인증 상태 확인 중 오류 발생:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };
    
    checkAuthStatus();
    
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
    fetchUserData,
    handleAutoLogin
  };
};