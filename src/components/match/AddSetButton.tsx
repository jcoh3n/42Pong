import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface AddSetButtonProps {
  onClick: () => void;
}

/**
 * Composant pour le bouton d'ajout de set
 */
const AddSetButton: React.FC<AddSetButtonProps> = ({ onClick }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '-50px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 5,
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <button
        style={{
          padding: '10px 20px',
          borderRadius: '10px',
          backgroundColor: '#1a56db',
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onClick={onClick}
      >
        <FaPlus style={{ fontSize: '14px' }} />
        Ajouter un set
      </button>
    </div>
  );
};

export default AddSetButton; 