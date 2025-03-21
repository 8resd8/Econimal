import { useState } from 'react';

interface ChecklistPanelProps {
  items: Array<{
    id: string;
    title: string;
    description: string;
    points: number;
    completed: boolean;
  }>;
  isEditable?: boolean; // 수정/삭제 가능 여부
  onAddItem?: (newItem) => void;
  onEditItem?: (id: string, newTitle: string) => void;
  onDeleteItem?: (id: string) => void;
}

const ChecklistPanel: React.FC<ChecklistPanelProps> = ({
  items,
  isEditable = false,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');

  return (
    <div className='space-y-4'>
      {/* 체크리스트 아이템 렌더링 */}
      {items.map((item) => (
        <div
          key={item.id}
          className={`p-4 border rounded-lg ${
            item.completed ? 'bg-green-100' : 'bg-white'
          }`}
        >
          <div className='flex items-center justify-between'>
            {/* 제목 및 완료 상태 */}
            <div>
              <h3 className='font-bold'>{item.title}</h3>
              <p className='text-sm text-gray-600'>{item.description}</p>
              <span className='text-sm font-semibold'>{item.points}점</span>
            </div>

            {/* 수정/삭제 버튼 (커스텀 미션만 표시) */}
            {isEditable && (
              <div className='ml-4'>
                <button
                  onClick={() => setEditingId(item.id)}
                  className='mr-2 text-blue-500'
                >
                  수정
                </button>
                <button
                  onClick={() => onDeleteItem?.(item.id)}
                  className='text-red-500'
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 수정 입력 필드 */}
          {editingId === item.id && (
            <input
              type='text'
              value={item.title}
              onChange={(e) => onEditItem?.(item.id, e.target.value)}
              onBlur={() => setEditingId(null)}
              autoFocus
              className='mt-2 p-2 border rounded w-full'
            />
          )}
        </div>
      ))}

      {/* 커스텀 미션 추가 입력 필드 */}
      {isEditable && onAddItem && (
        <div className='mt-4'>
          <input
            type='text'
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder='새로운 미션 추가'
            className='mr-2 p-2 border rounded w-full'
          />
          <button
            onClick={() => {
              if (newItemTitle.trim()) {
                onAddItem({
                  id: Date.now().toString(),
                  title: newItemTitle.trim(),
                  description: '새로운 커스텀 미션입니다.',
                  points: Math.floor(Math.random() * 11) + 10,
                  completed: false,
                });
                setNewItemTitle('');
              }
            }}
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded'
          >
            추가하기
          </button>
        </div>
      )}
    </div>
  );
};

export default ChecklistPanel;
