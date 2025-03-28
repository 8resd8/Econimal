// type ChecklistUIProps = {
//   actions: ReturnType<typeof useChecklistActions>;
//   data: ReturnType<typeof useChecklistData>;
//}
import ChecklistPanel from './ChecklistPanel';
import ChecklistTab from './ChecklistTab';
import ProgressBar from './ProgressBar';

const CharChecklistManageUI = ({ actions, data }) => {
  const { onValidateItem, onCompleteItem, onEditItem, onDeleteItem } = actions;
  const { activateTab, setActiveTab, data: items, progress } = data;
  return (
    <div>
      {/* 탭 전환 버튼 */}
      <div className='flex mb-4 space-x-4'>
        <ChecklistTab
          setActiveTab={setActiveTab}
          activeTab={activateTab}
          tabName='daily'
          text={'오늘의 체크리스트'}
        />
        <ChecklistTab
          setActiveTab={setActiveTab}
          tabName='custom'
          activeTab={activateTab}
          text={'나만의 체크리스트'}
        />
      </div>

      {/* 체크리스트 패널 */}
      {activateTab === 'daily' ? (
        <>
          {/* 진척률 막대바 */}
          <div className='mt-4 mb-4'>
            <h3 className='text-center text-lg font-semibold mb-2'>
              오늘 내가 실천할 일
            </h3>
            <ProgressBar progress={progress.dailyProgress} />
            <p className='text-center text-sm mt-2'>
              {progress.dailyProgress}% 완료
            </p>
          </div>
          <ChecklistPanel
            items={items.dailyItems}
            activateTab={activateTab}
            isEditable={false}
            onValidateItem={onValidateItem}
            onCompleteItem={onCompleteItem}
          />
        </>
      ) : (
        <>
          {/* 진척률 막대바 */}
          <div className='mt-4 mb-4'>
            <h3 className='text-center text-lg font-semibold mb-2'>
              오늘 내가 실천할 일
            </h3>
            <ProgressBar progress={progress.customProgress} />
            <p className='text-center text-sm mt-2'>
              {progress.customProgress}% 완료
            </p>
          </div>
          <ChecklistPanel
            items={items.customItems}
            isEditable={true}
            activateTab={activateTab}
            onValidateItem={onValidateItem}
            onCompleteItem={onCompleteItem}
            // onAddItem={onAddItem}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
          />
        </>
      )}
    </div>
  );
};

export default CharChecklistManageUI;
