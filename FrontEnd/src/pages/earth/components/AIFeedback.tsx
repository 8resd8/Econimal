// src/pages/earth/components/AIFeedback.tsx
import React from 'react';

interface AIFeedbackProps {
  feedback: string;
  carbon: number;
  temperature: number;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ feedback, carbon, temperature }) => {
  // Props 유효성 검사
  const isDataValid = 
    feedback && typeof feedback === 'string' && 
    typeof carbon === 'number' && 
    typeof temperature === 'number';

  // 데이터가 유효하지 않으면 대체 메시지 표시
  if (!isDataValid) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">AI 피드백</h3>
        <div className="p-4 text-center text-gray-600">
          피드백 데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  // 절대값 및 부호 처리
  const carbonAbs = Math.abs(carbon);
  const tempAbs = Math.abs(temperature);
  const isCarbonNegative = carbon < 0;
  const isTempNegative = temperature < 0;

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">AI 피드백</h3>
      
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-line">{feedback}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-700 mb-2">탄소 배출량</h4>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-800">
              {isCarbonNegative ? '-' : '+'}{carbonAbs.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">tons</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {isCarbonNegative 
              ? '당신의 활동으로 인한 탄소 배출 감소량입니다.'
              : '당신의 활동으로 인한 탄소 배출량입니다.'}
          </p>
        </div>
        
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-700 mb-2">온도 영향</h4>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-800">
              {isTempNegative ? '-' : '+'}{tempAbs.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">°C</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {isTempNegative
              ? '당신의 실천이 지구 온도를 낮추는 데 기여하는 영향입니다.'
              : '당신의 활동이 지구 온도에 미치는 영향입니다.'}
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-700 mb-2">환경 영향 분석</h4>
        <p className="text-gray-700">
          위 수치는 당신과 같은 활동을 하는 사람들이 100만 명일 때의 영향을 나타냅니다.
          {isCarbonNegative 
            ? ` 연간 ${carbonAbs.toLocaleString()} 톤의 탄소 배출이 감소하고,` 
            : ` 연간 ${carbonAbs.toLocaleString()} 톤의 탄소가 추가로 배출되고,`}
          
          {isTempNegative
            ? ` 지구 온도 상승을 ${tempAbs.toFixed(2)}°C 억제할 수 있습니다.`
            : ` 지구 온도가 ${tempAbs.toFixed(2)}°C 상승할 수 있습니다.`}
        </p>
        <p className="text-sm italic text-gray-600 mt-2">
          * 이 수치는 대략적인 추정치입니다.
        </p>
      </div>
    </div>
  );
};

export default AIFeedback;