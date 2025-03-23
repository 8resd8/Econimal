import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const InfoEdit = () => {
  const { user, loading, changeNickname, changePassword } = useAuth();
  const navigate = useNavigate();
  
  // 상태 관리
  const [updateNickname, setUpdateNickname] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [nicknameSuccess, setNicknameSuccess] = useState<boolean | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean | null>(null);

  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 유저 정보가 없으면 로그인 필요 표시
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-red-500">사용자 정보를 불러올 수 없습니다</h2>
        <p className="mt-2">로그인이 필요합니다.</p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  // 닉네임 변경 처리
  const handleNicknameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateNickname.trim()) {
      setNicknameMessage('닉네임을 입력해주세요.');
      setNicknameSuccess(false);
      return;
    }

    // 현재 닉네임과 동일한지 체크
    if (user.nickname === updateNickname) {
      setNicknameMessage('현재 닉네임과 동일합니다.');
      setNicknameSuccess(false);
      return;
    }

    const result = await changeNickname(updateNickname);
    setNicknameMessage(result.message);
    setNicknameSuccess(result.success);
    
    if (result.success) {
      setUpdateNickname('');
    }
  };

  // 비밀번호 변경 처리
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword1 || !newPassword2) {
      setPasswordMessage('모든 필드를 입력해주세요.');
      setPasswordSuccess(false);
      return;
    }

    if (newPassword1 !== newPassword2) {
      setPasswordMessage('비밀번호가 일치하지 않습니다.');
      setPasswordSuccess(false);
      return;
    }

    const result = await changePassword(newPassword1, newPassword2);
    setPasswordMessage(result.message);
    setPasswordSuccess(result.success);
    
    if (result.success) {
      setNewPassword1('');
      setNewPassword2('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">프로필 수정</h1>
      
      {/* 현재 정보 표시 */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">현재 정보</h2>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">이름:</span>
          <span>{user.name}</span>
          <span className="text-gray-600">닉네임:</span>
          <span>{user.nickname}</span>
          <span className="text-gray-600">이메일:</span>
          <span>{user.email}</span>
        </div>
      </div>
      
      {/* 닉네임 변경 폼 */}
      <form onSubmit={handleNicknameChange} className="mb-8">
        <h2 className="text-lg font-semibold mb-3">닉네임 변경</h2>
        <div className="mb-4">
          <input
            type="text"
            value={updateNickname}
            onChange={(e) => setUpdateNickname(e.target.value)}
            placeholder="새 닉네임"
            className="w-full p-3 border rounded-lg"
          />
        </div>
        
        {nicknameMessage && (
          <div className={`mb-4 p-3 rounded-lg ${nicknameSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {nicknameMessage}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          닉네임 변경
        </button>
      </form>
      
      {/* 비밀번호 변경 폼 */}
      <form onSubmit={handlePasswordChange}>
        <h2 className="text-lg font-semibold mb-3">비밀번호 변경</h2>
        <div className="mb-4">
          <input
            type="password"
            value={newPassword1}
            onChange={(e) => setNewPassword1(e.target.value)}
            placeholder="새 비밀번호"
            className="w-full p-3 border rounded-lg mb-3"
          />
          <input
            type="password"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            placeholder="새 비밀번호 확인"
            className="w-full p-3 border rounded-lg"
          />
        </div>
        
        {passwordMessage && (
          <div className={`mb-4 p-3 rounded-lg ${passwordSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {passwordMessage}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          비밀번호 변경
        </button>
      </form>
      
      {/* 뒤로 가기 버튼 */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/my')}
          className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          프로필로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default InfoEdit;