import React from 'react';
import warehouseImage from '../assets/icons/warehouse.svg';

interface WarehouseIconProps {
  className?: string;
}

const WarehouseIcon: React.FC<WarehouseIconProps> = ({ className }) => {
  return (
    <img 
      src={warehouseImage} 
      alt="Warehouse" 
      className={className}
      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
    />
  );
};

export default WarehouseIcon;