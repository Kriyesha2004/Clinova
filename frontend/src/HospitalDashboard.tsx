import React, { useState } from 'react';
import { LogOut, Stethoscope, Bed, AlertCircle, Users } from 'lucide-react';

interface HospitalDashboardProps {
  user: { id: string; name: string; email: string };
  onLogout?: () => void;
}

export default function HospitalDashboard({ user, onLogout }: HospitalDashboardProps) {
  const [stats] = useState({
    totalBeds: 250,
    occupiedBeds: 180,
    patients: 520,
    doctors: 85,
  });

  const occupancyRate = ((stats.occupiedBeds / stats.totalBeds) * 100).toFixed(1);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Hospital Dashboard</h1>
          <p style={styles.subtitle}>Hospital Management System</p>
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
            <div style={styles.statIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <Bed size={24} color="#3b82f6" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Beds</p>
              <h3 style={styles.statValue}>{stats.totalBeds}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertCircle size={24} color="#ef4444" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Occupied Beds</p>
              <h3 style={styles.statValue}>{stats.occupiedBeds}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <Users size={24} color="#22c55e" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Patients</p>
              <h3 style={styles.statValue}>{stats.patients}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
              <Stethoscope size={24} color="#a855f7" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Doctors</p>
              <h3 style={styles.statValue}>{stats.doctors}</h3>
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div style={styles.occupancyCard}>
          <h3 style={styles.occupancyTitle}>Bed Occupancy Rate</h3>
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${occupancyRate}%`,
                }}
              />
            </div>
            <span style={styles.occupancyPercent}>{occupancyRate}%</span>
          </div>
        </div>

        {/* Hospital Operations */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Hospital Operations</h2>
          <div style={styles.actionGrid}>
            <button style={styles.actionBtn}>
              <Stethoscope size={20} />
              <span>Patient Management</span>
            </button>
            <button style={styles.actionBtn}>
              <Bed size={20} />
              <span>Ward Management</span>
            </button>
            <button style={styles.actionBtn}>
              <Users size={20} />
              <span>Staff Directory</span>
            </button>
            <button style={styles.actionBtn}>
              <AlertCircle size={20} />
              <span>Emergency Alerts</span>
            </button>
          </div>
        </div>

        {/* Department Status */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Department Status</h2>
          <div style={styles.departmentList}>
            {['Emergency', 'ICU', 'Cardiology', 'Orthopedics', 'Pediatrics'].map((dept) => (
              <div key={dept} style={styles.departmentItem}>
                <span style={styles.deptName}>{dept}</span>
                <span style={styles.deptStatus}>Operational</span>
              </div>
            ))}
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
  occupancyCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '40px',
    backdropFilter: 'blur(10px)',
  },
  occupancyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    color: '#ffffff',
  },
  progressContainer: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00f2fe, #2dd4bf)',
    borderRadius: '6px',
    transition: 'width 0.3s ease',
  },
  occupancyPercent: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    minWidth: '60px',
    textAlign: 'right',
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
  departmentList: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  departmentItem: {
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deptName: {
    fontSize: '14px',
    color: '#e2e8f0',
    fontWeight: '500',
  },
  deptStatus: {
    fontSize: '12px',
    color: '#22c55e',
    fontWeight: '600',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: '4px 12px',
    borderRadius: '6px',
  },
};
