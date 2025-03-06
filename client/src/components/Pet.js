import React from 'react';
import './Pet.css';

const Pet = ({ user, goals, message, animate }) => {
  const petType = user?.petType || 'dog';
  const petImage = `/assets/${petType}.png`;

  return (
    <div className="pet card">
      <h3>Your Pet Companion</h3>
      <div className="pet-container">
        <img src={petImage} alt={petType} className={`pet-image ${animate ? 'animate-bounce' : ''}`} />
        <div className="speech-bubble animate-pop">
          <p>{petType.charAt(0).toUpperCase() + petType.slice(1)} says: "{message}"</p>
        </div>
      </div>
    </div>
  );
};

export default Pet;