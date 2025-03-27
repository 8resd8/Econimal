import { useState } from 'react';
import { X } from 'lucide-react';
import {
  // ChecklistPanel,
  ChecklistPanelProps,
} from '@/pages/character/types/checklist/ChecklistPanelTypes';
import CustomChecklistModal from './CustomChecklistModal';
import CustomChecklistAdvice from './CustomChecklistAdvice';
import ChecklistItem from './ChecklistItem';

const ChecklistPanel: React.FC<ChecklistPanelProps> = ({
  items,
  isEditable = false,
  activateTab,
  onAddItem,
  onCompleteItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null); //삭제할 아이디

  return (
    <div className='space-y-4'>
      {/* 체크리스트 아이템 렌더링 */}
      {items.map((item) => (
        <div
          key={item.checklistId}
          className={`p-4 border rounded-lg ${
            item.isComplete ? 'bg-green-100' : 'bg-white'
          }`}
        >
          <div className='flex justify-between items-center'>
            {/* 제목 및 별 아이콘 */}
            <ChecklistItem description={item.description} exp={item.exp} />

            {/* 커스텀 체크리스트 ------------------------------ */}
            {/* 수정/삭제 버튼 (커스텀 미션만 표시) */}
            {isEditable && (
              <div className='flex space-x-2'>
                <button
                  onClick={() => setEditingId(item.checklistId)}
                  className='text-blue-500 hover:underline'
                >
                  수정
                </button>
                <button
                  onClick={() => onDeleteItem?.(item.checklistId)}
                  className='text-red-500 hover:underline'
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 완료 버튼 */}
          {!item.isComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 버블링 방지
                console.log('[DEBUG] 버튼 클릭됨', item.checklistId); // 추가
                console.log('onCompleteItem 존재:', !!onCompleteItem); // 추가

                onCompleteItem?.(item.checklistId, activateTab);
              }}
              className='mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 z-50'
            >
              완료하기
            </button>
          )}

          {/* 수정 입력 필드 */}
          {editingId === item.checklistId && (
            <input
              type='text'
              value={item.title}
              onChange={(e) => onEditItem?.(item.checklistId, e.target.value)}
              onBlur={() => setEditingId(null)}
              autoFocus
              className='mt-2 p-2 border rounded w-full'
            />
          )}
        </div>
      ))}
      {/* 커스텀 체크리스트 ------------------------------ */}

      {/* 커스텀 미션 추가 입력 필드 */}
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
              onValidateItem={onValidateItem}
              onAddItem={onAddItem}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ChecklistPanel;
