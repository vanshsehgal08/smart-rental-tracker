import React from 'react';

interface EquipmentCardProps {
  id: string;
  type: string;
  site: string;
  status: string;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ id, type, site, status }) => {
  return (
    <div className="border rounded p-4 shadow">
      <h2 className="font-bold">{type} ({id})</h2>
      <p>Site: {site}</p>
      <p>Status: {status}</p>
    </div>
  );
};

export default EquipmentCard;
