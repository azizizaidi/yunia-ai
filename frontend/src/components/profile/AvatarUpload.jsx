/**
 * Avatar upload component
 * @param {Object} props - Component props
 * @param {Object} props.personalInfo - Personal information object
 * @param {string} props.avatarPreview - Avatar preview URL
 * @param {File} props.avatarFile - Selected avatar file
 * @param {boolean} props.uploadingAvatar - Avatar uploading state
 * @param {Function} props.handleAvatarFileChange - Handle avatar file selection
 * @param {Function} props.handleAvatarUpload - Handle avatar upload
 * @param {Function} props.handleRemoveAvatar - Handle avatar removal
 * @param {Function} props.setAvatarFile - Set avatar file
 * @param {Function} props.setAvatarPreview - Set avatar preview
 * @returns {JSX.Element} Avatar upload component
 */
const AvatarUpload = ({
  personalInfo,
  avatarPreview,
  avatarFile,
  uploadingAvatar,
  handleAvatarFileChange,
  handleAvatarUpload,
  handleRemoveAvatar,
  setAvatarFile,
  setAvatarPreview
}) => {
  return (
    <div className="flex items-start space-x-6">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
          <img
            src={avatarPreview || personalInfo.avatar || `https://i.pravatar.cc/96?u=${personalInfo.email}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {personalInfo.avatar && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            className="text-xs text-red-600 hover:text-red-800 mt-2"
          >
            Remove Photo
          </button>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Profile Picture</h3>

        {/* File Upload */}
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarFileChange}
            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
          />

          {avatarFile && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="btn btn-sm bg-[#6b6bec] hover:bg-[#5a5ad4] text-white"
                >
                  {uploadingAvatar ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Uploading...
                    </>
                  ) : (
                    "Upload Now"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                  className="btn btn-sm btn-outline"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-blue-600">
                💡 You can upload now or save with the form below
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Upload a photo (JPG, PNG, GIF) up to 5MB. Recommended size: 200x200px
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
