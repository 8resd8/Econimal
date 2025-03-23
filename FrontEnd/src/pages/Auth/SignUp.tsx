import { useState } from "react";
import bgImage from "@/assets/auth_background.png"; // 배경 이미지
import logoImage from "@/assets/logo.png"; // 로고 이미지
import { useAuth } from "@/hooks/useAuth"; // useAuth 훅 불러오기

const Signup = () => {
  // API 명세서에 맞게 필드 추가
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState(""); // password1으로 이름 변경
  const [password2, setPassword2] = useState(""); // password2로 이름 변경
  const [name, setName] = useState(""); // 이름 필드 추가
  const [nickname, setNickname] = useState("");
  const [birth, setBirth] = useState(""); // birth로 이름 변경
  const [userType, setUserType] = useState("USER"); // userType 필드 추가

  // 비밀번호 표시/숨김 상태 관리
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  
  // useAuth 훅에서 signup 함수 가져오기
  const { signup } = useAuth();

  const handleSignup = async () => {
    // 비밀번호 일치 검사
    if (password1 !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    try {
      // useAuth 훅의 signup 함수 사용
      await signup(email, password1, password2, name, nickname, birth, userType);
      alert("회원가입에 성공했습니다!");
      // navigate는 useAuth 내에서 처리됨
    } catch (error: any) { // 'any' 타입으로 지정
      console.error("회원가입 실패:", error);
      if (error.response) {
        alert(`회원가입 실패: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
      } else {
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 비밀번호 표시/숨김 토글 함수
  const togglePassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* 반투명 로고 */}
      <img
        src={logoImage}
        alt="로고"
        className="absolute w-100 opacity-80"
        style={{ top: "20%", left: "50%", transform: "translateX(-50%)" }}
      />

      {/* 회원가입 폼 */}
      <div className="relative p-8 text-center w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">회원가입</h2>
        <div className="flex flex-col space-y-3">
        {/* form 태그를 비어있게 만들지 말고, 모든 입력 필드를 포함하도록 수정 */}
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
          className="flex flex-col space-y-4 p-4"
          >
            {/* 이메일 입력 필드 */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="pt-2 pb-2 pl-3 border-4 border-white
              rounded-lg bg-black bg-opacity-25 w-full
              font-extrabold text-lg"
              style={{ 
                color: 'white', 
                caretColor: 'white'
              }}
            />
            
            {/* 비밀번호 입력 필드 - 눈 아이콘 추가 */}
            <div className="relative">
              <input
                type={showPassword1 ? "text" : "password"}
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                placeholder="비밀번호"
                className="pt-2 pb-2 pl-3 border-4 border-white
                rounded-lg bg-black bg-opacity-25 w-full
                font-extrabold text-lg"
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
                    // 눈이 열린 아이콘 (비밀번호 표시 중)
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  ) : (
                    // 눈이 닫힌 아이콘 (비밀번호 숨김 중)
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* 비밀번호 확인 필드 - 눈 아이콘 추가 */}
            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="비밀번호 확인"
                className="pt-2 pb-2 pl-3 border-4 border-white
                rounded-lg bg-black bg-opacity-25 w-full
                font-extrabold text-lg"
                style={{ 
                  color: 'white', 
                  caretColor: 'white'
                }}
              />
              <button 
                type="button"
                onClick={togglePassword2}
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
                  {showPassword2 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* 이름 입력 필드 */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="pt-2 pb-2 pl-3 border-4 border-white
              rounded-lg bg-black bg-opacity-25 w-full
              font-extrabold text-lg"
              style={{ 
                color: 'white', 
                caretColor: 'white'
              }}
            />
            
            {/* 닉네임 입력 필드 */}
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              className="pt-2 pb-2 pl-3 border-4 border-white
              rounded-lg bg-black bg-opacity-25 w-full
              font-extrabold text-lg"
              style={{ 
                color: 'white', 
                caretColor: 'white'
              }}
            />
            
            {/* 생년월일 입력 필드 */}
            <input
              type="date"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              placeholder="생년월일"
              className="pt-2 pb-2 pl-3 border-4 border-white
              rounded-lg bg-black bg-opacity-25 w-full
              font-extrabold text-lg"
              style={{ 
                color: 'white', 
                caretColor: 'white'
              }}
            />
            
            {/* 회원가입 버튼 - type="submit"으로 변경 */}
            <button
              type="submit"
              className="bg-slate-500 text-white
              p-3 rounded-lg mt-4 w-40"
            >
              회원가입
            </button>
          </form>

          {/* 로그인 페이지 링크 - form 바깥으로 이동 */}
          <a href="/login" className="text-white text-sm mt-3 block">
            이미 회원이신가요? 로그인 하러가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;