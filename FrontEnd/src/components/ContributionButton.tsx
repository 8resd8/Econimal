// src/components/ContributionButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContributionButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/contribution');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-16 z-40 border-slate-200 bg-slate-50 hover:bg-slate-300
      text-slate-700 font-bold py-2 px-4 rounded-full shadow-lg flex items-center transition-colors
      duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      내 기여도 보기
    </button>
  );
};

export default ContributionButton;