export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md p-4 sm:p-6 bg-base-100 shadow-lg rounded-lg">
        <div className="mb-4 text-xl sm:text-2xl font-bold text-center">🧠 Yunia AI</div>
        {children}
      </div>
    </div>
  );
}