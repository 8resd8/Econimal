const ChecklistTab = ({
  setActiveTab,
  activeTab,
  text,
  tabName,
}: {
  setActiveTab: (category: string) => void;
  activeTab: string;
  text: string;
  tabName: string; //tabName으로 버튼 토글의 상황에 맞게 변환되도록 설정
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-full font-bold ${
        activeTab === tabName
          ? 'bg-green-500 text-white'
          : 'bg-gray-200 text-gray-600'
      }`}
      onClick={() => setActiveTab(tabName)}
    >
      {text}
    </button>
  );
};

export default ChecklistTab;
