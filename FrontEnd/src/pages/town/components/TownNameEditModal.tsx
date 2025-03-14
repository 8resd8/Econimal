import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogClose,
  // DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { X } from 'lucide-react';

interface TownNameEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTownName: string;
}

export const TownNameEditModal = ({
  open,
  onOpenChange,
  currentTownName,
}: TownNameEditModalProps) => {
  const [townName, setTownName] = useState(currentTownName); // currentTownName이 townName의 초기값
  // const [isLoading, setIsLoading] = useState(false)

  // 모달이 열릴 때 마다 현재 마을 이름을 상태에 반영
  useEffect(() => {
    if (open) {
      // 사용자가 모달 누르면 open이 true로 변경
      setTownName(currentTownName);
    }
  }, [open, currentTownName]);

  // 변경된 마을 이름 저장(제출) 함수
  // const handleSave = async() => {
  //   try {
  //     setIsLoading(true)
  //     await
  //   }
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button variant='outline'>Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>마을 이름을 수정해주세요</DialogTitle>
          <DialogDescription>{/* 세부 설명*/}</DialogDescription>
          {/* <DialogClose>
            <X />
          </DialogClose> */}
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              마을 이름
            </Label>
            <Input
              id='name'
              value={townName}
              // 사용자가 키보드를 누를 때마다 onChange가 실행
              // 입력한 값이 townName 상태로 업데이트되고,
              // 이 값이 다시 value={townName}으로 적용돼서 실시간으로 입력 필드에 반영
              onChange={(e) => setTownName(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={() => onOpenChange(false)}>
            저장
          </Button>
          {/* 저장 버튼 클릭 시 api 요청 후 모달 닫히기 */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
