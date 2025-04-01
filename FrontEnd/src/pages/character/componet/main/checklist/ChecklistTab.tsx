const ChecklistTab = ({
  setActiveTab,
  activeTab,
  text,
  tabName,
}: {
  setActiveTab: (category: string) => void;
  activeTab: string;
  text: string;
  tabName: string;
}) => {
  return (
    <button
      className={`px-4 py-4 rounded-full font-bold text-sm transition-all shadow-md
        ${
          activeTab === tabName
            ? 'bg-yellow-400 text-white scale-105' // ✅ 활성화된 버튼은 노란색 & 살짝 커짐
            : 'bg-gray-200 text-gray-600'
        }`}
      onClick={() => setActiveTab(tabName)}
    >
      {tabName === 'daily' ? '📋 ' : '🌱 '}
      {text}
    </button>
  );
};

export default ChecklistTab;
