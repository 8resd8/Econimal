import CharChecklistActions from '@/pages/character/feature/checklist/CharChecklistActions';
import CharChecklistData from '@/pages/character/feature/checklist/CharChecklistData';
import CharChecklistManageUI from './CharChecklistManageUI';

//최상위 checklist로 생성
const CharChecklist = () => {
  const data = CharChecklistData();
  const actions = CharChecklistActions();

  if (!!data && !!actions) {
    return <div>데이터가 없습니다.</div>;
  }

  console.log(data, actions, 'data와 actions 내용 검증');

  return <CharChecklistManageUI data={data} actions={actions} />;
};

export default CharChecklist;
