import React from 'react';

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg flex items-center space-x-4">
      <div className="text-primary text-3xl">{icon}</div>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
