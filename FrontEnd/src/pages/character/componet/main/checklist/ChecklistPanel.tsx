import { useState, useEffect, useRef } from 'react';
import ChecklistItem from './ChecklistItem';
import CustomChecklistAdvice from './CustomChecklistAdvice';
import CustomChecklistModal from './CustomChecklistModal';
import EditChecklistModal from './EditChecklistModal';
import ValidationResultModal from './ValidationResultModal';
import CompleteChecklistModal from './CompleteChecklistModal';
import CompleteConfirmModal from './CompleteConfirmModal';
import { Plus, Edit, Trash, Check, LockIcon } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

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
  onAddItem?: (description: string, expId?: string) => void; // expId 매개변수 추가
  onCompleteItem?: (id: string, type: string) => void;
  onEditItem?: (id: string, description: string, expId?: string) => void; // expId 매개변수 추가
  onDeleteItem?: (id: string) => void;
}

const MAX_CUSTOM_ITEMS = 5;

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
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationData, setValidationData] = useState<any>(null);
  const [pendingValidation, setPendingValidation] = useState('');
  const [isEditValidation, setIsEditValidation] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);
  const [completePendingItem, setCompletePendingItem] =
    useState<ChecklistItemType | null>(null);
  const [completedItemExp, setCompletedItemExp] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [deleteConfirmItem, setDeleteConfirmItem] =
    useState<ChecklistItemType | null>(null);

  const debugRef = useRef({
    validationAttempts: 0,
    lastValidationData: null,
    modalOpenAttempts: 0,
  });

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
      isEditValidation,
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
    isEditValidation,
  ]);

  useEffect(() => {
    if (validationData) {
      console.log('검증 데이터가 설정됨:', validationData);
      debugRef.current.modalOpenAttempts++;
      console.log(`모달 열기 시도 #${debugRef.current.modalOpenAttempts}`);

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
      setIsEditValidation(false);

      setValidationData(null);
      setIsValidationModalOpen(false);

      const data = await onValidateItem(description);
      console.log('검증 결과 데이터:', data);
      debugRef.current.lastValidationData = data;

      if (data && data.aiResponse) {
        setValidationData(data);
        console.log('검증 데이터 상태 설정됨');
      } else {
        console.error('유효성 검증 결과에 필요한 데이터가 없습니다.', data);
      }
    } catch (error: any) {
      console.error('유효성 검증 과정에서 에러가 발생했습니다.', error.message);
    }
  };

  const handleEditValidationResult = async (description: string) => {
    try {
      console.log('수정 항목 유효성 검증 시작:', description);
      debugRef.current.validationAttempts++;
      console.log(`검증 시도 #${debugRef.current.validationAttempts}`);

      setPendingValidation(description);
      setIsEditValidation(true);

      setValidationData(null);
      setIsValidationModalOpen(false);

      // 수정 모달 닫기
      setIsEditModalOpen(false);

      const data = await onValidateItem(description);
      console.log('검증 결과 데이터:', data);
      debugRef.current.lastValidationData = data;

      if (data && data.aiResponse) {
        setValidationData(data);
        console.log('검증 데이터 상태 설정됨');
      } else {
        console.error('유효성 검증 결과에 필요한 데이터가 없습니다.', data);
      }
    } catch (error: any) {
      console.error('유효성 검증 과정에서 에러가 발생했습니다.', error.message);
    }
  };

  const handleEditStart = (item: ChecklistItemType) => {
    if (item.isComplete) return;
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item: ChecklistItemType) => {
    if (item.isComplete) return;
    setDeleteConfirmItem(item);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmItem || !onDeleteItem) return;
    onDeleteItem(deleteConfirmItem.checklistId);
    setDeleteConfirmItem(null);
  };

  const handleCompleteStart = (item: ChecklistItemType) => {
    setCompletePendingItem(item);
    setIsCompleteConfirmOpen(true);
  };

  const handleCompleteConfirm = () => {
    if (!completePendingItem || !onCompleteItem) return;

    onCompleteItem(completePendingItem.checklistId, activateTab || '');

    setCompletedItemExp(completePendingItem.exp);

    setIsCompleteConfirmOpen(false);

    setTimeout(() => {
      setIsCompleteModalOpen(true);
    }, 300);

    setCompletePendingItem(null);
  };

  const handleCompleteCancel = () => {
    setIsCompleteConfirmOpen(false);
    setCompletePendingItem(null);
  };

  const isMaxItemsReached = items.length >= MAX_CUSTOM_ITEMS;

  return (
    <div className='space-y-0 flex flex-col gap-y-4 mb-4'>
      {items.map((item) => (
        <div
          key={item.checklistId}
          className={`p-4 border rounded-xl flex items-center justify-between ${
            item.isComplete
              ? 'bg-slate-100 border-slate-300 text-slate-700'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className='flex flex-col justify-center items-center w-full'>
            {/* ✔️ 체크 아이콘 & 설명 */}
            <div className='flex items-center space-x-3'>
              {item.isComplete ? (
                <div className='p-2 bg-green-400 rounded-full'>
                  <Check size={24} className='text-white' />
                </div>
              ) : (
                <div className='p-2 bg-slate-200 rounded-full'>
                  <Check size={24} className='text-slate-700' />
                </div>
              )}
              <span className='text-lg font-semibold text-wrap'>
                {item.description}
              </span>
            </div>

            {/* 🛠️ 수정 & 삭제 버튼 */}
            <div className='flex justify-between items-center mt-2'>
              <div className='flex space-x-2'>
                {isEditable && (
                  <>
                    <button
                      onClick={() => handleEditStart(item)}
                      className={`p-2 rounded-lg text-blue-500 border border-blue-300 hover:bg-blue-100 transition-all ${
                        item.isComplete ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      title={
                        item.isComplete
                          ? '완료된 항목은 수정할 수 없습니다'
                          : '수정하기'
                      }
                      disabled={item.isComplete}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className='p-2 text-red-500 border border-red-300 hover:bg-red-100 rounded-lg transition-all'
                      title='삭제하기'
                    >
                      <Trash size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* 완료하기 버튼 */}
              {item.isComplete ? (
                <span className='px-4 py-2 bg-green-100 rounded-full text-sm font-bold text-slate-700'>
                  🎖️ 완료됨
                </span>
              ) : (
                <button
                  onClick={() => handleCompleteStart(item)}
                  className='relative px-4 py-2 rounded-full bg-slate-300 text-slate-700 font-semibold shadow-md
                  hover:bg-slate-400 transition-all'
                >
                  🎉 완료하기
                  <span className='absolute -top-3 -right-3 bg-blue-400 text-white text-xs px-2 py-1 rounded-full shadow'>
                    +{item.exp} XP
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {isEditable && (
        <div className='mt-4'>
          {!items.length && (
            <CustomChecklistAdvice setIsModalOpen={setIsModalOpen} />
          )}
          {items.length > 0 && !isMaxItemsReached && (
            <button
              onClick={() => setIsModalOpen(true)}
              className='w-full py-3 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              <Plus size={20} className='mr-2' />
              <span>새로운 체크리스트 추가하기</span>
            </button>
          )}
          {isMaxItemsReached && (
            <div className='w-full py-3 text-center bg-gray-100 rounded-lg text-gray-500'>
              최대 {MAX_CUSTOM_ITEMS}개의 체크리스트만 추가할 수 있습니다.
            </div>
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
          {isEditModalOpen && editingItem && (
            <EditChecklistModal
              item={editingItem}
              setIsModalOpen={setIsEditModalOpen}
              onEditItem={onEditItem}
              onValidateItem={handleEditValidationResult}
            />
          )}
        </div>
      )}

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
            // uuid 정보 추출
            const uuid = validationData.uuid;
            console.log('사용할 UUID:', uuid);

            if (
              isEditValidation &&
              editingItem &&
              pendingValidation &&
              onEditItem
            ) {
              // 수정 로직 실행 - uuid 전달
              onEditItem(editingItem.checklistId, pendingValidation, uuid);
              setEditingItem(null);
            } else if (!isEditValidation && pendingValidation && onAddItem) {
              // 추가 로직 실행 - uuid 전달
              onAddItem(pendingValidation, uuid);
            }
            setPendingValidation('');
            setIsValidationModalOpen(false);
            setValidationData(null);
            setIsEditValidation(false);
          }}
          onDelete={() => {
            console.log('사용자가 삭제를 눌렀습니다.');
            setPendingValidation('');
            setIsValidationModalOpen(false);
            setValidationData(null);
            setIsEditValidation(false);
          }}
        />
      )}

      {isCompleteConfirmOpen && completePendingItem && (
        <CompleteConfirmModal
          isOpen={isCompleteConfirmOpen}
          itemDescription={completePendingItem.description}
          onClose={handleCompleteCancel}
          onConfirm={handleCompleteConfirm}
        />
      )}

      {isCompleteModalOpen && (
        <CompleteChecklistModal
          exp={completedItemExp}
          onClose={() => {
            setIsCompleteModalOpen(false);
          }}
        />
      )}

      {deleteConfirmItem && (
        <DeleteConfirmModal
          isOpen={!!deleteConfirmItem}
          onClose={() => setDeleteConfirmItem(null)}
          onConfirm={handleDeleteConfirm}
          itemDescription={deleteConfirmItem.description}
        />
      )}
    </div>
  );
};

export default ChecklistPanel;
