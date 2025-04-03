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

  // 인프라 이벤트 상세 조회 쿼리
  // isLoading 사용할 경우 LoadingScreen
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
    { ecoAnswerId: 1, description: '아직 문제가 준비 중이에요.' },
    { ecoAnswerId: 2, description: '잠시 후 다시 시도해 주세요1' },
    { ecoAnswerId: 3, description: '잠시 후 다시 시도해 주세요2' },
    { ecoAnswerId: 4, description: '잠시 후 다시 시도해 주세요3' },
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
                  className='flex-1 basis-[calc(50%-0.5rem)] py-4 sm:py-4 md:py-8 text-base sm:text-lg md:text-2xl whitespace-normal break-words hyphens-auto'
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
          open={showResult}
          onOpenChange={handleResultClose}
          result={result}
          ecoType='COURT' // 에코 타입 전달
        />
      )}
    </>
  );
};

export default CourtModal;
