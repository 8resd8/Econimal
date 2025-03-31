import { useState, useEffect } from 'react';
import { InfraSubmitResponse, InfraEventResponse } from '../features/infraApi';
import ResultModal from './ResultModal';
import { setModalOpen } from '@/components/EventDetector';
import { X } from 'lucide-react';

import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  useGetInfraEvent,
  useSubmitInfraResult,
} from '../features/useInfraQuery';

interface NormalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  infraEventId?: number;
  ecoType: string;
}

const NormalModal = ({
  open,
  onOpenChange,
  infraEventId,
  ecoType,
}: NormalModalProps) => {
  const [showResult, setShowResult] = useState(false);
  // const [result, setResult] = useState(null); // 타입지정... <InfraSubmitResponse> import해서 사용...?
  const [result, setResult] = useState<InfraSubmitResponse | null>(null); // api 응답 받을때 검증한거 아닌가... 왜 또 해야하지

  // 인프라 이벤트 상세 조회 쿼리
  // const { data: eventData, isLoading, error } = useGetInfraEvent(infraEventId);
  const { data: eventData } = useGetInfraEvent(infraEventId || 0);

  // 인프라 이벤트 선택지 제출 뮤테이션
  const submitInfraResult = useSubmitInfraResult();

  // 모달 열림/닫힘 상태 전역 변수에 반영
  useEffect(() => {
    setModalOpen(open);
    return () => setModalOpen(false);
  }, [open]);

  // 선택지 제출 핸들러
  const handleSubmit = (ecoAnswerId: number) => {
    submitInfraResult(ecoAnswerId, ecoType, {
      onSuccess: (data) => {
        if (data) {
          setResult(data); // data가 있는 경우에만 실행

          // useTownStore 업데이트
          // addCarbon(data.carbon);
          // addExp(data.exp);
          // addCoin(data.coin);
          // setExpression(data.expression);
          // 모달 닫히면 /towns/events 응답와서 그쪽 로직에서 처리되는듯?

          // 선택지 모달 닫고 결과 모달 표시
          onOpenChange(false);
          setShowResult(true);
        }
      },
    });
  };

  // 결과 모달 닫기 핸들러
  const handleResultClose = () => {
    setShowResult(false);
    setModalOpen(false);
  };

  // // 로딩 중이거나 에러 발생 시 처리
  // if (isEventLoading) return <div>로딩 중...</div>;
  // if (eventError) return <div>오류가 발생했습니다.</div>;

  // fallback 선택지: 문제가 없어도 버튼 뜨게 만들기
  const fallbackAnswers = [
    { ecoAnswerId: 1, description: '아직 문제가 준비 중이에요.' },
    { ecoAnswerId: 2, description: '잠시 후 다시 시도해 주세요.' },
  ];

  // 실제 선택지 데이터가 없을 경우 fallback 사용
  const answers =
    eventData?.ecoAnswer && eventData.ecoAnswer.length > 0
      ? eventData.ecoAnswer
      : fallbackAnswers;

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {/* <AlertDialogTrigger></AlertDialogTrigger> */}
        <AlertDialogContent className='p-4 sm:p-6 md:p-8 z-50 max-w-[95vw] md:max-w-[80vw] lg:max-w-[60vw] max-h-[90vh] overflow-y-auto rounded-lg'>
          <AlertDialogCancel className='absolute right-4 top-4 p-2 border-none'>
            <X />
          </AlertDialogCancel>

          <AlertDialogHeader>
            <AlertDialogTitle className='text-xl sm:text-2xl md:text-4xl mx-2 sm:m-4 md:m-6 break-keep text-center'>
              {eventData?.ecoQuiz?.quizDescription ||
                '문제가 도착하지 않았어요😢'}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className='space-y-4'>
            <div className='flex flex-col w-full gap-4'>
              {answers.map((answer) => (
                <Button
                  key={answer.ecoAnswerId}
                  className='flex-1 py-4 sm:py-4 md:py-6 text-base sm:text-lg md:text-2xl whitespace-normal break-words hyphens-auto'
                  onClick={() => handleSubmit(answer.ecoAnswerId)}
                >
                  {answer.description}
                </Button>
              ))}
            </div>
          </div>

          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 결과 모달 표시 */}
      {result && (
        <ResultModal
          open={showResult}
          onOpenChange={handleResultClose}
          result={result}
        />
      )}
    </>
  );
};
export default NormalModal;
