import React from 'react';
import PolarChart from './PolarChart';

/**
 * Test component to verify PolarChart functionality
 * This can be used for manual testing and development
 */
const PolarChartTest = () => {
  // Real test data (no sample/fake data)
  const testData = [];

  const emptyData = [];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">PolarChart Component Test</h1>

      {/* Test with real data */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Chart with Real Data</h2>
          <PolarChart
            data={testData}
            title="Real AI Learning Progress"
          />
        </div>
      </div>

      {/* Test with empty data */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Chart with Empty Data</h2>
          <PolarChart
            data={emptyData}
            title="Empty Data Test"
          />
        </div>
      </div>

      {/* Test without title */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Chart without Title</h2>
          <PolarChart
            data={testData}
          />
        </div>
      </div>
    </div>
  );
};

export default PolarChartTest;
