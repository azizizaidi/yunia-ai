import React from 'react';

const TestComponent = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">Tailwind Test</h2>
      
      {/* Tailwind Classes Test */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">Tailwind Classes</h3>
        <div className="flex space-x-2">
          <div className="bg-red-500 text-white p-2 rounded">Red</div>
          <div className="bg-blue-500 text-white p-2 rounded">Blue</div>
          <div className="bg-green-500 text-white p-2 rounded">Green</div>
          <div className="bg-yellow-500 text-white p-2 rounded">Yellow</div>
          <div className="bg-purple-500 text-white p-2 rounded">Purple</div>
        </div>
      </div>
      
      {/* DaisyUI Components Test */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">DaisyUI Components</h3>
        
        {/* Buttons */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Buttons</h4>
          <div className="flex flex-wrap gap-2">
            <button className="btn">Button</button>
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-accent">Accent</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-link">Link</button>
          </div>
        </div>
        
        {/* Card */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Card</h4>
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Card title</h2>
              <p>This is a card component from DaisyUI</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Action</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alert */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Alert</h4>
          <div className="alert alert-info mb-2">
            <span>Info message</span>
          </div>
          <div className="alert alert-success mb-2">
            <span>Success message</span>
          </div>
          <div className="alert alert-warning mb-2">
            <span>Warning message</span>
          </div>
          <div className="alert alert-error">
            <span>Error message</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
