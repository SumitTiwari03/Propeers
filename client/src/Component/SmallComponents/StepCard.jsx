import React from 'react';

const StepCard = ({ stepNumber, title, description }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <div className="text-primary font-bold text-2xl">{stepNumber}</div>
      <h4 className="text-lg font-bold mt-2">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
};

export default StepCard;
