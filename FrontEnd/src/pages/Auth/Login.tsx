import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import bgImage from "@/assets/auth_background.png"; // 배경 이미지
import logoImage from "@/assets/logo.png"; // 로고 이미지

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      alert("로그인 실패");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center w-full h-full"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-opacity-90 p-8 rounded-lg text-center">
        <img src={logoImage} alt="에코니멀 로고" className="mx-auto w-32 mb-4" />
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디"
            className="p-3 border rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="p-3 border rounded-lg"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            로그인
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