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

interface NormalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NormalModal = ({ open, onOpenChange }: NormalModalProps) => {
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
