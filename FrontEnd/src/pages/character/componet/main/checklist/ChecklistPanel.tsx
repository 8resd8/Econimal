import { useState } from 'react';
import { X } from 'lucide-react';

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
  onCompleteItem?: (id: string) => void;
  onEditItem?: (id: string, newTitle: string) => void;
  onDeleteItem?: (id: string) => void;
}

const ChecklistPanel: React.FC<ChecklistPanelProps> = ({
  items,
  isEditable = false,
  onAddItem,
  onCompleteItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

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
          <div className='flex justify-between items-center'>
            {/* 제목 및 별 아이콘 */}
            <div>
              <h3 className='font-bold flex items-center space-x-2'>
                <span>{item.title}</span>
                <span className='flex items-center text-yellow-500'>
                  ⭐ <span className='ml-1 text-sm'>{item.points}</span>
                </span>
              </h3>
              <p className='text-sm text-gray-600'>{item.description}</p>
            </div>

            {/* 수정/삭제 버튼 (커스텀 미션만 표시) */}
            {isEditable && (
              <div className='flex space-x-2'>
                <button
                  onClick={() => setEditingId(item.id)}
                  className='text-blue-500 hover:underline'
                >
                  수정
                </button>
                <button
                  onClick={() => onDeleteItem?.(item.id)}
                  className='text-red-500 hover:underline'
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 완료 버튼 */}
          {!item.completed && (
            <button
              onClick={() => onCompleteItem?.(item.id)}
              className='mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg'
            >
              완료하기
            </button>
          )}

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
      {isEditable && (
        <>
          {!items.length && (
            <div className='text-center p-6 border rounded-lg bg-gray-50'>
              <p>아직 체크리스트가 없습니다.</p>
              <p>새로운 체크리스트를 추가해보세요!</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className='mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg'
              >
                체크리스트 추가하기
              </button>
            </div>
          )}
          {isModalOpen && (
            <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]'>
              <div className='bg-white p-6 rounded-lg shadow-lg w-[300px] relative'>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full'
                >
                  <X className='w-5 h-5' />
                </button>
                <h3 className='font-bold mb-4'>새 체크리스트 추가</h3>
                <input
                  type='text'
                  placeholder='체크리스트 제목을 입력하세요'
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className='w-full p-2 border rounded mb-4'
                />
                <div className='flex justify-end space-x-2'>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className='px-4 py-2 bg-gray-200 rounded'
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      if (newItemTitle.trim()) {
                        onAddItem?.({
                          id: Date.now().toString(),
                          title: newItemTitle.trim(),
                          description: '',
                          points: Math.floor(Math.random() * 11) + 10,
                          completed: false,
                        });
                        setNewItemTitle('');
                        setIsModalOpen(false);
                      }
                    }}
                    className='px-4 py-2 bg-purple-500 text-white rounded'
                  >
                    추가하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChecklistPanel;
