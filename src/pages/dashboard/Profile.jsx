import DashboardLayout from "../../layout/DashboardLayout";
import {
  ProfileHeader,
  ProfileTabs,
  PersonalInfoTab,
  SecurityTab,
  AccountTab,
  DeleteAccountModal,
  AlertMessages
} from "../../components/profile";
import useProfile from "../../hooks/useProfile";

/**
 * Profile page component for user account management
 * @returns {JSX.Element} Profile page
 */
const ProfilePage = () => {
  const {
    // States
    loading,
    error,
    success,
    activeTab,
    personalInfo,
    profile,
    passwordForm,
    avatarFile,
    avatarPreview,
    uploadingAvatar,
    saving,

    // Setters
    setActiveTab,
    setPersonalInfo,
    setPasswordForm,
    setAvatarFile,
    setAvatarPreview,

    // Handlers
    handlePersonalInfoUpdate,
    handlePasswordChange,
    handleAvatarFileChange,
    handleAvatarUpload,
    handleRemoveAvatar,
    handleDeleteAccount,
    confirmDeleteAccount
  } = useProfile();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg text-[#6b6bec]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <ProfileHeader />

        {/* Success/Error Messages */}
        <AlertMessages success={success} error={error} />

        {/* Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <PersonalInfoTab
              personalInfo={personalInfo}
              profile={profile}
              avatarPreview={avatarPreview}
              avatarFile={avatarFile}
              uploadingAvatar={uploadingAvatar}
              saving={saving}
              setPersonalInfo={setPersonalInfo}
              handlePersonalInfoUpdate={handlePersonalInfoUpdate}
              handleAvatarFileChange={handleAvatarFileChange}
              handleAvatarUpload={handleAvatarUpload}
              handleRemoveAvatar={handleRemoveAvatar}
              setAvatarFile={setAvatarFile}
              setAvatarPreview={setAvatarPreview}
            />
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <SecurityTab
              passwordForm={passwordForm}
              saving={saving}
              setPasswordForm={setPasswordForm}
              handlePasswordChange={handlePasswordChange}
            />
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <AccountTab
              profile={profile}
              handleDeleteAccount={handleDeleteAccount}
            />
          )}
        </div>

        {/* Delete Account Modal */}
        <DeleteAccountModal confirmDeleteAccount={confirmDeleteAccount} />
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
