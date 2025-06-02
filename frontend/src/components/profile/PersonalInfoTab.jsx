import AvatarUpload from "./AvatarUpload";

/**
 * Personal information tab component
 * @param {Object} props - Component props
 * @param {Object} props.personalInfo - Personal information object
 * @param {Object} props.profile - User profile object
 * @param {string} props.avatarPreview - Avatar preview URL
 * @param {File} props.avatarFile - Selected avatar file
 * @param {boolean} props.uploadingAvatar - Avatar uploading state
 * @param {boolean} props.saving - Saving state
 * @param {Function} props.setPersonalInfo - Set personal info
 * @param {Function} props.handlePersonalInfoUpdate - Handle personal info update
 * @param {Function} props.handleAvatarFileChange - Handle avatar file selection
 * @param {Function} props.handleAvatarUpload - Handle avatar upload
 * @param {Function} props.handleRemoveAvatar - Handle avatar removal
 * @param {Function} props.setAvatarFile - Set avatar file
 * @param {Function} props.setAvatarPreview - Set avatar preview
 * @returns {JSX.Element} Personal info tab
 */
const PersonalInfoTab = ({
  personalInfo,
  profile,
  avatarPreview,
  avatarFile,
  uploadingAvatar,
  saving,
  setPersonalInfo,
  handlePersonalInfoUpdate,
  handleAvatarFileChange,
  handleAvatarUpload,
  handleRemoveAvatar,
  setAvatarFile,
  setAvatarPreview
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Personal Information</h2>

      <form onSubmit={handlePersonalInfoUpdate} className="space-y-6">
        {/* Avatar Section */}
        <AvatarUpload
          personalInfo={personalInfo}
          avatarPreview={avatarPreview}
          avatarFile={avatarFile}
          uploadingAvatar={uploadingAvatar}
          handleAvatarFileChange={handleAvatarFileChange}
          handleAvatarUpload={handleAvatarUpload}
          handleRemoveAvatar={handleRemoveAvatar}
          setAvatarFile={setAvatarFile}
          setAvatarPreview={setAvatarPreview}
        />

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Account Stats */}
        {profile && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Member Since:</span>
                <p className="font-medium">
                  {new Date(profile.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Last Active:</span>
                <p className="font-medium">
                  {new Date(profile.lastActive).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Total Chats:</span>
                <p className="font-medium">{profile.stats?.totalChats || 0}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn bg-[#6b6bec] hover:bg-[#5a5ad4] text-white"
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Updating...
            </>
          ) : (
            avatarPreview ? "Update Personal Info & Profile Picture" : "Update Personal Info"
          )}
        </button>
      </form>
    </div>
  );
};

export default PersonalInfoTab;
