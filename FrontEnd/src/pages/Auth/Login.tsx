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
      <div className="p-8 rounded-lg text-center">
        <img src={logoImage} alt="에코니멀 로고" className="mx-auto w-32 mb-4" />
        <div className="flex items-center justify-center
          flex-col space-y-3
          p-5 rounded-lg">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디"
            className="pt-2 pb-2 pl-3 border-4 border-white
             rounded-lg bg-black bg-opacity-25 w-full
             font-extrabold text-lg"
             style={{ 
              color: 'white', 
              caretColor: 'white'  // 커서 색상도 설정
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="pt-2 pb-2 pl-3 border-4 border-white
             rounded-lg bg-black bg-opacity-25 w-full
             font-extrabold text-lg"
             style={{ color: 'white' }}
          />
          <button
            onClick={handleLogin}
            className="text-indigo font-bold pt-1 pb-1
             bg-white rounded-lg w-20"
          >
            로그인
          </button>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <input type="checkbox" id="rememberMe"
              className="w-4 h-4 bg-white" />
            <label htmlFor="rememberMe"
              className="text-white">자동 로그인</label>
          </div>
          <a href="/signup" className="text-white
           text-sm whitespace-pre-wrap">
            아직 회원이 아니신가요?
            회원가입 하러가기
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;