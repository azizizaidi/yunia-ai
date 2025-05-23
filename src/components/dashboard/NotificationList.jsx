export default function NotificationList() {
  const notifications = [
    { msg: "Anda ada tugas baru.", time: "5 minit lepas" },
    { msg: "Sesi coaching 3PM hari ini.", time: "1 jam lepas" },
    { msg: "Pembayaran langganan berjaya.", time: "2 hari lepas" },
  ];
  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <div className="font-bold text-lg mb-2">Notifikasi</div>
      <ul>
        {notifications.map((n, idx) => (
          <li key={idx} className="mb-3 last:mb-0">
            <div className="flex items-center gap-2">
              <span className="badge badge-info">!</span>
              <span>{n.msg}</span>
            </div>
            <div className="text-xs text-gray-400 ml-6">{n.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
