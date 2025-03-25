import { useState } from "react";
import bgImage from "@/assets/auth_background.png";
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
  
  // 이메일 인증 상태 추가
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  // 비밀번호 관련 상태를 추가
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMatchValid, setPasswordMatchValid] = useState(false);
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string) => {
    // 비밀번호 정책: 최소 8자, 소문자, 숫자, 특수문자 포함 (대문자 제외)
    const minLength = password.length >= 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const isValid = minLength && hasLowerCase && hasNumbers && hasSpecialChar;
    
    let message = "";
    if (!minLength) message = "비밀번호는 최소 8자 이상이어야 합니다.";
    else if (!hasLowerCase) message = "소문자를 포함해야 합니다.";
    else if (!hasNumbers) message = "숫자를 포함해야 합니다.";
    else if (!hasSpecialChar) message = "특수문자를 포함해야 합니다.";
    else message = "사용 가능한 비밀번호입니다.";
    
    setPasswordValid(isValid);
    setPasswordMessage(message);
    
    // 비밀번호 일치 여부도 다시 확인
    if (password2) {
      checkPasswordMatch(password, password2);
    }
  };

  // 비밀번호 일치 여부 검사 함수
  const checkPasswordMatch = (pw1: string, pw2: string) => {
    const isMatch = pw1 === pw2;
    setPasswordMatchValid(isMatch);
    setPasswordMatchMessage(isMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.");
  };


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

      // 이메일이 유효하면 인증 단계 표시
      if (result.isValid) {
      setShowVerification(true);
      }
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

  // 이메일 인증 코드 전송
  const handleSendVerification = async () => {
    if (!emailValidated) {
      setVerificationMessage("먼저 이메일 중복 확인을 해주세요.");
      return;
    }
    
    setIsSendingCode(true);
    setVerificationMessage("");
    
    try {
      const result = await auth.sendEmailVerification(email);
      setVerificationMessage(result.message);
    } catch (error) {
      setVerificationMessage("인증 코드 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSendingCode(false);
    }
  };

  // 이메일 인증 코드 확인
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationMessage("인증 코드를 입력해주세요.");
      return;
    }
    
    setIsVerifyingCode(true);
    
    try {
      const result = await auth.verifyEmailCode(email, verificationCode);
      setEmailVerified(result.success);
      setVerificationMessage(result.message);
    } catch (error) {
      setVerificationMessage("인증 코드 확인 중 오류가 발생했습니다.");
      setEmailVerified(false);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // 회원가입 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 이메일 중복 확인 여부 체크
    if (!emailValidated) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }

    // 이메일 인증 여부 체크
    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    
    // 비밀번호 유효성 검사
    if (!passwordValid) {
      alert("비밀번호가 유효하지 않습니다.");
      return;
    }
    
    // 비밀번호 일치 검사
    if (!passwordMatchValid) {
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

  // 비밀번호 입력 핸들러 수정
  const handlePassword1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword1(newPassword);
    validatePassword(newPassword);
  };

  // 비밀번호 확인 입력 핸들러 수정
  const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword2 = e.target.value;
    setPassword2(newPassword2);
    if (newPassword2) {
      checkPasswordMatch(password1, newPassword2);
    } else {
      setPasswordMatchValid(false);
      setPasswordMatchMessage("");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >

      {/* 회원가입 폼 */}
      <div className="relative p-8 text-center w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">회원가입</h2>
        <div className="flex flex-col space-y-3">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-2">
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
                className="absolute right-0 top-0 bottom-0 bg-slate-600 hover:bg-slate-700
                text-white px-3 m-2.5 rounded-lg flex items-center justify-center transition-colors
                disabled:opacity-50"
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

            {/* 이메일 인증 코드 요청 - 이메일 중복 확인 후 표시 */}
            {showVerification && (
              <div className="mt-2">
                <div className="flex">
                  <button
                    type="button"
                    onClick={handleSendVerification}
                    disabled={isSendingCode || !emailValidated}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors w-full disabled:opacity-50"
                  >
                    {isSendingCode ? "전송 중..." : "인증 코드 전송"}
                  </button>
                </div>
              </div>
            )}
            
            {/* 인증 코드 입력 필드 - 인증 코드 전송 후 표시 */}
            {verificationMessage && verificationMessage.includes("전송") && (
              <div className="mt-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="인증 코드 입력"
                    className={`pt-2 pb-2 pl-3 border-4 border-white
                    rounded-lg bg-black bg-opacity-25 flex-grow
                    font-extrabold text-lg ${emailVerified ? 'border-green-400' : ''}`}
                    style={{ 
                      color: 'white', 
                      caretColor: 'white'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isVerifyingCode || !verificationCode}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            
            {/* 인증 결과 메시지 */}
            {verificationMessage && (
              <div className={`text-sm ${emailVerified ? 'text-green-400' : 'text-yellow-400'} text-left`}>
                {verificationMessage}
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

            {/* 비밀번호 유효성 메시지 */}
            {passwordMessage && (
              <div className={`text-sm ${passwordValid ? 'text-green-400' : 'text-red-400'} text-left`}>
                {passwordMessage}
              </div>
            )}
            
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
            
            {/* 비밀번호 일치 메시지 */}
            {password2 && passwordMatchMessage && (
              <div className={`text-sm ${passwordMatchValid ? 'text-green-400' : 'text-red-400'} text-left`}>
                {passwordMatchMessage}
              </div>
            )}

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
            
            <div className="relative">
              {/* 생년월일 입력 필드 */}
              <input
                type="date"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                placeholder="생년월일"
                className="pt-2 pb-2 pl-3 pr-3 border-4 border-white
                rounded-lg bg-black bg-opacity-25 w-full
                font-extrabold text-lg z-10 relative"
                style={{ 
                  color: 'white', 
                  caretColor: 'white'
                }}
              />
              <svg 
                className="absolute top-1/2 right-3 transform -translate-y-1/2 z-0" 
                width="30" 
                height="30" 
                viewBox="0 0 24 24" 
                fill="white"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>

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
          <a href="/login" className="text-slate-200 text-sm mt-3
            block hover:text-blue-200">
            이미 회원이신가요? 로그인 하러가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;