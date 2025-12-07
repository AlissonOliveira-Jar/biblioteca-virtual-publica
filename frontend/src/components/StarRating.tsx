import { FaStar } from 'react-icons/fa';
import React from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <FaStar
          key={star}
          size={24}
          cursor="pointer"
          color={star <= value ? '#f5c518' : '#ccc'}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
