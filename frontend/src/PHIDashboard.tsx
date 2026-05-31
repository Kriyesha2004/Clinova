import React, { useState } from 'react';
import { LogOut, Shield, FileText, AlertCircle, Lock } from 'lucide-react';

interface PHIDashboardProps {
  user: { id: string; name: string; email: string };
  onLogout?: () => void;
}

export default function PHIDashboard({ user, onLogout }: PHIDashboardProps) {
  const [stats] = useState({
    totalRecords: 8500,
    encryptedFiles: 8500,
    accessRequests: 45,
    complianceRate: 99.8,
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>PHI Dashboard</h1>
          <p style={styles.subtitle}>Protected Health Information Management</p>
        </div>
        <div style={styles.userSection}>
          <span style={styles.userName}>{user.name}</span>
          <button onClick={onLogout} style={styles.logoutBtn}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.statsGrid}>
          {/* Stats Cards */}
          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
              <FileText size={24} color="#a855f7" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Records</p>
              <h3 style={styles.statValue}>{stats.totalRecords.toLocaleString()}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <Lock size={24} color="#22c55e" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Encrypted Files</p>
              <h3 style={styles.statValue}>{stats.encryptedFiles.toLocaleString()}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <AlertCircle size={24} color="#3b82f6" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Access Requests</p>
              <h3 style={styles.statValue}>{stats.accessRequests}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: 'rgba(0, 242, 254, 0.1)' }}>
              <Shield size={24} color="#00f2fe" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Compliance Rate</p>
              <h3 style={styles.statValue}>{stats.complianceRate}%</h3>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Security & Compliance</h2>
          <div style={styles.actionGrid}>
            <button style={styles.actionBtn}>
              <Shield size={20} />
              <span>Data Protection</span>
            </button>
            <button style={styles.actionBtn}>
              <Lock size={20} />
              <span>Access Control</span>
            </button>
            <button style={styles.actionBtn}>
              <FileText size={20} />
              <span>Audit Logs</span>
            </button>
            <button style={styles.actionBtn}>
              <AlertCircle size={20} />
              <span>Compliance Reports</span>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Activities</h2>
          <div style={styles.activityList}>
            <div style={styles.activityItem}>
              <span style={styles.activityTime}>10:30 AM</span>
              <span style={styles.activityText}>New access request from Dr. Smith</span>
            </div>
            <div style={styles.activityItem}>
              <span style={styles.activityTime}>09:15 AM</span>
              <span style={styles.activityText}>File encryption completed for batch 5</span>
            </div>
            <div style={styles.activityItem}>
              <span style={styles.activityTime}>08:45 AM</span>
              <span style={styles.activityText}>Compliance audit passed</span>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userName: {
    fontSize: '14px',
    color: '#cbd5e1',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  main: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: '0 0 8px 0',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#ffffff',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#ffffff',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '40px',
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
  activityList: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  activityItem: {
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    gap: '20px',
  },
  activityTime: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500',
    minWidth: '80px',
  },
  activityText: {
    fontSize: '14px',
    color: '#e2e8f0',
  },
};
