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
  // 비밀번호 표시/숨김 상태
  const [showPassword1, setShowPassword1] = useState(false);


  // 비밀번호 토글 핸들러
  const togglePassword1 = () => {
    setShowPassword1(!showPassword1);
  };

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
        <div className="text-white font-extrabold text-4xl mb-5">
          ECONIMAL
        </div>
        <div className="flex flex-col space-y-3 justify-center">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="아이디"
            className="pt-2 pb-2 pl-3 border-4 border-white
              rounded-lg bg-black bg-opacity-25 w-full
              font-extrabold text-lg text-white"
          />
          {/* 비밀번호 입력 필드 - 눈 아이콘 */}
          <div className="relative">
            <input
              type={showPassword1 ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="pt-2 pb-2 pl-3 border-4 border-white
              rounded-lg bg-black bg-opacity-25 w-full
              font-extrabold text-lg mb-2"
              style={{ 
                color: 'white', 
                caretColor: 'white'
              }}
            />
            <button 
              type="button"
              onClick={togglePassword1}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="white" 
                className="w-6 h-6"
              >
                {showPassword1 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                )}
              </svg>
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="bg-blue-300 text-white p-3 rounded-lg hover:bg-blue-400 w-20 text-center mx-auto"
          >
            {isLoading ? '...' : '로그인'}
          </button>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <input type="checkbox" id="rememberMe" className="w-4 h-4" />
            <label htmlFor="rememberMe" className="text-white">
              자동 로그인
            </label>
          </div>
          <a href="/signup" className="text-slate-200 text-sm hover:text-blue-200">
            아직 회원이 아니신가요? 회원가입 하러가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;