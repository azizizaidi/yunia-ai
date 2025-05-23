export default function Button({ children, ...props }) {
  return (
    <button
      className="badge badge-primary"
      {...props}
    >
      {children}
    </button>
  );
}
