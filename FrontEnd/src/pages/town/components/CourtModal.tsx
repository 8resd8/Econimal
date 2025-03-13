import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface CourtModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CourtModal = ({ open, onOpenChange }: CourtModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* <AlertDialogTrigger>법원 퀴즈</AlertDialogTrigger> */}
      <AlertDialogContent className='bg-orange-200 p-40'>
        <AlertDialogHeader>
          <AlertDialogTitle>퀴즈1. 뭐할래</AlertDialogTitle>
          <AlertDialogDescription>
            <Button>1. 집갈래</Button>
            <Button>2. 누울래</Button>
            <Button>3. 휴</Button>
            <Button>4. 야호</Button>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* 컨티뉴 버튼이 필요할까? */}
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default CourtModal;
