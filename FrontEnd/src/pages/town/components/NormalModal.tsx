import { useState } from 'react';
import { InfraSubmitResponse, InfraEventResponse } from '../features/infraApi';
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
import { useTownStore } from '@/store/useTownStore';
import ResultModal from './ResultModal';
import { easeElastic } from 'd3';

interface NormalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  infraEventId: number;
}

const NormalModal = ({
  open,
  onOpenChange,
  infraEventId,
}: NormalModalProps) => {
  const [showResult, setShowResult] = useState(false);
  // const [result, setResult] = useState(null); // 타입지정... <InfraSubmitResponse> import해서 사용...?
  const [result, setResult] = useState<InfraSubmitResponse | null>(null); // api 응답 받을때 검증한거 아닌가... 왜 또 해야하지

  // useTownStore에서 액션을 가져오는 로직으로 구현한다면
  const { addCarbon, addExp, addCoin, setExpression } = useTownStore();

  // 인프라 이벤트 상세 조회 쿼리
  // const { data: eventData, isLoading, error } = useGetInfraEvent(infraEventId);
  const { data: eventData } = useGetInfraEvent(infraEventId);

  // 인프라 이벤트 선택지 제출 뮤테이션
  const submitInfraResult = useSubmitInfraResult();

  // 선택지 제출 핸들러
  const handleSubmit = (ecoAnswerId: number) => {
    submitInfraResult(ecoAnswerId, {
      onSuccess: (data) => {
        if (data) {
          setResult(data); // data가 있는 경우에만 실행

          // useTownStore 업데이트
          addCarbon(data.carbon);
          addExp(data.exp);
          addCoin(data.coin);
          setExpression(data.expression);

          // 결과 모달 표시
          setShowResult(true);
        }
      },
    });
  };

  // 결과 모달 닫기 핸들러
  const handleResultClose = () => {
    setShowResult(false);
    onOpenChange(false); // 원래 모달도 닫기
  };

  // // 로딩 중이거나 에러 발생 시 처리
  // if (isEventLoading) return <div>로딩 중...</div>;
  // if (eventError) return <div>오류가 발생했습니다.</div>;

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {/* <AlertDialogTrigger></AlertDialogTrigger> */}
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
                <Button
                  key={answer.ecoQuizId}
                  className='flex-1 py-8 text-2xl'
                  onClick={() => handleSubmit(answer.ecoQuizId)}
                >
                  {/* 선지 내용 */}
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
