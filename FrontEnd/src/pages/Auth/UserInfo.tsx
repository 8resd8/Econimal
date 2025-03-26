import React from 'react';
import bgImage from "@/assets/auth_background.png";
import { useAuth } from '@/hooks/useAuth';

const UserInfo = () => {
  const { user, loading } = useAuth();
  const { logout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-red-500">사용자 정보를 불러올 수 없습니다</h2>
        <p className="mt-2">로그인이 필요합니다.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-lg mx-auto pt-10 pb-10">
        <div className="bg-slate-50 rounded-xl shadow-md overflow-hidden">
          <div className="p-8 w-full">
            <div className="flex justify-center items-center uppercase tracking-wide text-lg text-gray-700 font-bold">
              🌍 {user.nickname}의 프로필 🌍
            </div>
            {/* <div className="flex justify-between items-center">
              <div className="text-gray-500 text-sm">
              마지막 로그인: {new Date(user.lastLoginAt).toLocaleString()}
              </div>
            </div> */}
            
            <h1 className="mt-2 text-2xl font-bold text-gray-800">{user.nickname}</h1>
            <p className="text-gray-600">{user.name}</p>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">이메일</span>
              <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">생년월일</span>
              <span className="font-medium">{user.birth}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">보유 코인</span>
              <span className="font-medium text-yellow-600">{user.coin.toLocaleString()} 코인</span>
              </div>
              <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">사용자 유형</span>
              <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between items-center">
              <span className="text-gray-500">마을 이름</span>
              <span className="font-medium text-green-600">{user.townName}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button 
              onClick={() => window.location.href = '/'}
              className="mx-2 px-4 py-2 bg-slate-200 text-gray-700
              rounded-lg hover:bg-slate-300 transition-colors shadow-md"
              >
              메인으로
              </button>
              <button 
              onClick={() => window.location.href = '/edit-profile'}
              className="mx-2 px-4 py-2 bg-blue-300 text-gray-700
              rounded-lg hover:bg-blue-400 transition-colors shadow-md"
              >
              프로필 수정
              </button>
              <button 
                  onClick={logout}
                  className='bg-red-300 hover:bg-red-400 text-gray-700
                  px-4 py-2 rounded-lg transition-colors duration-300 shadow-md'
              >
                  로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;