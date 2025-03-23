import { useState } from 'react';
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
import ResultModal from './ResultModal';
import { InfraSubmitResponse } from '../features/infraApi';
import { useTownStore } from '@/store/useTownStore';

interface CourtModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  infraEventId?: number;
}

const CourtModal = ({ open, onOpenChange, infraEventId }: CourtModalProps) => {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<InfraSubmitResponse | null>(null);

  // 인프라 이벤트 상세 조회 쿼리
  // Loading을 써 말아
  const { data: eventData } = useGetInfraEvent(infraEventId || 0);

  // 인프라 이벤트 선택지 제출 뮤테이션
  const submitInfraResult = useSubmitInfraResult();

  // 선택지 제출 핸들러
  const handleSubmit = (ecoAnswerId: number) => {
    submitInfraResult(ecoAnswerId, {
      onSuccess: (data) => {
        if (data) {
          // API 응답 데이터를 상태에 저장해? 말아?
          // setResult(data);

          // useTownStore 업데이트?
          // 퀴즈 결과가 스토어에 있던가
          // 현재 모달 닫히면서
          // 약간의 애니메이션 효과를 줄까?
          // 결과 모달 표시
          setShowResult(true);
        }
      },
    });
  };

  // 결과 모달 닫기 핸들러
  const handleResultClose = () => {
    setShowResult(false);
    onOpenChange(false);
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {/* <AlertDialogTrigger>법원 퀴즈</AlertDialogTrigger> */}
        <AlertDialogContent className='p-10'>
          <AlertDialogCancel className='absolute right-4 top-4 p-2 border-none'>
            X
          </AlertDialogCancel>

          <AlertDialogHeader>
            <AlertDialogTitle className='text-4xl m-6'>
              {eventData?.ecoQuiz?.quizDescription ||
                '문제가 도착하지 않았어요😢'}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className='space-y-4'>
            <div className='flex w-full gap-4'>
              {eventData?.ecoAnswer?.map((answer) => (
                <Button key={answer.ecoQuizId} className='flex-1 py-8 text-2xl'>
                  {/* 결과 모달에서 몇번이 정답인지 알려주려면 
                  선택 모달에서 선택지 내용뿐만이 아니라 번호도 알려줘야함 */}
                  {answer.ecoQuizId}
                  {answer.description}
                </Button>
              ))}
            </div>
          </AlertDialogDescription>

          <AlertDialogFooter>
            {/* 컨티뉴 버튼이 필요할까? */}
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
        />
      )}
    </>
  );
};

export default CourtModal;
