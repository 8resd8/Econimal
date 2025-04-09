import React from 'react';
import aiLoadingGif from '@/assets/ailoading.gif';

const LoadingModal = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3 bg-white p-4 rounded-lg shadow-md scale-[60%]">
      <img 
        src={aiLoadingGif} 
        alt="로딩 중..." 
        className="h-45 w-65" 
      />
      <h3 className="text-lg font-medium text-gray-700">
        AI가 내용을 검사중이에요
      </h3>
    </div>
  );
};

export default LoadingModal;