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
// import { useTownStore } from '@/store/useTownStore';
import ResultModal from './ResultModal';

// import { easeElastic } from 'd3'; // 내가 안했는데

interface NormalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  infraEventId?: number;
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
  // const { addCarbon, addExp, addCoin, setExpression } = useTownStore();
  // -> 스토어 말고 백에서 api 응답 받은 값으로 처리

  // 인프라 이벤트 상세 조회 쿼리
  // const { data: eventData, isLoading, error } = useGetInfraEvent(infraEventId);
  const { data: eventData } = useGetInfraEvent(infraEventId || 0);

  // 인프라 이벤트 선택지 제출 뮤테이션
  const submitInfraResult = useSubmitInfraResult();

  // 선택지 제출 핸들러
  const handleSubmit = (ecoAnswerId: number) => {
    submitInfraResult(ecoAnswerId, {
      onSuccess: (data) => {
        if (data) {
          setResult(data); // data가 있는 경우에만 실행

          // useTownStore 업데이트
          // addCarbon(data.carbon);
          // addExp(data.exp);
          // addCoin(data.coin);
          // setExpression(data.expression);

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
    onOpenChange(false); // 원래 모달도 닫기? 이미 닫혀있는데?
  };

  // // 로딩 중이거나 에러 발생 시 처리
  // if (isEventLoading) return <div>로딩 중...</div>;
  // if (eventError) return <div>오류가 발생했습니다.</div>;

  // fallback 선택지: 문제가 없어도 버튼 뜨게 만들기
  const fallbackAnswers = [
    { ecoQuizId: 1, description: '아직 문제가 준비 중이에요.' },
    { ecoQuizId: 2, description: '잠시 후 다시 시도해 주세요.' },
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
        <AlertDialogContent className='p-10 z-50'>
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
            <div className='flex flex-col w-full gap-4'>
              {answers.map((answer) => (
                <Button
                  key={answer.ecoQuizId}
                  className='flex-1 py-5 text-2xl'
                  onClick={() => handleSubmit(answer.ecoQuizId)}
                >
                  {/* 선지 번호, 내용 */}
                  {answer.ecoQuizId}. {answer.description}
                </Button>
              ))}
            </div>
          </AlertDialogDescription>

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
