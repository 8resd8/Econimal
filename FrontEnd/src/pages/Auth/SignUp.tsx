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

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* 반투명 로고 */}
      <img
        src={logoImage}
        alt="로고"
        className="absolute w-72 opacity-20"
        style={{ top: "20%", left: "50%", transform: "translateX(-50%)" }}
      />

      {/* 회원가입 폼 */}
      <div className="relative bg-white bg-opacity-90 p-8 rounded-lg text-center shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">회원가입</h2>
        <div className="flex flex-col space-y-3">
        {/* form 태그를 비어있게 만들지 말고, 모든 입력 필드를 포함하도록 수정 */}
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}>
            {/* 이메일 입력 필드 */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="p-3 border rounded-lg"
            />
            
            {/* 비밀번호 입력 필드 */}
            <input
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="비밀번호"
              className="p-3 border rounded-lg"
            />
            
            {/* 비밀번호 확인 필드 */}
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="비밀번호 확인"
              className="p-3 border rounded-lg"
            />
            
            {/* 이름 입력 필드 */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="p-3 border rounded-lg"
            />
            
            {/* 닉네임 입력 필드 */}
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              className="p-3 border rounded-lg"
            />
            
            {/* 생년월일 입력 필드 */}
            <input
              type="date"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              placeholder="생년월일"
              className="p-3 border rounded-lg"
            />
            
            {/* 회원가입 버튼 - type="submit"으로 변경 */}
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              회원가입
            </button>
          </form>

          {/* 로그인 페이지 링크 - form 바깥으로 이동 */}
          <a href="/login" className="text-blue-400 text-sm mt-3 block">
            이미 회원이신가요? 로그인 하러가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;