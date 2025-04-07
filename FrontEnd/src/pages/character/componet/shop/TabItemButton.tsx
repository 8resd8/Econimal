const TabItemButton = ({
  category,
  activeTab,
  selectedTab,
  setSelectedTab,
}: {
  category: string;
  activeTab: string;
  selectedTab: string;
  setSelectedTab: (data: string) => void;
}) => {
  return (
    <button
      onClick={() => setSelectedTab(activeTab)}
      className={`px-6 py-2 rounded-full ${
        selectedTab === activeTab
          ? // selectedTab === 'backgrounds'
            'bg-green-600 text-white'
          : 'bg-gray-800 text-gray-400'
      }`}
    >
      {category}
    </button>
  );
};

export default TabItemButton;
