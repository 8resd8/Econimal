import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDoneChecklist } from '../api/fetchDoneChecklist';

//checklist에 id값 전달을 위해 선언
export const usePostChecklist = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (checklistId: number) => {
      console.log(`서버에 나의 checklist 완료 활동 전송 : ${checklistId}`);
      return fetchDoneChecklist(checklistId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
      console.log('서버에 완료 내용 전송');
    },
    onError: (error) => {
      console.log('id값을 서버에 전달하는 과정에서 문제가 발생했습니다', error);
    },
  });

  //mutate에 값 전달
  const handleChecklistToServer = (checklistId: number) => {
    mutate(checklistId); //호출
  };

  return {
    handleChecklistToServer,
  };
};
