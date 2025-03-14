import ChecklistPanel from './CheckListPanel';

const CustomChecklist = () => {
  return (
    <div className='fixed right-0 top-0 h-full z-50'>
      <ChecklistPanel
      // title='나만의 체크리스트'
      // items={customChecklist}
      // onClose={() => setActivePanel(null)}
      // onAdd={addCustomItem}
      // onEdit={editCustomItem}
      // onDelete={deleteCustomItem}
      // onComplete={(id) => completeItem(id, false)}
      // editable
      />
    </div>
  );
};
export default CustomChecklist;
