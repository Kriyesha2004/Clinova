import React, { useState } from 'react';
import { LogOut, BarChart3, Users, AlertCircle } from 'lucide-react';
import AIAnalytics from './AIAnalytics';
import ViewReports from './ViewReports';
import Alerts from './MohAlerts';

interface MOHDashboardProps {
  user: { id: string; name: string; email: string };
  onLogout?: () => void;
  setCurrentView?: (view: 'home' | 'login' | 'moh' | 'phi' | 'hospital' | 'ai-analytics' | 'view-reports' | 'alerts') => void;
}

export default function MOHDashboard({ user, onLogout, setCurrentView }: MOHDashboardProps) {
  const [stats] = useState({
    totalHealthCenters: 145,
    activeCampaigns: 12,
    population: 2500000,
    vaccinated: 1850000,
  });

  const handleAIAnalytics = () => {
    console.log('Navigating to AI Analytics');
    if (setCurrentView) {
      setCurrentView('ai-analytics');
    } else {
      alert('AI Analytics feature coming soon!');
    }
  };

  const handleViewReports = () => {
    console.log('Navigating to View Reports');
    if (setCurrentView) {
      setCurrentView('view-reports');
    } else {
      alert('View Reports feature coming soon!');
    }
  };

  const handleAlerts = () => {
    console.log('Navigating to Alerts');
    if (setCurrentView) {
      setCurrentView('alerts');
    } else {
      alert('Alerts feature coming soon!');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>MOH Dashboard</h1>
          <p style={styles.subtitle}>Ministry of Health Management System</p>
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
            <div style={{...styles.statIcon, backgroundColor: 'rgba(0, 242, 254, 0.1)'}}>
              <Users size={24} color="#00f2fe" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Health Centers</p>
              <h3 style={styles.statValue}>{stats.totalHealthCenters}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: 'rgba(45, 212, 191, 0.1)'}}>
              <BarChart3 size={24} color="#2dd4bf" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Active Campaigns</p>
              <h3 style={styles.statValue}>{stats.activeCampaigns}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: 'rgba(34, 197, 94, 0.1)'}}>
              <Users size={24} color="#22c55e" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Population</p>
              <h3 style={styles.statValue}>{(stats.population / 1000000).toFixed(1)}M</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: 'rgba(59, 130, 246, 0.1)'}}>
              <AlertCircle size={24} color="#3b82f6" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Vaccination Rate</p>
              <h3 style={styles.statValue}>{((stats.vaccinated / stats.population) * 100).toFixed(1)}%</h3>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionGrid}>
            <AIAnalytics onClick={handleAIAnalytics} />
            <ViewReports onClick={handleViewReports} />
            <Alerts onClick={handleAlerts} />
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
