import { useState, useEffect } from 'react';
import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  // AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  useGetInfraEvent,
  useSubmitInfraResult,
} from '../features/useInfraQuery';
import ResultModal from './ResultModal';
import { InfraSubmitResponse } from '../features/infraApi';
import { X } from 'lucide-react';
import { setModalOpen } from '@/components/EventDetector';
import { useErrorStore } from '@/store/errorStore';

interface CourtModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  infraEventId?: number;
}

interface ExtendedInfraSubmitResponse extends InfraSubmitResponse {
  selectedAnswerId: number; // 사용자가 선택한 답안 ID -> 제거해도 될듯?
}

const CourtModal = ({ open, onOpenChange, infraEventId }: CourtModalProps) => {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ExtendedInfraSubmitResponse | null>(
    null,
  );

  // 에러 상태 감지
  const isError = useErrorStore((state) => state.isError);

  // 인프라 이벤트 상세 조회 쿼리
  // isLoading 사용할 경우 LoadingScreen
  const { data: eventData } = useGetInfraEvent(infraEventId || 0);

  // 인프라 이벤트 선택지 제출 뮤테이션
  const submitInfraResult = useSubmitInfraResult();

  // 모달 열림/닫힘 상태 전역 변수에 반영
  useEffect(() => {
    // [여기] 에러 발생 시 모달 닫기
    if (isError) {
      onOpenChange(false);
      setShowResult(false);
    }
    setModalOpen(open);
    return () => setModalOpen(false);
  }, [open, isError, onOpenChange]);

  // 선택지 제출 핸들러
  const handleSubmit = (ecoAnswerId: number) => {
    submitInfraResult(ecoAnswerId, 'COURT', {
      onSuccess: (data) => {
        if (data) {
          // 사용자가 선택한 ID만 추가
          const resultWithSelection: ExtendedInfraSubmitResponse = {
            ...data,
            selectedAnswerId: ecoAnswerId,
          };

          setResult(resultWithSelection);
          onOpenChange(false); // 현재 모달 닫히면서
          // 약간의 애니메이션 효과를 줄까?
          setShowResult(true); // 결과 모달 표시
        }
      },
    });
  };

  // 결과 모달 닫기 핸들러
  const handleResultClose = () => {
    setShowResult(false);
    setModalOpen(false);
  };

  const fallbackAnswers = [
    { ecoAnswerId: 1, description: '법원에 새로운 사건이 \n 접수되었어요!' },
    { ecoAnswerId: 2, description: '새로운 환경 퀴즈를 \n 준비 중이에요.' },
    { ecoAnswerId: 3, description: '문제 업데이트 중 ...' },
    { ecoAnswerId: 4, description: '잠시 후 다시 시도해 주세요.' },
  ];

  const answers =
    eventData?.ecoAnswer && eventData.ecoAnswer.length > 0
      ? eventData.ecoAnswer
      : fallbackAnswers;

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {/* <AlertDialogTrigger>법원 퀴즈</AlertDialogTrigger> */}
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
          <div className='space-y-2 sm:space-y-3 md:space-y-4'>
            <div className='flex flex-wrap gap-4'>
              {answers.map((answer) => (
                <Button
                  key={answer.ecoAnswerId}
                  className='flex-1 basis-[calc(50%-0.5rem)] py-4 sm:py-4 md:py-10 text-base sm:text-lg md:text-2xl whitespace-pre-line break-words hyphens-auto'
                  onClick={() => handleSubmit(answer.ecoAnswerId)}
                >
                  {answer.description}
                </Button>
              ))}
            </div>
          </div>

          <AlertDialogFooter>
            {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 결과 모달 */}
      {result && (
        <ResultModal
          open={showResult && !isError}
          onOpenChange={handleResultClose}
          result={result}
          ecoType='COURT'
        />
      )}
    </>
  );
};

export default CourtModal;
