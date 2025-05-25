/**
 * Security tab component for password management
 * @param {Object} props - Component props
 * @param {Object} props.passwordForm - Password form object
 * @param {boolean} props.saving - Saving state
 * @param {Function} props.setPasswordForm - Set password form
 * @param {Function} props.handlePasswordChange - Handle password change
 * @returns {JSX.Element} Security tab
 */
const SecurityTab = ({
  passwordForm,
  saving,
  setPasswordForm,
  handlePasswordChange
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Security Settings</h2>

      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
            className="input input-bordered w-full"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            className="input input-bordered w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="btn bg-[#6b6bec] hover:bg-[#5a5ad4] text-white"
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Changing Password...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default SecurityTab;
