import { useAddCusChecklist } from '../hooks/checklist/useAddCusChecklist';
import { useChecklist } from '../hooks/checklist/useChecklist';
import { useCustomValidation } from '../hooks/checklist/useCustomValidation';
import { useDeleteCusChecklist } from '../hooks/checklist/useDeleteCusChecklist';
import { useEditCusChecklist } from '../hooks/checklist/useEditCusChecklist';
import { usePostChecklist } from '../hooks/checklist/usePostChecklist';

const CharChecklistFeat = () => {
  const { data, isLoading, isError, error } = useChecklist();
  const { handleValidationCustomChecklist } = useCustomValidation();
  const { handleSubmitCustomChecklist } = useAddCusChecklist();
  const { handleChecklistToServer } = usePostChecklist();
  const { handleEditCustomChecklist } = useEditCusChecklist();
  const { handleDeleteCustomChecklist } = useDeleteCusChecklist();
};

export default CharChecklistFeat;
