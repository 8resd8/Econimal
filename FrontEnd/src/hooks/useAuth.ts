import { useState, useEffect } from "react";
import axios from "@/api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/store"; // Zustand 사용 시
import { isAxiosError } from 'axios';
import axiosInstance from "@/api/axiosConfig";

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
  timeToLive: number; // 만료 시간 (900000 밀리초 = 15분)
}

// 회원가입 인터페이스 추가
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
  const navigate = useNavigate();
  const { token, setToken, clearToken } = useAuthStore(); // Zustand 상태 관리
  const [hasCharacter, setHasCharacter] = useState<boolean>(false); // 캐릭터 존재 여부 상태 추가
  // 타이머 ID 저장을 위한 상태 추가
  const [refreshTimerId, setRefreshTimerId] = useState<NodeJS.Timeout | null>(null);

  // 토큰 값이 변경될 때마다 콘솔에 출력
  useEffect(() => {
    console.log("현재 토큰 값:", token);
  }, [token]);

  // 로그인 함수 - API 명세에 맞게 수정
  const login = async (email: string, password: string) => {
    try {
      // API 명세에 따라 요청 구성
      const res = await axios.post<LoginResponse>("/users/login", {
        email,
        password
      }, {
        // headers: {
        //   'Cache-Control': 'no-store'
        // },
        withCredentials: true // 쿠키 기반 인증을 위해 추가
        // params: {
        //   userId: null
        // }
      });

      // 응답에서 토큰과 만료 시간 저장
      console.log("로그인 응답:", res.data);
      setToken(res.data.accessToken);
      console.log("토큰 설정 후:", useAuthStore.getState().token); // 즉시 스토어 상태 확인
      
      // isFirst 값에 따라 캐릭터 존재 여부 설정
      const characterExists = !res.data.isFirst;
      setHasCharacter(characterExists);
      console.log("캐릭터 존재 여부:", characterExists);
      
      // 직접 토큰을 전달하여 사용자 정보 가져오기
      await fetchUserData(res.data.accessToken);
      
      // 캐릭터 존재 여부에 따라 다른 페이지로 이동
      if (characterExists) {
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

  // 회원가입 함수 - API 명세서에 맞게 수정 및 에러 처리 개선
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
      await axios.post("/users/signup", signupData);
      
      // 회원가입 성공 후 로그인 페이지로 이동
      navigate("/login");
      
      return { success: true };
    } catch (error: any) { // any 타입으로 지정
      console.error("회원가입 실패", error);
      throw error; // 에러를 다시 throw하여 컴포넌트에서 처리할 수 있게 함
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await axios.post("/users/logout");

      // 예약된 갱신 타이머가 있다면 제거
    if (refreshTimerId) {
      clearTimeout(refreshTimerId);
      setRefreshTimerId(null);
    }

      clearToken();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  // fetchUserData 함수 - accessToken 매개변수 추가
  const fetchUserData = async (accessToken?: string) => {
    // 파라미터로 받은 토큰이 있거나 store에 있는 토큰 사용
    const currentToken = accessToken || token;
    
    if (!currentToken) {
      console.log("토큰이 없어 유저 정보를 가져올 수 없습니다.");
      setLoading(false);
      return;
    }
    
    try {
      console.log("유저 정보 요청 시작, 토큰:", currentToken);
      const res = await axiosInstance.get("/users/info", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      
      console.log("유저 정보 응답:", res.data);
      
      // API 응답의 정확한 구조를 확인
      const userData = res.data.userInfo || res.data;
      console.log("파싱된 유저 데이터:", userData);
      
      if (!userData || typeof userData !== 'object') {
        console.error("유저 데이터가 올바른 형식이 아닙니다:", userData);
        return;
      }
      
      setUser(userData);

      // 토큰 갱신 타이머 설정 (신규 로그인 시에만)
      if (accessToken) {
        refreshTokenTimer();
      }

      return userData;
    } catch (error) {
      console.error("유저 정보 가져오기 실패", error);
      // 401 에러인 경우 토큰이 만료되었을 수 있음
      if (isAxiosError(error) && error.response?.status === 401) {
        console.log("인증 에러 - 토큰 갱신 시도");
        const refreshSuccessful = await refreshToken();
        if (!refreshSuccessful) {
          console.log("토큰 갱신 실패 - 로그아웃");
          clearToken();
          setUser(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // 토큰 갱신 타이머 설정을 위한 함수
  const refreshTokenTimer = () => {
    // 기존 타이머 정리
    if (refreshTimerId) {
      clearTimeout(refreshTimerId);
    }
    
    // 만료 5분 전에 갱신 (최소 30초)
    const refreshDelay = Math.max(30000, 900000 - 300000); // 기본값 15분(900000ms)에서 5분 전
    console.log(`${refreshDelay}ms 후 토큰 갱신 예정`);
    
    const newTimerId = setTimeout(() => {
      console.log("자동 갱신 타이머 실행:", new Date().toISOString());
      refreshToken();
    }, refreshDelay);
    
    setRefreshTimerId(newTimerId);
  };

  // AccessToken 갱신 (refreshToken은 쿠키에 있으므로 자동으로 전송됨)
  const refreshToken = async () => {
    try {
      console.log("토큰 갱신 시도 시간:", new Date().toISOString());
      
      // withCredentials 옵션 추가하여 쿠키가 포함되도록 함
      const res = await axios.post<LoginResponse>("/users/refresh", {}, {
        withCredentials: true
      });
      
      console.log("토큰 갱신 응답:", res.data);
      
      if (!res.data.accessToken) {
        console.error("새 액세스 토큰이 없습니다:", res.data);
        return false;
      }
      
      setToken(res.data.accessToken);
      console.log("새 토큰 설정됨:", res.data.accessToken);
      
      // 만료 시간 (기본값 설정)
      const newExpiresIn = res.data.timeToLive || 900000; // 기본값 15분
      console.log("새 토큰 만료 시간:", newExpiresIn, "ms");
      
      // 기존 타이머 정리
      if (refreshTimerId) {
        clearTimeout(refreshTimerId);
      }
      
      // 만료 5분 전에 갱신 (최소 30초)
      const refreshDelay = Math.max(30000, newExpiresIn - 300000);
      console.log(`${refreshDelay}ms 후 토큰 갱신 예정 (${new Date(Date.now() + refreshDelay).toISOString()})`);
      
      const refreshTimeoutId = setTimeout(() => {
        console.log("자동 갱신 타이머 실행:", new Date().toISOString());
        refreshToken();
      }, refreshDelay);
      
      setRefreshTimerId(refreshTimeoutId);
      return true;
    } catch (error) {
      console.error("토큰 갱신 실패", error);
      
      // 로그인 페이지에 있지 않은 경우에만 로그아웃
      if (window.location.pathname !== '/login') {
        clearToken();
        setUser(null);
      }
      return false;
    }
  };

  // 닉네임 변경 - API 명세에 맞게 수정
  const changeNickname = async (updateNickname: string) => {
    try {
      // 현재 닉네임과 동일한지 체크
      if (user?.nickname === updateNickname) {
        throw new Error("현재 닉네임과 동일합니다.");
      }

      // API 명세에 맞게 필드명 수정
      await axios.patch("/users/nickname", { updateNickname });
      
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

  // 비밀번호 찾기
  const requestPasswordReset = async (email: string) => {
    try {
      await axios.post("/users/password/reset/request", { email });
    } catch (error) {
      console.error("비밀번호 찾기 실패", error);
    }
  };

  // 비밀번호 변경 함수 추가
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

      // 여기서부터는 user가 null이 아님이 보장됨
      console.log("사용자 정보:", user);
      // 디버깅: user 객체의 모든 속성 출력
      console.log("사용자 정보 전체:", user);
      console.log("사용자 ID 관련 필드:", {
        id: user.id,
        userId: user.userId
      });

      // API 명세에 맞게 요청 구성
      // userId는 서버에서 토큰으로 식별할 수도 있지만, API 명세에 있으므로 포함
      const userId = user?.id || user.userId; // 사용자 ID가 없는 경우 빈 문자열
      
      if (!userId) {
        throw new Error("사용자 ID를 찾을 수 없습니다.");
      }
  
      console.log("비밀번호 변경 요청, userId:", userId);

      await axios.patch("/users/password", {
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

  // 초기 로그인 상태 확인
  useEffect(() => {
    if (token) {
      fetchUserData();
      // refreshToken(); // 초기 실행 시에도 갱신 시도
    } else {
      setLoading(false);
    }
  }, [token]);

  // 이메일 중복 확인
  const validateEmail = async (email: string) => {
    try {
      const response = await axios.post("/users/email-validation", { email });
      console.log("이메일 검증 응답:", response.data);
      
      // 응답 구조에 따라 조건문 추가 
      // 만약 응답에 중복 여부가 포함되어 있다면:
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
      await axios.post("/users/email/password/reset/request", { email });
      const response = await axiosInstance.post("/users/email/password/reset/request", { email });
      console.log("이메일 전송 응답:", response.data);
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
      await axios.post("/users/email/password/reset/confirm", { email, authCode });
      return { success: true, message: "이메일이 성공적으로 인증되었습니다." };
    } catch (error: any) {
      console.error("이메일 인증 코드 확인 실패", error);
      return {
        success: false,
        message: error.response?.data?.message || "인증 코드가 올바르지 않습니다."
      };
    }
  };

  return {
    user,
    loading,
    login,
    signup,
    logout,
    refreshToken,
    changeNickname,
    requestPasswordReset,
    changePassword,
    validateEmail,
    sendEmailVerification,
    verifyEmailCode,
  };
};