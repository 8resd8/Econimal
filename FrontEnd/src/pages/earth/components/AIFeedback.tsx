// src/components/AIFeedback.tsx
import React, { useState, useEffect } from 'react';

interface AIFeedbackProps {
  feedback: string;
  carbon: number;
  temperature: number;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ feedback, carbon, temperature }) => {
  // 애니메이션을 위한 상태값
  const [animatedCarbon, setAnimatedCarbon] = useState(0);
  const [animatedTemperature, setAnimatedTemperature] = useState(0);
  
  // 데이터 유효성 검사 - 단순화
  const isDataValid = 
    typeof feedback === 'string' && 
    typeof carbon === 'number' && 
    typeof temperature === 'number';

  // 컴포넌트 마운트 시 애니메이션 시작
  useEffect(() => {
    if (!isDataValid) return;
    
    // 애니메이션 시작을 위한 타이머
    const startAnimationTimer = setTimeout(() => {
      animateValues();
    }, 500); // 0.5초 후 애니메이션 시작
    
    return () => clearTimeout(startAnimationTimer);
  }, [carbon, temperature, isDataValid]);
  
  // 값 애니메이션 함수
  const animateValues = () => {
    const duration = 1500; // 애니메이션 시간 (ms)
    const steps = 30;
    const interval = duration / steps;
    let step = 0;
    
    const animationTimer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setAnimatedCarbon(carbon * easedProgress);
      setAnimatedTemperature(temperature * easedProgress);
      
      if (step >= steps) {
        clearInterval(animationTimer);
        setAnimatedCarbon(carbon);
        setAnimatedTemperature(temperature);
      }
    }, interval);
  };

  // 작은 수치를 과학적 표기법으로 변환하는 함수 (위첨자 사용)
  const formatScientific = (value: number): JSX.Element | string => {
    const absValue = Math.abs(value);
    
    // 일반적인 숫자 형식이 더 적절한 경우 (0.001보다 큰 값)
    if (absValue >= 0.001 || absValue === 0) {
      return absValue.toLocaleString(undefined, {maximumFractionDigits: 4});
    }
    
    // 과학적 표기법으로 변환
    const exponent = Math.floor(Math.log10(absValue));
    const mantissa = absValue / Math.pow(10, exponent);
    
    // JSX 엘리먼트로 반환하여 위첨자 사용
    return (
      <span>
        {mantissa.toFixed(1)}×10<sup>{exponent}</sup>
      </span>
    );
  };

  // 데이터가 유효하지 않으면 대체 메시지 표시
  if (!isDataValid) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">AI 피드백</h3>
        <div className="p-4 text-center text-gray-600">
          피드백 정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  // 애니메이션값에 대한 절대값 및 부호 처리
  const carbonAbs = Math.abs(animatedCarbon);
  const tempAbs = Math.abs(animatedTemperature);
  const isCarbonNegative = carbon < 0;
  const isTempNegative = temperature < 0;

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">AI 피드백</h3>
      
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-line">{feedback || "환경 보호에 참여해주셔서 감사합니다."}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-700 mb-2">탄소 배출량</h4>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-green-800">
              {isCarbonNegative ? '-' : '+'}{carbonAbs.toLocaleString(undefined, {maximumFractionDigits: 2})}
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
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-orange-800">
              {isTempNegative ? '-' : '+'}
              {typeof formatScientific(tempAbs) === 'string' 
                ? formatScientific(tempAbs)
                : formatScientific(tempAbs)}
            </span>
            <span className="text-sm text-gray-600">°C</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {isTempNegative
              ? '당신의 실천이 지구 온도를 낮추는 데 기여하는 영향입니다. 지구 온도는 0.01도만 낮아져도 아주 큰 영향이에요.'
              : '당신의 활동이 지구 온도에 미치는 영향입니다.'}
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-700 mb-2">환경 영향 분석</h4>
        <p className="text-gray-700">
          위 수치는 당신과 같은 활동을 하는 사람들이 100만 명일 때의 영향을 나타냅니다.
          {isCarbonNegative 
            ? ` 연간 ${Math.abs(carbon).toLocaleString()} 톤의 탄소 배출이 감소하고,` 
            : ` 연간 ${Math.abs(carbon).toLocaleString()} 톤의 탄소가 추가로 배출되고,`}
          
          {isTempNegative
            ? <span> 지구 온도 상승을 <span className="inline-flex items-baseline">{formatScientific(Math.abs(temperature))}</span>°C 억제할 수 있습니다.</span>
            : <span> 지구 온도가 <span className="inline-flex items-baseline">{formatScientific(Math.abs(temperature))}</span>°C 상승할 수 있습니다.</span>}
        </p>
        <p className="text-sm italic text-gray-600 mt-2">
          * 이 수치는 대략적인 추정치입니다.
        </p>
      </div>
    </div>
  );
};

export default AIFeedback;