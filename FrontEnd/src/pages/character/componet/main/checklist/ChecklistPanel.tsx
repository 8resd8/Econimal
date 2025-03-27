import { useState, useEffect, useRef } from 'react';
import ChecklistItem from './ChecklistItem';
import CustomChecklistAdvice from './CustomChecklistAdvice';
import CustomChecklistModal from './CustomChecklistModal';
import EditChecklistModal from './EditChecklistModal';
import ValidationResultModal from './ValidationResultModal';
import CompleteChecklistModal from './CompleteChecklistModal';
import CompleteConfirmModal from './CompleteConfirmModal';
import { Plus, Edit, Trash, Check, LockIcon } from 'lucide-react';

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
  onAddItem?: (description: string) => void;
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
  const [editingItem, setEditingItem] = useState<ChecklistItemType | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 유효성 검증 관련 상태
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationData, setValidationData] = useState<any>(null);
  const [pendingValidation, setPendingValidation] = useState('');

  // 완료 관련 상태
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);
  const [completePendingItem, setCompletePendingItem] =
    useState<ChecklistItemType | null>(null);
  const [completedItemExp, setCompletedItemExp] = useState(0);

  // 삭제 확인 관련 상태
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

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
      editingItem,
      isEditModalOpen,
      isCompleteModalOpen,
      isCompleteConfirmOpen,
      completePendingItem,
    });
  }, [
    isValidationModalOpen,
    validationData,
    pendingValidation,
    editingItem,
    isEditModalOpen,
    isCompleteModalOpen,
    isCompleteConfirmOpen,
    completePendingItem,
  ]);

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

  // 수정 시작 핸들러
  const handleEditStart = (item: ChecklistItemType) => {
    // 완료된 항목은 수정 불가
    if (item.isComplete) return;

    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  // 삭제 핸들러
  const handleDeleteClick = (item: ChecklistItemType) => {
    // 완료된 항목은 삭제 불가
    if (item.isComplete) return;

    if (showDeleteConfirm === item.checklistId) {
      // 확인 후 삭제 실행
      if (onDeleteItem) {
        onDeleteItem(item.checklistId);
        console.log('항목 삭제됨:', item.checklistId);
      }
      setShowDeleteConfirm(null);
    } else {
      // 삭제 확인 표시
      setShowDeleteConfirm(item.checklistId);
      console.log('삭제 확인 표시:', item.checklistId);
    }
  };

  // 완료 시작 핸들러 - 확인 모달 표시
  const handleCompleteStart = (item: ChecklistItemType) => {
    setCompletePendingItem(item);
    setIsCompleteConfirmOpen(true);
  };

  // 완료 확인 핸들러
  const handleCompleteConfirm = () => {
    if (!completePendingItem || !onCompleteItem) return;

    // 완료 처리
    onCompleteItem(completePendingItem.checklistId, activateTab || '');

    // 완료 모달 표시 준비
    setCompletedItemExp(completePendingItem.exp);

    // 확인 모달 닫기
    setIsCompleteConfirmOpen(false);

    // 약간의 지연 후 완료 성공 모달 표시
    setTimeout(() => {
      setIsCompleteModalOpen(true);
    }, 300);

    // 상태 정리
    setCompletePendingItem(null);
  };

  // 완료 확인 취소 핸들러
  const handleCompleteCancel = () => {
    setIsCompleteConfirmOpen(false);
    setCompletePendingItem(null);
  };

  // 항목 개수가 최대 개수를 초과하는지 확인
  const isMaxItemsReached = items.length >= MAX_CUSTOM_ITEMS;

  return (
    <div className='space-y-4'>
      {/* 체크리스트 아이템 렌더링 */}
      {items.map((item) => (
        <div
          key={item.checklistId}
          className={`p-4 border rounded-lg ${
            item.isComplete ? 'bg-gray-50 border-green-200' : ''
          }`}
        >
          <div className='flex flex-col'>
            {/* 체크리스트 내용 및 기본 정보 */}
            <div className='flex justify-between items-center mb-2'>
              <div className='flex items-center'>
                {item.isComplete && (
                  <div className='mr-2 p-1 bg-green-100 rounded-full'>
                    <Check size={16} className='text-green-600' />
                  </div>
                )}
                <ChecklistItem description={item.description} exp={item.exp} />
              </div>

              {/* 경험치 표시 */}
              <span className='text-sm text-gray-500'>경험치: {item.exp}</span>
            </div>

            {/* 버튼 그룹 - 완료, 수정, 삭제 */}
            <div className='flex justify-end items-center space-x-2 mt-2'>
              {/* 편집 기능은 커스텀 체크리스트에만 표시 */}
              {isEditable && (
                <>
                  {/* 수정 버튼 - 완료된 항목은 비활성화 */}
                  <button
                    onClick={() => handleEditStart(item)}
                    className={`p-2 rounded-full transition-colors ${
                      item.isComplete
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-500 hover:bg-blue-100'
                    }`}
                    title={
                      item.isComplete
                        ? '완료된 항목은 수정할 수 없습니다'
                        : '수정하기'
                    }
                    disabled={item.isComplete}
                  >
                    {item.isComplete ? (
                      <LockIcon size={18} />
                    ) : (
                      <Edit size={18} />
                    )}
                  </button>

                  {/* 삭제 버튼/확인 버튼 - 완료된 항목은 비활성화 */}
                  {item.isComplete ? (
                    <button
                      className='p-2 text-gray-400 cursor-not-allowed'
                      title='완료된 항목은 삭제할 수 없습니다'
                      disabled={true}
                    >
                      <LockIcon size={18} />
                    </button>
                  ) : showDeleteConfirm === item.checklistId ? (
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className='p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors flex items-center'
                      title='삭제 확인'
                    >
                      <Check size={18} />
                      <span className='text-xs ml-1'>확인</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className='p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors'
                      title='삭제하기'
                    >
                      <Trash size={18} />
                    </button>
                  )}
                </>
              )}

              {/* 완료 버튼 */}
              {!item.isComplete && (
                <button
                  onClick={() => handleCompleteStart(item)}
                  className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                >
                  완료하기
                </button>
              )}

              {/* 완료 상태 표시 */}
              {item.isComplete && (
                <span className='px-4 py-2 bg-green-100 text-green-700 rounded-lg'>
                  완료됨
                </span>
              )}
            </div>
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

          {/* 체크리스트 수정 모달 */}
          {isEditModalOpen && editingItem && (
            <EditChecklistModal
              item={editingItem}
              setIsModalOpen={setIsEditModalOpen}
              onEditItem={onEditItem}
              onValidateItem={onValidateItem}
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
          <p>수정 중인 항목: {editingItem?.description || '없음'}</p>
          <p>완료 확인 모달: {isCompleteConfirmOpen ? 'true' : 'false'}</p>
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

      {/* 완료 확인 모달 */}
      {isCompleteConfirmOpen && completePendingItem && (
        <CompleteConfirmModal
          isOpen={isCompleteConfirmOpen}
          itemDescription={completePendingItem.description}
          onClose={handleCompleteCancel}
          onConfirm={handleCompleteConfirm}
        />
      )}

      {/* 체크리스트 완료 성공 모달 */}
      {isCompleteModalOpen && (
        <CompleteChecklistModal
          exp={completedItemExp}
          onClose={() => {
            setIsCompleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ChecklistPanel;
