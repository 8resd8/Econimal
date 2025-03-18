import { useEffect } from 'react';
import { InfraSubmitResponse } from '../features/infraApi';
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
// import { Button } from '@/components/ui/button';
import { Button } from '@/components/ui/button';

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: InfraSubmitResponse;
}

// props가 필요없지 않나
// 사용자가 결과 제출 후
const ResultModal = ({ open, onOpenChange, result }: ResultModalProps) => {
  // 결과 모달이 열릴 때 탄소가 감소했으면 효과 표시
  useEffect(() => {
    if (open && result && result.carbon < 0) {
      // 탄소가 감소했을 때 콘페티?
    }
    // 탄소가 증가했을 때 무언가의 애니메이션
  }, [open, result]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* <AlertDialogTrigger>법원 퀴즈</AlertDialogTrigger> */}
      <AlertDialogContent className='p-10'>
        <AlertDialogCancel className='absolute right-4 top-4 p-2 border-none'>
          X
        </AlertDialogCancel>

        <AlertDialogHeader>
          <AlertDialogTitle className='text-4xl m-6'>
            {result.isOptimal
              ? '최적의 선택이었어요 😗'
              : '더 좋은 선택이 있었어요 😓'}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className='space-y-4'>
          <div className='flex w-full gap-4'>
            {/* 음수인 경우 "감소" 양수인 경우 "중가" */}
            {/* 0인 경우는 어떻게 처리? */}
            <p>
              탄소가{Math.abs(result.carbon)}%{' '}
              {result?.carbon < 0 ? '감소' : '증가'}했어요
            </p>
            {/* 가장좋은 답변이에요 / 더 최적인 답안이 있어요 */}
            <p>{result?.isOptimal}</p>
          </div>
        </AlertDialogDescription>

        <AlertDialogFooter>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          {/* 확인 버튼이 필요할까? 닫기 눌러도 닫히는데*/}
          <Button onClick={() => onOpenChange(false)} className='p-3'>
            확인
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ResultModal;
