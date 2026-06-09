import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';

interface AccessControlPageProps {
  onBack: () => void;
}

export default function AccessControlPage({ onBack }: AccessControlPageProps) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 style={styles.title}>Access Control</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.card}>
            <Lock size={48} color="#22c55e" />
            <h2 style={styles.heading}>Access Control Management</h2>
            <p style={styles.description}>Manage user access and permissions</p>
            
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Active Users</h3>
              <div style={styles.list}>
                <div style={styles.userItem}>
                  <span style={styles.userName}>Dr. Smith</span>
                  <span style={styles.role}>Administrator</span>
                </div>
                <div style={styles.userItem}>
                  <span style={styles.userName}>Dr. Johnson</span>
                  <span style={styles.role}>Editor</span>
                </div>
                <div style={styles.userItem}>
                  <span style={styles.userName}>Nurse Brown</span>
                  <span style={styles.role}>Viewer</span>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Permissions</h3>
              <div style={styles.permissionList}>
                <div style={styles.permission}>
                  <input type="checkbox" defaultChecked />
                  <span>Read Access</span>
                </div>
                <div style={styles.permission}>
                  <input type="checkbox" defaultChecked />
                  <span>Write Access</span>
                </div>
                <div style={styles.permission}>
                  <input type="checkbox" />
                  <span>Delete Access</span>
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
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  userItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
  },
  userName: {
    fontWeight: '500',
  },
  role: {
    color: '#94a3b8',
    fontSize: '12px',
  },
  permissionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  permission: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    borderRadius: '8px',
  },
};
