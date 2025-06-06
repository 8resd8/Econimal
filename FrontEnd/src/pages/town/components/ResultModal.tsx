import { useEffect } from 'react';
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
} from '@/components/ui/alert-dialog';

import { setModalOpen } from '@/components/EventDetector';
import { useLocation } from 'react-router-dom';
import { showInfraResultNotice } from '@/components/toast/toastUtil';
import { useMyCharName } from '@/store/useMyCharStore'; // 사용자 캐릭터 이름 가져오기
import { useErrorStore } from '@/store/errorStore';

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
  // 현재 경로 확인
  const location = useLocation();
  const isTownPage = location.pathname.includes('/town');

  // [여기] 에러 상태 감지
  const isError = useErrorStore((state) => state.isError);

  // 캐릭터 이름 가져오기
  const characterName = useMyCharName() || '캐릭터'; // 이름이 없을 경우 기본값 제공

  // 모달 열림/닫힘 상태 전역 변수에 반영 => 토스트 창이랑 같이 사용안하면 불필요한듯
  useEffect(() => {
    // [여기] 에러 발생 시 모달 닫기
    if (isError && open) {
      onOpenChange(false);
    }
    setModalOpen(open);
    return () => setModalOpen(false);
  }, [open, isError, onOpenChange]);

  // 결과 모달이 열릴 때 탄소가 감소했으면 효과 표시
  useEffect(() => {
    if (open && result) {
      // 마을 페이지인 경우에만 결과 토스트 표시
      if (isTownPage) {
        showInfraResultNotice(result.isOptimal, result.exp, result.coin);
      }

      if (result.carbon < 0) {
        // 탄소가 감소했을 때 긍정적 애니메이션 효과
      } else if (result.carbon > 0) {
        // 부정적 애니메이션 효과
      }
    }
  }, [open, result, isTownPage]);

  // ---------- 법원 제외 인프라 ----------
  /*
  - 최적의 선택이었어요. 탄소가 {carbon} 감소했어요.
    {캐릭터}가 행복해요
    경험치 {exp}, 코인 {coin}을 획득했습니다.

  - 더 좋은 선택이 있었어요. 탄소가 {carbon} 증가했어요.
    {캐릭터}가 슬퍼요

  */
  // 선택 결과 메시지(법원 아닌 경우만)
  const getResultMessage = () => {
    if (result.isOptimal) {
      return '최적의 선택이었어요!';
    } else {
      return '더 좋은 선택이 있었어요';
    }
  };

  // 결과 메시지 색상 클래스 반환
  const getResultMessageColorClass = () => {
    return result.isOptimal ? 'text-green-600' : 'text-yellow-500';
  };

  // 캐릭터 표정 메시지
  const getExpressionMessage = () => {
    if (ecoType !== 'COURT' && result.expression) {
      if (result.expression === 'JOY') {
        return `${characterName}가 행복해요 🥰`;
      } else if (result.expression === 'SADNESS') {
        return `${characterName}가 슬퍼요 😭`;
      } else {
        return ''; // NEUTRAL이거나 다른 표정일 경우 메시지 없음
      }
    }
  };

  // 탄소 변화 메시지(법원 아닌 경우만)
  const getCarbonChangeMessage = () => {
    if (ecoType !== 'COURT') {
      return `탄소가 ${Math.abs(result.carbon)}% ${
        result?.carbon < 0 ? '감소' : '증가'
      }했어요.`;
    }
    return '';
  };

  // 경험치, 코인 획득 메시지
  const getRewardMessage = () => {
    if (
      (ecoType === 'COURT' && result.isOptimal) ||
      (ecoType !== 'COURT' && result.isOptimal)
    ) {
      return `✨경험치 ${result.exp}, 🪙코인 ${result.coin}을 획득했습니다.`;
    }
    return '';
  };

  // ---------- 법원 ----------
  /*
  - 정답 입니다! 경험치 {exp} / 코인 {coin}을 획득하였습니다. 
  - 오답 입니다. 정답은 {result.description}입니다.
  */
  const getAnswerMessage = () => {
    // 오답일 경우만 정답 메시지 출력
    if (ecoType === 'COURT' && !result.isOptimal && result.description) {
      return `정답은 "${result.description}"입니다.`;
    } else {
      return '';
    }
  };

  return (
    <AlertDialog open={open && !isError} onOpenChange={onOpenChange}>
      {/* <AlertDialogTrigger>법원 퀴즈</AlertDialogTrigger> */}
      <AlertDialogContent className='p-4 sm:p-6 md:p-8 max-w-[95vw] md:max-w-[80vw] lg:max-w-[60vw] max-h-[90vh] overflow-y-auto rounded-lg'>
        <AlertDialogCancel className='absolute right-4 top-4 p-2 border-none'>
          <X />
        </AlertDialogCancel>

        <AlertDialogHeader>
          <AlertDialogTitle
            className={`text-2xl text-center sm:text-3xl md:text-4xl mx-2 sm:m-4 md:m-6 break-keep ${getResultMessageColorClass()}`}
          >
            {getResultMessage()}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className='space-y-4 text-center'>
          {/* 캐릭터 표정 메시지 (법원 제외) */}
          {getExpressionMessage() && (
            <p className='text-xl sm:text-2xl md:text-3xl break-keep whitespace-normal'>
              {getExpressionMessage()}
            </p>
          )}
          {/* 탄소 변화 메시지 (법원 제외) */}
          {getCarbonChangeMessage() && (
            <p className='text-xl sm:text-xl md:text-2xl break-keep whitespace-normal'>
              {getCarbonChangeMessage()}
            </p>
          )}

          {/* 정답 메시지 (법원 오답) */}
          {getAnswerMessage() && (
            <p className='text-xl sm:text-xl md:text-2xl break-keep whitespace-normal font-medium'>
              {getAnswerMessage()}
            </p>
          )}

          {/* 경험치/코인 획득 메시지 */}
          {getRewardMessage() && (
            <p className='text-xl sm:text-xl md:text-2xl break-keep whitespace-normal font-medium mt-4'>
              {getRewardMessage()}
            </p>
          )}
        </AlertDialogDescription>

        <AlertDialogFooter>{/* shadcn 버튼 있던 자리 */}</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ResultModal;
