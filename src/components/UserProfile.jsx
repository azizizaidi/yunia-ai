import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../services/api";
import Button from "./Button";
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

  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-bold">Hi, {user.name || "User"} 👋</h2>
        <p className="text-gray-600 text-sm">{user.email}</p>
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default UserProfile;
