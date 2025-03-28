import { useEffect } from 'react';
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

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    carbon: number;
    exp: number;
    coin: number;
    expression: string;
    isOptimal: boolean;
    description: string;
  };
  ecoType?: string;
}

// 사용자가 결과 제출 후
const ResultModal = ({
  open,
  onOpenChange,
  result,
  ecoType,
}: ResultModalProps) => {
  // 결과 모달이 열릴 때 탄소가 감소했으면 효과 표시
  useEffect(() => {
    if (open && result && result.carbon < 0) {
      // 탄소가 감소했을 때 콘페티? 긍정적 애니메이션 효과
    } else if (open && result && result.carbon > 0) {
      // 부정적 애니메이션 효과
    }
    // 0일땐 아무것도 안할래
  }, [open, result]);

  // 법원 아닌경우만 표시하고 싶은데
  const getResultMessage = () => {
    if (result.isOptimal) {
      return '최적의 선택이었어요 😊';
    } else {
      return '더 좋은 선택이 있었어요 😓';
    }
  };

  const getAnswerMessage = () => {
    // 오답일 경우만 정답 메시지 출력
    if (ecoType === 'COURT' && result.isOptimal === false) {
      if (result.description) {
        return `정답은 "${result.description}"입니다.`;
      } else {
        return `정답을 확인할 수 없습니다`;
      }
    }
    return '';
  };

  // 탄소 변화 메시지 (법원이 아닌 경우만)
  const getCarbonChangeMessage = () => {
    if (ecoType !== 'COURT') {
      return `탄소가 ${Math.abs(result.carbon)}% ${
        result?.carbon < 0 ? '감소' : '증가'
      }했어요`;
    }
    return '';
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* <AlertDialogTrigger>법원 퀴즈</AlertDialogTrigger> */}
      <AlertDialogContent className='p-4 sm:p-6 md:p-8 max-w-[95vw] md:max-w-[80vw] lg:max-w-[60vw] max-h-[90vh] overflow-y-auto'>
        <AlertDialogCancel className='absolute right-4 top-4 p-2 border-none'>
          X
        </AlertDialogCancel>

        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl text-center sm:text-2xl md:text-4xl mx-2 sm:m-4 md:m-6 break-keep'>
            {/* 가장 좋은 답변이에요 / 더 최적인 답안이 있어요 */}
            {getResultMessage()}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className='space-y-4'>
          <div className='flex flex-col items-center w-full gap-4'>
            {/* 장소에 따라 다른 메시지 표시 */}
            {ecoType === 'COURT' ? (
              <p className='text-base sm:text-xl md:text-3xl text-center break-keep whitespace-normal'>
                {getAnswerMessage()}
              </p>
            ) : (
              <p className='text-base sm:text-xl md:text-3xl text-center break-keep whitespace-normal'>
                {getCarbonChangeMessage()}
              </p>
            )}
          </div>
        </AlertDialogDescription>

        <AlertDialogFooter>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          {/* 확인 버튼이 필요할까? 닫기 눌러도 닫히는데*/}
          {/* <Button onClick={() => onOpenChange(false)} className='p-3'>
            확인
          </Button> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ResultModal;
