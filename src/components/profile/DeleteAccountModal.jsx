/**
 * Delete account confirmation modal
 * @param {Object} props - Component props
 * @param {Function} props.confirmDeleteAccount - Confirm account deletion
 * @returns {JSX.Element} Delete account modal
 */
const DeleteAccountModal = ({ confirmDeleteAccount }) => {
  return (
    <dialog id="delete_account_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-red-600">Delete Account</h3>
        <p className="py-4">
          Are you sure you want to delete your account? This action cannot be undone and will permanently delete:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
          <li>All your conversations and chat history</li>
          <li>Your personal preferences and settings</li>
          <li>All stored memories and AI learning data</li>
          <li>Your subscription and billing information</li>
        </ul>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Cancel</button>
          </form>
          <button
            className="btn btn-error"
            onClick={confirmDeleteAccount}
          >
            <span className="material-icons mr-2">delete_forever</span>
            Delete My Account
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default DeleteAccountModal;
