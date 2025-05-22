export default function Input({ type, value, onChange, placeholder, ...props }) {
  return (
    <input
      className="border px-3 py-2 rounded"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      {...props}
    />
  );
}
