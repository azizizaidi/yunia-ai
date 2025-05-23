import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";

const menu = [
  { label: "Dashboard", to: "/dashboard", icon: "📊" },
  { label: "Profile", to: "/profile", icon: "👤" },
  { label: "Settings", to: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const navigate = useNavigate();

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
    document.getElementById('logout_modal_sidebar').showModal();
  };

  return (
    <aside className="h-screen w-64 bg-base-200 shadow-lg flex flex-col fixed z-10">
      <div className="p-4 text-2xl font-bold">🧠 Yunia AI</div>
      <ul className="menu p-2 flex-1">
        {menu.map(item => (
          <li key={item.label}>
            <Link to={item.to}>
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-4">
        <button
          className="btn btn-error btn-sm w-full"
          onClick={showLogoutModal}
        >
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <dialog id="logout_modal_sidebar" className="modal">
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
    </aside>
  );
}