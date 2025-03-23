import { useState } from "react";
import bgImage from "@/assets/auth_background.png";
import logoImage from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  // 상태 관리
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birth, setBirth] = useState("");
  const [userType, setUserType] = useState("USER");
  
  // 비밀번호 표시/숨김 상태
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  
  // 이메일 유효성 상태
  const [emailValidated, setEmailValidated] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  
  // useAuth 훅 사용
  const auth = useAuth();

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    if (!email.trim()) {
      setEmailMessage("이메일을 입력해주세요.");
      setEmailValidated(false);
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailMessage("올바른 이메일 형식이 아닙니다.");
      setEmailValidated(false);
      return;
    }

    setIsCheckingEmail(true);
    
    try {
      const result = await auth.validateEmail(email);
      setEmailValidated(result.isValid);
      setEmailMessage(result.message);
    } catch (error) {
      setEmailValidated(false);
      setEmailMessage("이메일 중복 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 이메일 변경 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailValidated(false);
    setEmailMessage("");
  };

  // 회원가입 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 이메일 중복 확인 여부 체크
    if (!emailValidated) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }
    
    // 비밀번호 일치 검사
    if (password1 !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    try {
      await auth.signup(email, password1, password2, name, nickname, birth, userType);
      alert("회원가입에 성공했습니다!");
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      if (error.response) {
        alert(`회원가입 실패: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
      } else {
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 비밀번호 토글 핸들러
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
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
            {/* 이메일 입력 필드 - 중복 확인 버튼 추가 */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="이메일"
                className={`pt-2 pb-2 pl-3 pr-24 border-4 border-white
                rounded-lg bg-black bg-opacity-25 w-full
                font-extrabold text-lg ${emailValidated ? 'border-green-400' : ''}`}
                style={{ 
                  color: 'white', 
                  caretColor: 'white'
                }}
              />
              <button 
                type="button"
                onClick={handleEmailCheck}
                disabled={isCheckingEmail || !email}
                className="absolute right-0 top-0 bottom-0 bg-slate-600 hover:bg-slate-700 text-white px-3 m-1 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {isCheckingEmail ? "확인 중..." : "중복 확인"}
              </button>
            </div>

            {/* 이메일 유효성 메시지 */}
            {emailMessage && (
              <div className={`text-sm ${emailValidated ? 'text-green-400' : 'text-red-400'} text-left`}>
                {emailMessage}
              </div>
            )}
            
            {/* 비밀번호 입력 필드 - 눈 아이콘 */}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* 비밀번호 확인 필드 - 눈 아이콘 */}
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
            
            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="bg-slate-500 text-white
              p-3 rounded-lg mt-4 w-40 mx-auto"
            >
              회원가입
            </button>
          </form>

          {/* 로그인 페이지 링크 */}
          <a href="/login" className="text-white text-sm mt-3 block">
            이미 회원이신가요? 로그인 하러가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;