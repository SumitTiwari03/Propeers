import React from 'react';

const DeveloperCard = ({ name, profileImage, description }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg text-center">
      <img
        src={profileImage}
        alt={name}
        className="w-16 h-16 rounded-full mx-auto mb-2"
      />
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default DeveloperCard;
