/**
 * Alert messages component for profile page
 * @param {Object} props - Component props
 * @param {string} props.success - Success message
 * @param {string} props.error - Error message
 * @returns {JSX.Element} Alert messages
 */
const AlertMessages = ({ success, error }) => {
  if (!success && !error) return null;

  return (
    <>
      {/* Success Message */}
      {success && (
        <div className="alert alert-success mb-6">
          <span className="material-icons">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-6">
          <span className="material-icons">error</span>
          <span>{error}</span>
        </div>
      )}
    </>
  );
};

export default AlertMessages;
