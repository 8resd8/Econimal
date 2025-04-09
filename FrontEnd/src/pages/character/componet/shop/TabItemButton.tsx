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
            'bg-slate-300 text-slate-800'
          : 'bg-slate-800 text-slate-300'
      }`}
    >
      {category}
    </button>
  );
};

export default TabItemButton;
