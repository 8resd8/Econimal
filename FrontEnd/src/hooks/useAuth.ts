import { useState, useEffect } from "react";
import axios from "@/api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/store"; // Zustand 사용 시

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
      
      // 사용자 정보 가져오기
      await fetchUserData();
      
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

  // 유저 정보 불러오기
  const fetchUserData = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/users/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // API 응답에서 userInfo 객체 추출
      const userData = res.data.userInfo; // 이 부분 확인 필요
      setUser(userData);
      return userData;
      // setUser(res.data);

    } catch (error) {
      console.error("유저 정보 가져오기 실패", error);
    } finally {
      setLoading(false);
    }
  };

  // AccessToken 갱신 (refreshToken은 쿠키에 있으므로 자동으로 전송됨)
  const refreshToken = async () => {
    try {
      const res = await axios.post<LoginResponse>("/users/refresh");
      setToken(res.data.accessToken);
      
      const expiresIn = res.data.timeToLive;
      // 만료 시간 5분 전에 자동 갱신 예약
    const refreshTimeoutId = setTimeout(() => {
      refreshToken();
    }, expiresIn - 300000); // 5분(300000ms)을 빼서 만료 직전에 갱신
    
    // 타이머 ID 저장 (로그아웃 시 타이머 제거를 위해)
    setRefreshTimerId(refreshTimeoutId);

      return true; // 성공 시 true 반환
    } catch (error) {
      console.error("토큰 갱신 실패", error);
      // 로그인 페이지에 있지 않은 경우에만 로그아웃
      if (window.location.pathname !== '/login') {
        clearToken();
      }
      return false; // 실패 시 false 반환
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

  // 비밀번호 찾기 & 변경
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

      // API 명세에 맞게 요청 구성
      // userId는 서버에서 토큰으로 식별할 수도 있지만, API 명세에 있으므로 포함
      const userId = user?.id || ""; // 사용자 ID가 없는 경우 빈 문자열
      
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
    } else {
      setLoading(false);
    }
  }, [token]);

  return {
    user,
    loading,
    login,
    signup,
    logout,
    refreshToken,
    changeNickname,
    requestPasswordReset,
    changePassword
  };
};