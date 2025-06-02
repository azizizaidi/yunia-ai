const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;
