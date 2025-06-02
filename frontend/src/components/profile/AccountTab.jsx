/**
 * Account tab component for account management
 * @param {Object} props - Component props
 * @param {Object} props.profile - User profile object
 * @param {Function} props.handleDeleteAccount - Handle account deletion
 * @returns {JSX.Element} Account tab
 */
const AccountTab = ({ profile, handleDeleteAccount }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Account Management</h2>

      <div className="space-y-8">
        {/* Account Overview */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Account Status</h4>
              <span className="badge badge-success">Active</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Account Type</h4>
              <span className="text-gray-900">Free Plan</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Data Storage</h4>
              <span className="text-gray-900">
                {profile?.stats?.totalChats || 0} conversations stored
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Last Backup</h4>
              <span className="text-gray-900">Auto-saved locally</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 rounded-lg p-6 bg-red-50">
          <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
          <p className="text-red-700 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="btn btn-error"
          >
            <span className="material-icons mr-2">delete_forever</span>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
