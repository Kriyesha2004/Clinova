import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertsProps {
  onClick?: () => void;
}

export default function Alerts({ onClick }: AlertsProps) {
  return (
    <button onClick={onClick} style={styles.actionBtn}>
      <AlertCircle size={20} />
      <span>Alerts</span>
    </button>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  actionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '24px',
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
};
