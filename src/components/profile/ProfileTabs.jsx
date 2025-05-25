/**
 * Profile tabs navigation component
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.setActiveTab - Function to set active tab
 * @returns {JSX.Element} Profile tabs
 */
const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      icon: "person"
    },
    {
      id: "security",
      label: "Security",
      icon: "security"
    },
    {
      id: "account",
      label: "Account",
      icon: "manage_accounts"
    }
  ];

  return (
    <div className="tabs tabs-bordered mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab tab-lg ${activeTab === tab.id ? "tab-active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="material-icons mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
