import CharChecklistActions from '@/pages/character/feature/checklist/CharChecklistActions';
import CharChecklistData from '@/pages/character/feature/checklist/CharChecklistData';
import CharChecklistManageUI from './CharChecklistManageUI';

//최상위 checklist로 생성
const CharChecklist = () => {
  const data = CharChecklistData();
  const actions = CharChecklistActions();
  return <CharChecklistManageUI data={data} actions={actions} />;
};

export default CharChecklist;
