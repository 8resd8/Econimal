import { Star, Plus, Pencil, Trash2, X } from 'lucide-react';
import { ChecklistPanelProps } from '@/pages/character/types/ChecklistPanelProps';
import { ChecklistItem } from '@/pages/character/types/ChecklistItem';

const ChecklistPanel = ({ items }: ChecklistPanelProps) => {
  return (
    <div>
      {items.map((item: ChecklistItem) => (
        <div
          key={item.id}
          className='bg-white rounded-2xl p-4 space-y-2 border-2 border-gray-200 hover:border-blue-200 transition-colors'
        >
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h3 className='font-bold'>{item.title}</h3>
              <p className='text-sm text-gray-600 mt-1'>{item.description}</p>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg'>
                <Star className='w-4 h-4 fill-current' />
                <span className='text-sm font-medium'>{item.points}</span>
              </div>
            </div>
          </div>
          <button
            // onClick={() => onComplete?.(item.id)}
            className={`w-full py-2 px-4 rounded-xl font-medium transition-colors ${
              item.completed
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
            disabled={item.completed}
          >
            {item.completed ? '완료됨' : '완료하기'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChecklistPanel;
