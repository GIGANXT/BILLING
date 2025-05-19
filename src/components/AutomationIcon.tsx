import React from 'react';
import automationImage from '../assets/icons/automation.svg';

interface AutomationIconProps {
  className?: string;
}

const AutomationIcon: React.FC<AutomationIconProps> = ({ className }) => {
  return (
    <img 
      src={automationImage} 
      alt="Workflow Automation" 
      className={className}
      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
    />
  );
};

export default AutomationIcon;