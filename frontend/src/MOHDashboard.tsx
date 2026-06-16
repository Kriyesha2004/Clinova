import React, { useState } from 'react';
import { LogOut, BarChart3, Users, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';
import AIAnalytics from './AIAnalytics';
import ViewReports from './ViewReports';
import MohAlerts from './MohAlerts';
import MessagesList from './components/MessagesList';
import PHIWeeklyReportsPage from './pages/PHIWeeklyReportsPage';

interface MOHDashboardProps {
  user: { id: string; name: string; email: string };
  onLogout?: () => void;
}

export default function MOHDashboard({ user, onLogout }: MOHDashboardProps) {
  const [currentSubView, setCurrentSubView] = useState<'dashboard' | 'ai-analytics' | 'view-reports' | 'alerts' | 'messages' | 'phi-reports'>('dashboard');
  
  const [stats] = useState({
    totalHealthCenters: 145,
    activeCampaigns: 12,
    population: 2500000,
    vaccinated: 1850000,
  });

  const handleAIAnalytics = () => {
    console.log('Navigating to AI Analytics');
    setCurrentSubView('ai-analytics');
  };

  const handleViewReports = () => {
    console.log('Navigating to View Reports');
    setCurrentSubView('view-reports');
  };

  const handleAlerts = () => {
    console.log('Navigating to Alerts');
    setCurrentSubView('alerts');
  };

  const handleWeeklyReports = () => {
    console.log('Navigating to Weekly Reports');
    setCurrentSubView('phi-reports');
  };

  const handleBackToDashboard = () => {
    setCurrentSubView('dashboard');
  };

  // Render sub-views
  if (currentSubView === 'ai-analytics') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#030d16' }}>
        <button 
          onClick={handleBackToDashboard}
          style={{ 
            position: 'fixed', 
            top: '20px', 
            left: '20px', 
            zIndex: 50,
            padding: '10px 20px',
            backgroundColor: 'rgba(0, 229, 195, 0.1)',
            border: '1px solid rgba(0, 229, 195, 0.3)',
            color: '#00e5c3',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <AIAnalytics isFullPage={true} />
      </div>
    );
  }

  if (currentSubView === 'view-reports') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#030d16' }}>
        <button 
          onClick={handleBackToDashboard}
          style={{ 
            position: 'fixed', 
            top: '20px', 
            left: '20px', 
            zIndex: 50,
            padding: '10px 20px',
            backgroundColor: 'rgba(0, 229, 195, 0.1)',
            border: '1px solid rgba(0, 229, 195, 0.3)',
            color: '#00e5c3',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <ViewReports isFullPage={true} />
      </div>
    );
  }

  if (currentSubView === 'alerts') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#030d16' }}>
        <button 
          onClick={handleBackToDashboard}
          style={{ 
            position: 'fixed', 
            top: '20px', 
            left: '20px', 
            zIndex: 50,
            padding: '10px 20px',
            backgroundColor: 'rgba(0, 229, 195, 0.1)',
            border: '1px solid rgba(0, 229, 195, 0.3)',
            color: '#00e5c3',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <MohAlerts isFullPage={true} />
      </div>
    );
  }

  if (currentSubView === 'messages') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#030d16' }}>
        <MessagesList onBack={handleBackToDashboard} />
      </div>
    );
  }

  if (currentSubView === 'phi-reports') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#030d16' }}>
        <PHIWeeklyReportsPage onBack={handleBackToDashboard} />
      </div>
    );
  }

  // Main dashboard view
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
            <MohAlerts onClick={handleAlerts} />
            <button type="button" onClick={handleWeeklyReports} style={styles.actionBtn}>
              <Calendar size={24} color="#00e5c3" />
              <span>PHI Weekly Reports</span>
            </button>
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
