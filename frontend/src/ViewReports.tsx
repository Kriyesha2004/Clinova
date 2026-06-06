import React from 'react';
import { FileText } from 'lucide-react';

interface ViewReportsProps {
  onClick?: () => void;
}

export default function ViewReports({ onClick }: ViewReportsProps) {
  return (
    <button onClick={onClick} style={styles.actionBtn}>
      <FileText size={20} />
      <span>View Reports</span>
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
