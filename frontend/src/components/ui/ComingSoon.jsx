/**
 * ComingSoon component - Reusable coming soon card for MVP features
 * @param {Object} props - Component props
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @param {string} props.icon - Material icon name
 * @param {Array} props.features - Array of feature items
 * @returns {JSX.Element} Coming soon component
 */
const ComingSoon = ({ title, description, icon, features = [] }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body text-center">
        <div className="mb-4">
          <span className={`material-icons text-6xl text-primary`}>
            {icon}
          </span>
        </div>
        <h2 className="card-title justify-center text-2xl mb-4">
          {title}
        </h2>
        <p className="text-base-content/70 mb-6">
          {description}
        </p>
        
        {features.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="material-icons text-success">
                  {feature.icon || 'check_circle'}
                </span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="badge badge-primary badge-lg">
          MVP Feature - Coming Soon
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
