import React from 'react';

const ProgressBar = ({ current, target }) => {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
      <div
        className="bg-green-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
