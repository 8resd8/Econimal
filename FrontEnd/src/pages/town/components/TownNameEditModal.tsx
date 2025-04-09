import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePatchTownName } from '../features/useTownQuery';

interface TownNameEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTownName: string;
  townId?: number;
}

export const TownNameEditModal = ({
  open,
  onOpenChange,
  currentTownName,
}: TownNameEditModalProps) => {
  const [townName, setTownName] = useState(currentTownName);

  // 입력 유효성 상태 추가
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const MAX_LENGTH = 30; // 최대 길이 상수로 정의

  const patchTownName = usePatchTownName();

  // 모달이 열릴 때마다 현재 마을 이름을 상태에 반영하고 유효성 검사 수행
  useEffect(() => {
    if (open) {
      // 이름 설정
      setTownName(currentTownName);

      // 유효성 검사 수행
      if (currentTownName.length > MAX_LENGTH) {
        setIsValid(false);
        setErrorMessage(`마을 이름은 최대 ${MAX_LENGTH}자까지만 가능합니다.`);
      } else {
        setIsValid(true);
        setErrorMessage('');
      }
    }
  }, [open, currentTownName]);

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 30자를 초과하는 입력 처리
    if (value.length > MAX_LENGTH) {
      // 30자로 잘라내고 오류 메시지 표시
      setTownName(value.slice(0, MAX_LENGTH));
      setIsValid(false);
      setErrorMessage(`마을 이름은 최대 ${MAX_LENGTH}자까지만 가능합니다.`);
    } else {
      // 유효한 입력 처리
      setTownName(value);
      setIsValid(true);
      setErrorMessage('');
    }
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    // 한 번 더 유효성 검사
    if (townName.length > MAX_LENGTH) {
      setIsValid(false);
      setErrorMessage(`마을 이름은 최대 ${MAX_LENGTH}자까지만 가능합니다.`);
      return;
    }

    // 빈 이름 처리
    if (townName.trim() === '') {
      setIsValid(false);
      setErrorMessage('마을 이름을 입력해주세요.');
      return;
    }

    try {
      // API 호출
      await patchTownName({ townName });
      // 성공 시 모달 닫기
      onOpenChange(false);
    } catch (error) {
      console.log('마을 이름 변경 중 오류:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>마을 이름을 수정해주세요</DialogTitle>
          <DialogDescription>{/* 세부 설명*/}</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              마을 이름
            </Label>
            <Input
              id='name'
              value={townName}
              onChange={handleInputChange}
              className={`col-span-3 ${!isValid ? 'border-red-500' : ''}`}
              autoComplete='off'
              maxLength={MAX_LENGTH}
            />
          </div>
          <span
            className={`text-sm ${isValid ? 'text-gray-500' : 'text-red-500'}`}
          >
            * 마을 이름은 최대 {MAX_LENGTH}자까지 가능합니다.
          </span>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            onClick={handleSave}
            disabled={!isValid || townName.trim() === ''}
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
