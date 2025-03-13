import { useState, useEffect } from "react";
import axios from "@/api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/store"; // Zustand 사용 시

interface User {
  id: string;
  email: string;
  nickname: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { token, setToken, clearToken } = useAuthStore(); // Zustand 상태 관리

  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("/users/login", { email, password });
      setToken(res.data.accessToken); // Zustand에 저장
      await fetchUserData();
      navigate("/"); // 로그인 후 홈으로 이동
    } catch (error) {
      console.error("로그인 실패", error);
      throw error;
    }
  };

  // 회원가입 함수
  const signup = async (email: string, password: string, nickname: string) => {
    try {
      await axios.post("/users/signup", { email, password, nickname });
      navigate("/login"); // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      console.error("회원가입 실패", error);
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await axios.post("/users/logout");
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
      setUser(res.data);
    } catch (error) {
      console.error("유저 정보 가져오기 실패", error);
    } finally {
      setLoading(false);
    }
  };

  // AccessToken 갱신
  const refreshToken = async () => {
    try {
      const res = await axios.post("/users/token/refresh");
      setToken(res.data.accessToken);
    } catch (error) {
      console.error("토큰 갱신 실패", error);
      logout();
    }
  };

  // 닉네임 변경
  const changeNickname = async (nickname: string) => {
    try {
      await axios.patch("/users/nickname", { nickname });
      setUser((prev) => prev && { ...prev, nickname });
    } catch (error) {
      console.error("닉네임 변경 실패", error);
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

  const confirmPasswordReset = async (token: string, newPassword: string) => {
    try {
      await axios.post("/users/password/reset/confirm", { token, newPassword });
    } catch (error) {
      console.error("비밀번호 변경 실패", error);
    }
  };

  // 초기 로그인 상태 확인
  useEffect(() => {
    fetchUserData();
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
    confirmPasswordReset,
  };
};
