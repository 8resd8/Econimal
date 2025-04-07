// src/pages/earth/components/AIFeedback.tsx
import React, { useState, useEffect, useRef } from 'react';

interface AIFeedbackProps {
  feedback: string;
  carbon: number;
  temperature: number;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ feedback, carbon, temperature }) => {
  // 애니메이션을 위한 상태값
  const [animatedCarbon, setAnimatedCarbon] = useState(0);
  const [animatedTemperature, setAnimatedTemperature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  
  // Props 유효성 검사
  const isDataValid = 
    feedback && typeof feedback === 'string' && 
    typeof carbon === 'number' && 
    typeof temperature === 'number';

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // 한 번만 트리거되도록
          }
        });
      },
      { threshold: 0.4 } // 10% 이상 보일 때 트리거
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);
  
  // 탄소 변화량 애니메이션
  useEffect(() => {
    if (!isDataValid || !isVisible) return;
    
    const targetCarbon = carbon;
    const duration = 3000; // 애니메이션 지속 시간 (ms)
    const steps = 60; // 애니메이션 단계 수
    const stepTime = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easedProgress = easeOutCubic(progress); // 애니메이션 감속 효과
      
      setAnimatedCarbon(targetCarbon * easedProgress);
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedCarbon(targetCarbon); // 최종값으로 설정
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [carbon, isDataValid, isVisible]);
  
  // 온도 변화량 애니메이션
  useEffect(() => {
    if (!isDataValid || !isVisible) return;
    
    const targetTemp = temperature;
    const duration = 3000; // 애니메이션 지속 시간 (ms)
    const steps = 60; // 애니메이션 단계 수
    const stepTime = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easedProgress = easeOutCubic(progress); // 애니메이션 감속 효과
      
      setAnimatedTemperature(targetTemp * easedProgress);
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedTemperature(targetTemp); // 최종값으로 설정
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [temperature, isDataValid, isVisible]);
  
  // 애니메이션 감속 효과 함수 (easing function)
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };

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

  // 애니메이션값에 대한 절대값 및 부호 처리
  const carbonAbs = Math.abs(animatedCarbon);
  const tempAbs = Math.abs(animatedTemperature);
  const isCarbonNegative = carbon < 0;
  const isTempNegative = temperature < 0;

  return (
    <div ref={componentRef} className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">AI 피드백</h3>
      
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-line">{feedback}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-700 mb-2">탄소 배출량</h4>
          <div className="flex items-center space-x-2">
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
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-800">
              {isTempNegative ? '-' : '+'}{tempAbs.toLocaleString(undefined, {maximumFractionDigits: 4})}
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
            ? ` 연간 ${Math.abs(carbon).toLocaleString()} 톤의 탄소 배출이 감소하고,` 
            : ` 연간 ${Math.abs(carbon).toLocaleString()} 톤의 탄소가 추가로 배출되고,`}
          
          {isTempNegative
            ? ` 지구 온도 상승을 ${Math.abs(temperature).toFixed(4)}°C 억제할 수 있습니다.`
            : ` 지구 온도가 ${Math.abs(temperature).toFixed(4)}°C 상승할 수 있습니다.`}
        </p>
        <p className="text-sm italic text-gray-600 mt-2">
          * 이 수치는 대략적인 추정치입니다.
        </p>
      </div>
    </div>
  );
};

export default AIFeedback;