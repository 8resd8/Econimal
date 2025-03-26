import { ChecklistTypes } from '@/pages/character/types/checklist/ChecklistPanelTypes';
import { X } from 'lucide-react';

const CustomChecklistModal = ({
  newItemDescription,
  setIsModalOpen,
  setNewDescription,
  onAddItem,
}: {
  newItemDescription: string;
  setIsModalOpen: (bool: boolean) => void;
  setNewDescription: (value: string) => void;
  onAddItem: (item: ChecklistTypes) => void;
}) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]'>
      {/* 부모 요소에 맞춰서 검정 화면으로 감싼다. */}
      <div className='bg-white p-6 rounded-lg shadow-lg w-[300px] relative'>
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsModalOpen(false)}
          className='absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full'
        >
          <X className='w-5 h-5' />
        </button>

        {/* 하위 체크리스트 추가 목록 창 및 사용자 입력 창*/}
        <h3 className='font-bold mb-4'>새 체크리스트 추가</h3>
        <input
          type='text'
          placeholder='나만의 체크리스트 내용을 작성해주세요'
          //사용자의 입력 내용
          value={newItemDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className='w-full p-2 border rounded mb-4'
        />

        {/* 취소 & 추가하기 버튼 */}
        <div className='flex justify-end space-x-2'>
          <button
            onClick={() => setIsModalOpen(false)}
            className='px-4 py-2 bg-gray-200 rounded'
          >
            취소
          </button>

          <button
            onClick={() => {
              // 서버에 검증로직 추가 => 검증 내역에 대한 확인 모달창 => 추가

              if (newItemDescription.trim()) {
                onAddItem?.({
                  //내용 추가하기
                  checklistId: Date.now().toString(), //현재 시간 기준으로 toString()화 하여 저장하기
                  //   title: newItemDescription.trim(), //끝 공백 삭제하여 추가하기
                  description: '',
                  exp: 10, // 사용자 체크리스트 10점으로 고정
                  is_complete: false, //추후 체크리스트 완료 확인을 위해 설정
                });
                setNewDescription(''); //입력창 비우기
                setIsModalOpen(false); //모달창 닫기
              }
            }}
            className='px-4 py-2 bg-green-500 text-white rounded'
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomChecklistModal;
