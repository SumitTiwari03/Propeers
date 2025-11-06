import React from 'react';

const TestimonialCard = ({ testimonial, name, designation, profileImage }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <p className="italic text-gray-600">"{testimonial}"</p>
      <div className="flex items-center mt-4">
        <img
          src={profileImage}
          alt={name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-sm font-bold">{name}</h4>
          <p className="text-xs text-gray-500">{designation}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
