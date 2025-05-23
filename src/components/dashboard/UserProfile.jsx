import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../../services/api";
import { useNavigate } from "react-router-dom";

/**
 * UserProfile component for displaying user information and logout button
 * @returns {JSX.Element} UserProfile component
 */
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    // Logout user
    logoutUser();

    // Add timestamp parameter to ensure login page is not cached
    const timestamp = new Date().getTime();

    // Redirect to login page
    navigate(`/login?t=${timestamp}`, { replace: true });

    // As an additional security measure, we can also set history state
    window.history.pushState(null, "", `/login?t=${timestamp}`);
  };

  const showLogoutModal = () => {
    document.getElementById('logout_modal_profile').showModal();
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Hi, {user.name || "User"} 👋</h2>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
        <button
          className="btn btn-error btn-sm"
          onClick={showLogoutModal}
        >
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <dialog id="logout_modal_profile" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Logout</h3>
          <p className="py-4">Are you sure you want to logout?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
            </form>
            <button
              className="btn btn-error"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default UserProfile;
