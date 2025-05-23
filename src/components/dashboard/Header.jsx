export default function Header() {
  return (
    <header className="navbar bg-base-100 shadow-md sticky top-0 z-20">
      <div className="flex-1 text-lg font-semibold">Yunia AI Dashboard</div>
      <div className="flex-none gap-2">
        <button className="btn btn-ghost btn-circle">
          <span className="material-icons">notifications</span>
        </button>
        <div className="avatar">
          <div className="w-8 rounded-full">
            <img src="https://i.pravatar.cc/40" alt="user" />
          </div>
        </div>
      </div>
    </header>
  );
}