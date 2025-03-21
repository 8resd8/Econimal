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
  onCompleteItem?: (id: string) => void;
}

const ChecklistPanel: React.FC<ChecklistPanelProps> = ({
  items,
  isEditable = false,
  onAddItem,
  onCompleteItem,
}) => {
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
          <h3 className='font-bold'>{item.title}</h3>
          <p className='text-sm text-gray-600'>{item.description}</p>
          <span className='text-sm font-semibold'>{item.points}점</span>
          {!item.completed && (
            <button
              onClick={() => onCompleteItem?.(item.id)}
              className='mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg'
            >
              완료하기
            </button>
          )}
        </div>
      ))}

      {/* 커스텀 미션 추가 입력 필드 */}
      {isEditable && onAddItem && (
        <div className='mt-8 text-center'>
          <p>아직 체크리스트가 없습니다. 새로운 체크리스트를 추가해보세요!</p>
          <input
            type='text'
            placeholder='체크리스트 제목'
            className='mt-4 p-2 border rounded-lg w-full'
          />
          <button className='mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg'>
            체크리스트 추가하기
          </button>
        </div>
      )}
    </div>
  );
};

export default ChecklistPanel;
