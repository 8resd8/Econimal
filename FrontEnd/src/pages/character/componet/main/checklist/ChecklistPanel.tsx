import { useState, useEffect, useRef } from 'react';
import ChecklistItem from './ChecklistItem';
import CustomChecklistAdvice from './CustomChecklistAdvice';
import CustomChecklistModal from './CustomChecklistModal';
import ValidationResultModal from './ValidationResultModal';
import { Plus } from 'lucide-react'; // 추가 아이콘을 위해 lucide-react에서 Plus 아이콘 import

interface ChecklistItemType {
  checklistId: string;
  description: string;
  exp: number;
  isComplete: boolean;
}

interface ChecklistPanelProps {
  items: ChecklistItemType[];
  isEditable?: boolean;
  activateTab?: string;
  onValidateItem: (description: string) => Promise<any>;
  onAddItem?: (description: string) => void; // description만 전송하도록 변경
  onCompleteItem?: (id: string, type: string) => void;
  onEditItem?: (id: string, description: string) => void;
  onDeleteItem?: (id: string) => void;
}

const MAX_CUSTOM_ITEMS = 5; // 최대 항목 수 제한

const ChecklistPanel: React.FC<ChecklistPanelProps> = ({
  items,
  isEditable = false,
  activateTab,
  onValidateItem,
  onAddItem,
  onCompleteItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // 유효성 검증 관련 상태
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationData, setValidationData] = useState<any>(null);
  const [pendingValidation, setPendingValidation] = useState('');

  // 디버깅을 위한 ref
  const debugRef = useRef({
    validationAttempts: 0,
    lastValidationData: null,
    modalOpenAttempts: 0,
  });

  // 디버깅용 로그
  useEffect(() => {
    console.log('현재 상태:', {
      isValidationModalOpen,
      validationData,
      pendingValidation,
    });
  }, [isValidationModalOpen, validationData, pendingValidation]);

  // 검증 데이터가 설정되면 모달 열기
  useEffect(() => {
    if (validationData) {
      console.log('검증 데이터가 설정됨:', validationData);
      debugRef.current.modalOpenAttempts++;
      console.log(`모달 열기 시도 #${debugRef.current.modalOpenAttempts}`);

      // 약간의 지연 후 모달 열기 (상태 업데이트가 완료되도록)
      const timerId = setTimeout(() => {
        setIsValidationModalOpen(true);
        console.log('모달 열림 상태 설정됨:', true);
      }, 100);

      return () => clearTimeout(timerId);
    }
  }, [validationData]);

  const handleValidationResult = async (description: string) => {
    try {
      console.log('유효성 검증 시작:', description);
      debugRef.current.validationAttempts++;
      console.log(`검증 시도 #${debugRef.current.validationAttempts}`);

      setPendingValidation(description);

      // 이전 상태 초기화
      setValidationData(null);
      setIsValidationModalOpen(false);

      const data = await onValidateItem(description);
      console.log('검증 결과 데이터:', data);
      debugRef.current.lastValidationData = data;

      if (data && data.aiResponse) {
        // 상태 업데이트
        setValidationData(data);
        console.log('검증 데이터 상태 설정됨');
      } else {
        console.error('유효성 검증 결과에 필요한 데이터가 없습니다.', data);
      }
    } catch (error: any) {
      console.error('유효성 검증 과정에서 에러가 발생했습니다.', error.message);
    }
  };

  // 항목 개수가 최대 개수를 초과하는지 확인
  const isMaxItemsReached = items.length >= MAX_CUSTOM_ITEMS;

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
                onClick={() =>
                  onCompleteItem &&
                  onCompleteItem(item.checklistId, activateTab || '')
                }
                className='mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
              >
                완료하기
              </button>
            )}
          </div>
        </div>
      ))}

      {/* 커스텀 체크리스트 추가 입력 필드 - 항목 개수와 상관없이 항상 표시 */}
      {isEditable && (
        <div className='mt-4'>
          {/* 항목이 없을 경우에만 안내 메시지 표시 */}
          {!items.length && (
            <CustomChecklistAdvice setIsModalOpen={setIsModalOpen} />
          )}

          {/* 항목이 있을 경우 추가 버튼 표시 (최대 개수 미만일 때만) */}
          {items.length > 0 && !isMaxItemsReached && (
            <button
              onClick={() => setIsModalOpen(true)}
              className='w-full py-3 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              <Plus size={20} className='mr-2' />
              <span>새로운 체크리스트 추가하기</span>
            </button>
          )}

          {/* 최대 개수에 도달했을 때 안내 메시지 */}
          {isMaxItemsReached && (
            <div className='w-full py-3 text-center bg-gray-100 rounded-lg text-gray-500'>
              최대 {MAX_CUSTOM_ITEMS}개의 체크리스트만 추가할 수 있습니다.
            </div>
          )}

          {/* 체크리스트 추가 모달 */}
          {isModalOpen && (
            <CustomChecklistModal
              newItemDescription={newItemDescription}
              setIsModalOpen={setIsModalOpen}
              setNewDescription={setNewItemDescription}
              onValidateItem={handleValidationResult}
              onAddItem={onAddItem}
            />
          )}
        </div>
      )}

      {/* 디버깅 로그 - 앱 상태 표시 (개발 환경에서만 표시) */}
      {process.env.NODE_ENV === 'development' && (
        <div className='mt-4 p-4 bg-gray-100 rounded text-xs'>
          <p>검증 모달 열림: {isValidationModalOpen ? 'true' : 'false'}</p>
          <p>검증 데이터 있음: {validationData ? 'true' : 'false'}</p>
          <p>대기 중인 검증: {pendingValidation || '없음'}</p>
          <p>
            항목 개수: {items.length} / {MAX_CUSTOM_ITEMS}
          </p>
        </div>
      )}

      {/* 유효성 검증 결과 모달 */}
      {validationData && (
        <ValidationResultModal
          isOpen={isValidationModalOpen}
          validationData={validationData}
          onClose={() => {
            console.log('모달 닫힘');
            setIsValidationModalOpen(false);
            setValidationData(null);
          }}
          onConfirm={() => {
            console.log('사용자가 확인을 눌렀습니다.');
            if (pendingValidation && onAddItem) {
              // description만 전달
              onAddItem(pendingValidation);
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
