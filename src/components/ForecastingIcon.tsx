import React from 'react';
import forecastingImage from '../assets/icons/forecasting.svg'; // Using the SVG image

interface ForecastingIconProps {
  className?: string;
}

const ForecastingIcon: React.FC<ForecastingIconProps> = ({ className }) => {
  return (
    <img 
      src={forecastingImage} 
      alt="Forecasting" 
      className={className}
      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
    />
  );
};

export default ForecastingIcon;