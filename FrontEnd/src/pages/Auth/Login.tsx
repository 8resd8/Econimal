import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import bgImage from "@/assets/auth_background.png"; // 배경 이미지
import logoImage from "@/assets/logo.png"; // 로고 이미지

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // 입력 검증
    if (!email) {
      setError("이메일을 입력해주세요");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      // 로그인 성공 - useAuth 내부에서 navigate 처리
    } catch (error: any) {
      console.error("로그인 오류:", error);
      // 서버 에러 메시지가 있으면 표시, 없으면 기본 메시지
      setError(error.response?.data?.message || "로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 엔터 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center w-full h-full"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="p-8 rounded-lg text-center">
        <img src={logoImage} alt="에코니멀 로고" className="mx-auto w-32 mb-4" />
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="아이디"
            className="p-3 border rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="비밀번호"
            className="pt-2 pb-2 pl-3 border-4 border-white
             rounded-lg bg-black bg-opacity-25 w-full
             font-extrabold text-lg"
             style={{ color: 'white' }}
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            {isLoading ? '...' : '로그인'}
          </button>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <input type="checkbox" id="rememberMe" className="w-4 h-4" />
            <label htmlFor="rememberMe">자동 로그인</label>
          </div>
          <a href="/signup" className="text-blue-400 text-sm">
            아직 회원이 아니신가요? 회원가입 하러가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;