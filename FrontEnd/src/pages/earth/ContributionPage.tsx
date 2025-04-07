// src/pages/ContributionPage.tsx
import React, { useState, useEffect } from 'react';
import { fetchFeedbackData, FeedbackData } from './features/FeedbackApi';
import ContributionChart from './components/ContributionChart';
import AIFeedback from './components/AIFeedback';
import bgImage from "@/assets/auth_background.png";
import GoMainBtn from '@/components/GoMainBtn';
import { useErrorStore } from '@/store/errorStore'; // 에러 스토어 import 추가

const ContributionPage: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hideError = useErrorStore(state => state.hideError); // 에러 초기화 함수 가져오기

  useEffect(() => {
    hideError();

    const loadFeedbackData = async () => {
      try {
        setLoading(true);
        const data = await fetchFeedbackData();
        setFeedbackData(data);
        setError(null);
      } catch (err) {
        console.error('기여도 데이터 로딩 실패:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadFeedbackData();
  }, [hideError]);

  return (
    <div 
      className="fixed inset-0 w-full h-full bg-cover bg-center overflow-auto"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className='absolute top-4 left-4 z-30'>
        <GoMainBtn />
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-white mb-8">
            나의 환경 기여도
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">오류!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : feedbackData ? (
            <div className="space-y-8">
              <ContributionChart 
                gasData={feedbackData.logs.GAS}
                waterData={feedbackData.logs.WATER}
                electricityData={feedbackData.logs.ELECTRICITY}
              />
              
              <AIFeedback 
                feedback={feedbackData.aiResponse.feedback}
                carbon={feedbackData.aiResponse.carbon}
                temperature={feedbackData.aiResponse.temperature}
              />
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">알림!</strong>
              <span className="block sm:inline"> 기여도 정보가 없습니다. 퀴즈에 참여해보세요!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionPage;