import React from 'react';
import { FileText } from 'lucide-react';

interface ViewReportsProps {
  onClick?: () => void;
  isFullPage?: boolean;
}

export default function ViewReports({ onClick, isFullPage = false }: ViewReportsProps) {
  if (isFullPage) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>View Reports</h1>
        <p style={styles.description}>Access and view all health reports and surveillance data.</p>
        <div style={styles.content}>
          <FileText size={48} color="#00e5c3" />
          <p style={styles.placeholder}>Reports will be displayed here</p>
        </div>
      </div>
    );
  }

  return (
    <button onClick={onClick} style={styles.actionBtn}>
      <FileText size={20} />
      <span>View Reports</span>
    </button>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    color: '#ffffff',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#ffffff',
  },
  description: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '30px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    gap: '20px',
  },
  placeholder: {
    fontSize: '16px',
    color: '#64748b',
  },
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
