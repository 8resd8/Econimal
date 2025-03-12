import { useState } from "react";
import bgImage from "@/assets/auth_background.png"; // 배경 이미지
import logoImage from "@/assets/logo.png"; // 로고 이미지

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      // 회원가입 로직 (추후 API 연결)
      alert("회원가입 성공!");
    } catch (error) {
      alert("회원가입 실패");
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="p-3 border rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="p-3 border rounded-lg"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 확인"
            className="p-3 border rounded-lg"
          />
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            className="p-3 border rounded-lg"
          />
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            placeholder="생년월일"
            className="p-3 border rounded-lg"
          />
          <button
            onClick={handleSignup}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            회원가입
          </button>
          <a href="/login" className="text-blue-400 text-sm">
            이미 회원이신가요? 로그인 하러가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
