// import { useAddCusChecklist } from '../hooks/checklist/useAddCusChecklist';
// import { useChecklist } from '../hooks/checklist/useChecklist';
import { useCustomValidation } from '../hooks/checklist/useCustomValidation';
import { useDeleteCusChecklist } from '../hooks/checklist/useDeleteCusChecklist';
import { useEditCusChecklist } from '../hooks/checklist/useEditCusChecklist';
import { usePostChecklist } from '../hooks/checklist/usePostChecklist';

//기능 로직
const CharChecklistActions = () => {
  // const { data, isLoading, isError, error } = useChecklist();
  const { handleValidationCustomChecklist } = useCustomValidation();
  // const { handleSubmitCustomChecklist } = useAddCusChecklist();
  const { handleChecklistToServer } = usePostChecklist();
  const { handleEditCustomChecklist } = useEditCusChecklist();
  const { handleDeleteCustomChecklist } = useDeleteCusChecklist();

  // 체크리스트 항목 유효성 검증 함수
  const onValidateItem = async (description: string) => {
    try {
      const result = await handleValidationCustomChecklist(description);
      return result; // 유효성 검증에 성공한 데이터 반환
      //체크리스트 Panel에서 활용할 데이터
    } catch (error) {
      throw error;
    }
  };

  // 체크리스트 항목 완료 처리 함수
  const onCompleteItem = async (checklistId: string, type: string) => {
    handleChecklistToServer(checklistId, type);
  };

  // 체크리스트 항목 수정 함수
  const onEditItem = async (id: string, description: string) => {
    handleEditCustomChecklist(id, description);
  };

  // 체크리스트 항목 삭제 함수
  const onDeleteItem = async (id: string) => {
    handleDeleteCustomChecklist(id);
  };

  return {
    onValidateItem,
    onCompleteItem,
    onEditItem,
    onDeleteItem,
  };
};

export default CharChecklistActions;
