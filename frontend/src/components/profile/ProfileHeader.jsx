/**
 * Profile header component
 * @returns {JSX.Element} Profile header
 */
const ProfileHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-3 text-gray-900">Profile Settings</h1>
      <p className="text-gray-600">
        Manage your account information, security settings, and preferences
      </p>
    </div>
  );
};

export default ProfileHeader;
