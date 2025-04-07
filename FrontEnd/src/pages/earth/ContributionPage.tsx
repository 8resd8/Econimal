// src/pages/ContributionPage.tsx
import React, { useState, useEffect } from 'react';
import { fetchFeedbackData, FeedbackData } from './features/FeedbackApi';
import bgImage from "@/assets/auth_background.png";
import GoMainBtn from '@/components/GoMainBtn';
import { useErrorStore } from '@/store/errorStore';
import loadingGif from "@/assets/loading.gif";

// 애니메이션이 적용된 AIFeedback 컴포넌트를 earth/components 경로에서 가져옵니다
import AIFeedback from './components/AIFeedback';
// ContributionChart 컴포넌트도 같은 경로에서 가져옵니다
import ContributionChart from './components/ContributionChart';

const ContributionPage: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hideError = useErrorStore(state => state.hideError);

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
            <div className="flex justify-center items-center h-100">
              <img src={loadingGif} alt="로딩 중..." className="h-60 w-80" />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">오류!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : feedbackData ? (
            <div className="space-y-8">
              {/* ContributionChart에 필요한 데이터 전달 */}
              <ContributionChart 
                gasData={feedbackData.logs.GAS}
                waterData={feedbackData.logs.WATER}
                electricityData={feedbackData.logs.ELECTRICITY}
              />
              
              {/* AIFeedback에는 필요한 props만 전달 */}
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