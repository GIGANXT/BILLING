import React from 'react';
import backupImage from '../assets/icons/backup.svg';

interface BackupIconProps {
  className?: string;
}

const BackupIcon: React.FC<BackupIconProps> = ({ className }) => {
  return (
    <img 
      src={backupImage} 
      alt="Cloud Backup" 
      className={className}
      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
    />
  );
};

export default BackupIcon;