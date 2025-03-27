import { useState, useEffect } from 'react';
import ChecklistItem from './ChecklistItem';
import CustomChecklistAdvice from './CustomChecklistAdvice';
import CustomChecklistModal from './CustomChecklistModal';
import ValidationResultModal from './ValidationResultModal';

const ChecklistPanel = ({
  items,
  isEditable = false,
  activateTab,
  onValidateItem,
  onAddItem,
  onCompleteItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 커스텀 체크리스트 추가 모달
  const [newItemDescription, setNewItemDescription] = useState('');
  const [editingId, setEditingId] = useState(null); // 수정 상태 관리

  // 유효성 검증 관련 상태
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationData, setValidationData] = useState(null);
  const [pendingValidation, setPendingValidation] = useState('');

  // 데이터가 변경될 때 모달 표시를 위한 useEffect
  useEffect(() => {
    if (validationData && !isValidationModalOpen) {
      setIsValidationModalOpen(true);
      console.log('모달이 열렸습니다:', validationData);
    }
  }, [validationData]);

  const handleValidationResult = async (description) => {
    try {
      console.log('유효성 검증 시작:', description);
      setPendingValidation(description);

      // 먼저 이전 데이터를 초기화
      setValidationData(null);
      setIsValidationModalOpen(false);

      const data = await onValidateItem(description);
      console.log('받은 데이터:', data);

      if (data && data.aiResponse) {
        // 상태 업데이트를 한 번에 처리
        setValidationData(data);
        // 모달은 useEffect에서 열림
      } else {
        console.error('유효성 검증 결과에 필요한 데이터가 없습니다.');
      }
    } catch (error) {
      console.error('유효성 검증 과정에서 에러가 발생했습니다.', error.message);
    }
  };

  return (
    <div className='space-y-4'>
      {/* 체크리스트 아이템 렌더링 */}
      {items.map((item) => (
        <div key={item.checklistId} className='p-4 border rounded-lg'>
          <div className='flex justify-between items-center'>
            <ChecklistItem description={item.description} exp={item.exp} />

            {/* 완료 버튼 */}
            {!item.isComplete && (
              <button
                onClick={() => handleValidationResult(item.description)}
                className='mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
              >
                유효성 검증하기
              </button>
            )}
          </div>
        </div>
      ))}

      {/* 커스텀 체크리스트 추가 입력 필드 */}
      {isEditable && (
        <>
          {!items.length && (
            <CustomChecklistAdvice setIsModalOpen={setIsModalOpen} />
          )}
          {isModalOpen && (
            <CustomChecklistModal
              newItemDescription={newItemDescription}
              setIsModalOpen={setIsModalOpen}
              setNewDescription={setNewItemDescription}
              onValidateItem={handleValidationResult}
              onAddItem={onAddItem}
            />
          )}
        </>
      )}

      {/* 유효성 검증 결과 모달 */}
      {validationData && isValidationModalOpen && (
        <ValidationResultModal
          isOpen={isValidationModalOpen}
          validationData={validationData}
          onClose={() => {
            setIsValidationModalOpen(false);
            setValidationData(null);
          }}
          onConfirm={() => {
            console.log('사용자가 확인을 눌렀습니다.');
            // 여기서 onAddItem을 호출하여 체크리스트에 추가
            if (pendingValidation) {
              onAddItem?.({
                checklistId: Date.now().toString(),
                description: pendingValidation,
                exp: validationData.aiResponse.point || 10,
                isComplete: false,
              });
              setPendingValidation('');
            }
            setIsValidationModalOpen(false);
            setValidationData(null);
          }}
          onDelete={() => {
            console.log('사용자가 삭제를 눌렀습니다.');
            setPendingValidation('');
            setIsValidationModalOpen(false);
            setValidationData(null);
          }}
        />
      )}
    </div>
  );
};

export default ChecklistPanel;
