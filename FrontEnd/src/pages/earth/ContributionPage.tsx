// src/pages/ContributionPage.tsx
import React, { useState, useEffect } from 'react';
import { fetchFeedbackData, FeedbackData } from './features/FeedbackApi';
import bgImage from "@/assets/auth_background.png";
import GoMainBtn from '@/components/GoMainBtn';
import { useErrorStore } from '@/store/errorStore';
import loadingGif from "@/assets/loading.gif";

// 컴포넌트 임포트
import AIFeedback from './components/AIFeedback';
import ContributionChart from './components/ContributionChart';

const ContributionPage: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hideError = useErrorStore(state => state.hideError);

  useEffect(() => {
    hideError();
    
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchFeedbackData();
        setFeedbackData(data);
        setError(null);
      } catch (err) {
        console.error('데이터 로딩 오류:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [hideError]);

  // 데이터가 유효한지 확인하는 함수
  const hasQuizData = (data: FeedbackData | null): boolean => {
    if (!data) return false;
    
    return Object.values(data.logs).some(item => item.total > 0);
  };

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
            <div className="flex flex-col justify-center items-center gap-3 bg-white p-8 rounded-lg shadow-md">
              <img src={loadingGif} alt="로딩 중..." className="h-45 w-65" />
              <h3>AI가 나의 환경 기여도를 조회하고 있어요</h3>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">오류!</strong>
              <span className="block sm:inline"> {error}</span>
              <button 
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchFeedbackData()
                    .then(data => {
                      setFeedbackData(data);
                      setLoading(false);
                    })
                    .catch(() => {
                      setError('데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
                      setLoading(false);
                    });
                }}
              >
                다시 시도
              </button>
            </div>
          ) : feedbackData ? (
            <div className="space-y-8">
              <ContributionChart 
                gasData={feedbackData.logs.GAS}
                waterData={feedbackData.logs.WATER}
                electricityData={feedbackData.logs.ELECTRICITY}
                courtData={feedbackData.logs.COURT}
                hasParticipated={hasQuizData(feedbackData)}
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
              <span className="block sm:inline"> 데이터를 불러올 수 없습니다.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionPage;