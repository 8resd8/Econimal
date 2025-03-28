// AuthProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  hasCharacter: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  signup: (
    email: string, 
    password1: string, 
    password2: string, 
    name: string, 
    nickname: string, 
    birth: string, 
    userType?: string
  ) => Promise<any>;
  refreshToken: () => Promise<boolean>;
  changeNickname: (updateNickname: string) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<any>;
  changePassword: (newPassword1: string, newPassword2: string) => Promise<any>;
  validateEmail: (email: string) => Promise<any>;
  sendEmailVerification: (email: string) => Promise<any>;
  verifyEmailCode: (email: string, authCode: string) => Promise<any>;
  fetchUserData: () => Promise<any>;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider props 타입
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider 컴포넌트
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅으로 인증 컨텍스트 사용
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};