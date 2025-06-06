import { useEffect, useMemo, useState } from 'react';
import ChecklistPanel from './ChecklistPanel';
import ProgressBar from './ProgressBar';
import { useChecklist } from '@/pages/character/feature/hooks/checklist/useChecklist';
import { usePostChecklist } from '@/pages/character/feature/hooks/checklist/usePostChecklist';
import ChecklistTab from './ChecklistTab';
import { useCustomValidation } from '@/pages/character/feature/hooks/checklist/useCustomValidation';
import { useAddCusChecklist } from '@/pages/character/feature/hooks/checklist/useAddCusChecklist';
import { useEditCusChecklist } from '@/pages/character/feature/hooks/checklist/useEditCusChecklist';
import { useDeleteCusChecklist } from '@/pages/character/feature/hooks/checklist/useDeleteCusChecklist';
import { useCheckProgressData } from '@/pages/character/feature/hooks/reuse/useCheckProgressData';

// CharChecklist 컴포넌트 - 체크리스트 관리 최상위 컴포넌트
const CharChecklist = () => {
  const { data, isLoading, isError, error } = useChecklist();
  const { dailyProgress, customProgress } = useCheckProgressData(data);
  const { handleValidationCustomChecklist } = useCustomValidation();
  const { handleSubmitCustomChecklist } = useAddCusChecklist();
  const { handleChecklistToServer } = usePostChecklist();
  const { handleEditCustomChecklist } = useEditCusChecklist();
  const { handleDeleteCustomChecklist } = useDeleteCusChecklist();

  const [activeTab, setActiveTab] = useState('daily'); // 'daily' 또는 'custom'

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>오류 발생: {error.message}</div>;
  }

  if (
    dailyProgress == null &&
    dailyProgress == undefined &&
    customProgress == null &&
    customProgress == undefined
  ) {
    console.log(dailyProgress, customProgress);
    return <div>데이터 정보 없음</div>;
  }

  const dailyItems = data.checklists.daily.checklist;
  const customItems = data.checklists.custom.checklist;

  // 체크리스트 항목 완료 처리 함수
  const onCompleteItem = async (checklistId: string, type: string) => {
    try {
      handleChecklistToServer(checklistId, type);
      console.log('[2] 상위 컴포넌트 핸들러 실행', checklistId);
    } catch (error) {
      console.log('체크리스트 완료 실패', error);
    }
  };

  // 체크리스트 항목 유효성 검증 함수
  const onValidateItem = async (description: string) => {
    try {
      const result = await handleValidationCustomChecklist(description);
      console.log('유효성 검증 결과:', result);
      return result; // 데이터를 ChecklistPanel로 전달
    } catch (error) {
      console.error('유효성 검증 실패:', error.message);
      throw error;
    }
  };

  // 체크리스트 항목 추가 함수
  const onAddItem = async (description: string, uuid?: string) => {
    try {
      console.log('체크리스트 추가 시작:', description, 'UUID:', uuid);
      // uuid도 함께 전달
      handleSubmitCustomChecklist(description, uuid);
      console.log('체크리스트 항목 추가 요청 완료');
    } catch (error) {
      console.error('체크리스트 항목 추가 실패:', error);
    }
  };

  // 체크리스트 항목 수정 함수
  const onEditItem = async (
    id: string,
    description: string,
    expId?: string,
  ) => {
    try {
      // expId도 함께 전달
      await handleEditCustomChecklist(id, description, expId);
      console.log('체크리스트 항목 수정됨:', id, description, 'expId:', expId);
    } catch (error) {
      console.error('체크리스트 항목 수정 실패:', error);
    }
  };

  // 체크리스트 항목 삭제 함수
  const onDeleteItem = async (id: string) => {
    try {
      await handleDeleteCustomChecklist(id);
      console.log('체크리스트 항목 삭제됨:', id);
    } catch (error) {
      console.error('체크리스트 항목 삭제 실패:', error);
    }
  };

  return (
    <div>
      {/* 탭 전환 버튼 */}
      <div className='flex justify-center mb-4 space-x-4'>
        <ChecklistTab
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          tabName='daily'
          text={'오늘의 체크리스트'}
        />
        <ChecklistTab
          setActiveTab={setActiveTab}
          tabName='custom'
          activeTab={activeTab}
          text={'나만의 체크리스트'}
        />
      </div>

      {activeTab === 'daily' ? (
        <>
          {/* ✅ 진척률 바 항상 보이게 유지 */}
          <div className='mt-4 mb-4'>
            <h3 className='text-center text-lg font-semibold mb-2'>
              오늘 내가 실천할 일
            </h3>
            <ProgressBar progress={dailyProgress} />
            <p className='text-center text-sm mt-2'>{dailyProgress}% 완료</p>
          </div>

          {/* ✅ 체크리스트 항목에만 스크롤 적용 */}
          <div className='max-h-[calc(100vh-260px)] px-4'>
            <ChecklistPanel
              items={dailyItems}
              activateTab={activeTab}
              isEditable={false}
              onValidateItem={onValidateItem}
              onCompleteItem={onCompleteItem}
            />
          </div>
        </>
      ) : (
        <>
          {/* ✅ 진척률 바 항상 보이게 유지 */}
          <div className='mt-4 mb-4'>
            <h3 className='text-center text-lg font-semibold mb-2'>
              나만의 체크리스트
            </h3>
            <ProgressBar progress={customProgress} />
            <p className='text-center text-sm mt-2'>{customProgress}% 완료</p>
          </div>

          {/* ✅ 체크리스트 항목에만 스크롤 적용 */}
          <div className='max-h-[calc(100vh-260px)] px-4'>
            <ChecklistPanel
              items={customItems}
              isEditable={true}
              activateTab={activeTab}
              onValidateItem={onValidateItem}
              onCompleteItem={onCompleteItem}
              onAddItem={onAddItem}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CharChecklist;
