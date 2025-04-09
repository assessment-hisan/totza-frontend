import React from 'react';

const Reports = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Monthly Report</h3>
          {/* Insert your charts or summary components here */}
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Category-wise Breakdown</h3>
          {/* Insert chart or breakdown view */}
        </div>
      </div>
    </div>
  );
};

export default Reports;
