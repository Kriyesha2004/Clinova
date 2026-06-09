import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface PHIAlertsPageProps {
  onBack: () => void;
}

export default function PHIAlertsPage({ onBack }: PHIAlertsPageProps) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 style={styles.title}>Alerts</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.card}>
            <AlertCircle size={48} color="#3b82f6" />
            <h2 style={styles.heading}>PHI Alerts</h2>
            <p style={styles.description}>View and manage system alerts</p>
            
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Recent Alerts</h3>
              <div style={styles.alertList}>
                <div style={{...styles.alertItem, borderLeft: '4px solid #ef4444'}}>
                  <div style={styles.alertHeader}>
                    <span style={{...styles.alertLevel, color: '#ef4444'}}>CRITICAL</span>
                    <span style={styles.alertTime}>2 hours ago</span>
                  </div>
                  <p style={styles.alertMessage}>Unauthorized access attempt detected on User ID: 12345</p>
                </div>
                <div style={{...styles.alertItem, borderLeft: '4px solid #f59e0b'}}>
                  <div style={styles.alertHeader}>
                    <span style={{...styles.alertLevel, color: '#f59e0b'}}>WARNING</span>
                    <span style={styles.alertTime}>5 hours ago</span>
                  </div>
                  <p style={styles.alertMessage}>File access from unusual location detected</p>
                </div>
                <div style={{...styles.alertItem, borderLeft: '4px solid #22c55e'}}>
                  <div style={styles.alertHeader}>
                    <span style={{...styles.alertLevel, color: '#22c55e'}}>INFO</span>
                    <span style={styles.alertTime}>8 hours ago</span>
                  </div>
                  <p style={styles.alertMessage}>System backup completed successfully</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#030d16',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    backgroundColor: 'rgba(10, 25, 41, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backdropFilter: 'blur(10px)',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    color: '#3b82f6',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
  },
  main: {
    padding: '40px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  content: {
    display: 'flex',
    gap: '20px',
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '10px',
    marginTop: '20px',
  },
  description: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '30px',
  },
  section: {
    textAlign: 'left',
    marginTop: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  alertList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  alertItem: {
    padding: '16px',
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    borderRadius: '8px',
  },
  alertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  alertLevel: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  alertTime: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  alertMessage: {
    fontSize: '14px',
    margin: '8px 0 0 0',
    lineHeight: '1.5',
  },
};
