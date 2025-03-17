import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  useGetInfraEvent,
  useSubmitInfraResult,
} from '../features/useInfraQuery';

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
          setShowResult(true);
        }
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* <AlertDialogTrigger>법원 퀴즈</AlertDialogTrigger> */}
      <AlertDialogContent className='p-10'>
        <AlertDialogCancel className='absolute right-4 top-4 p-2 border-none'>
          X
        </AlertDialogCancel>

        <AlertDialogHeader>
          <AlertDialogTitle className='text-4xl m-6'>
            당신이 학교에 갈 때 이용할 교통수단은?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className='space-y-4'>
          <div className='flex w-full gap-4'>
            <Button className='flex-1 py-8 text-2xl'>선택1</Button>
            <Button className='flex-1 py-8 text-2xl'>선택2</Button>
          </div>
        </AlertDialogDescription>

        <AlertDialogFooter>
          {/* 컨티뉴 버튼이 필요할까? */}
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default NormalModal;
