import React, { useEffect, useState } from 'react';
import { LogOut, Stethoscope, Bed, AlertCircle, Users, Droplet, Plus, Minus, Brain, MessageSquare, Package } from 'lucide-react';
import AIPredictionPage from './pages/hospital/AIPredictionPage';
import BloodInventoryPage from './pages/hospital/BloodInventoryPage';
import AlertsMessagesPage from './pages/hospital/AlertsMessagesPage';
import WardSuppliesPage from './pages/hospital/WardSuppliesPage';
import { hospitalService } from './services/hospitalService';

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

  const [bloodStock, setBloodStock] = useState([
    { group: 'A+', units: 45, max: 60 },
    { group: 'A-', units: 12, max: 20 },
    { group: 'B+', units: 38, max: 50 },
    { group: 'B-', units: 8, max: 20 },
    { group: 'AB+', units: 25, max: 30 },
    { group: 'AB-', units: 4, max: 10 },
    { group: 'O+', units: 55, max: 70 },
    { group: 'O-', units: 18, max: 30 },
  ]);

  const [subView, setSubView] = useState<'main' | 'ai-prediction' | 'blood-inventory' | 'alerts-messages' | 'ward-supplies'>('main');

  useEffect(() => {
    hospitalService.getBloodStock()
      .then(data => {
        if (data && data.length > 0) {
          setBloodStock(data.map(d => ({ group: d.group, units: d.units, max: d.max })));
        }
      })
      .catch(console.error);
  }, [subView]); // reload when returning to dashboard main view

  const handleAdjustStock = (group: string, delta: number) => {
    hospitalService.adjustBloodStock(group, delta)
      .then(updated => {
        setBloodStock(prev => prev.map(item => item.group === group ? { group: updated.group, units: updated.units, max: updated.max } : item));
      })
      .catch(console.error);
  };

  if (subView === 'ai-prediction') {
    return <AIPredictionPage onBack={() => setSubView('main')} />;
  }

  if (subView === 'blood-inventory') {
    return <BloodInventoryPage onBack={() => setSubView('main')} />;
  }

  if (subView === 'alerts-messages') {
    return <AlertsMessagesPage onBack={() => setSubView('main')} user={user} />;
  }

  if (subView === 'ward-supplies') {
    return <WardSuppliesPage onBack={() => setSubView('main')} />;
  }

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
            <div style={{...styles.statIcon, backgroundColor: 'rgba(59, 130, 246, 0.1)'}}>
              <Bed size={24} color="#3b82f6" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Beds</p>
              <h3 style={styles.statValue}>{stats.totalBeds}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: 'rgba(239, 68, 68, 0.1)'}}>
              <AlertCircle size={24} color="#ef4444" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Occupied Beds</p>
              <h3 style={styles.statValue}>{stats.occupiedBeds}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: 'rgba(34, 197, 94, 0.1)'}}>
              <Users size={24} color="#22c55e" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Patients</p>
              <h3 style={styles.statValue}>{stats.patients}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: 'rgba(168, 85, 247, 0.1)'}}>
              <Stethoscope size={24} color="#a855f7" />
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Doctors</p>
              <h3 style={styles.statValue}>{stats.doctors}</h3>
            </div>
          </div>
        </div>

        {/* Blood Bank Storage */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Blood Bank Storage</h2>
          <div style={styles.bloodGrid}>
            {bloodStock.map((item) => {
              const ratio = item.units / item.max;
              let status = 'Optimal';
              let statusColor = '#10b981';
              let bgLight = 'rgba(16, 185, 129, 0.1)';
              
              if (ratio <= 0.25) {
                status = 'Critical';
                statusColor = '#ef4444';
                bgLight = 'rgba(239, 68, 68, 0.1)';
              } else if (ratio <= 0.5) {
                status = 'Low';
                statusColor = '#f59e0b';
                bgLight = 'rgba(245, 158, 11, 0.1)';
              }

              return (
                <div key={item.group} style={styles.bloodCard}>
                  <div style={styles.bloodCardHeader}>
                    <div style={{ ...styles.bloodIconBox, backgroundColor: bgLight }}>
                      <Droplet size={18} color={statusColor} fill={statusColor} />
                      <span style={{ ...styles.bloodGroup, color: statusColor }}>{item.group}</span>
                    </div>
                    <span style={{ ...styles.bloodStatusBadge, color: statusColor, backgroundColor: bgLight }}>
                      {status}
                    </span>
                  </div>
                  
                  <div style={styles.bloodInfoRow}>
                    <div>
                      <span style={styles.bloodStockLabel}>Current Stock</span>
                      <div style={styles.bloodStockValue}>
                        {item.units} <span style={styles.bloodUnitSub}>Bags</span>
                      </div>
                    </div>
                    <div style={styles.controlButtons}>
                      <button 
                        onClick={() => handleAdjustStock(item.group, -1)} 
                        style={styles.adjustBtn} 
                        title="Decrease Stock"
                      >
                        <Minus size={12} />
                      </button>
                      <button 
                        onClick={() => handleAdjustStock(item.group, 1)} 
                        style={styles.adjustBtn} 
                        title="Increase Stock"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={styles.progressBarOuter}>
                    <div 
                      style={{ 
                        ...styles.progressBarInner, 
                        width: `${(ratio * 100).toFixed(0)}%`, 
                        backgroundColor: statusColor 
                      }} 
                    />
                  </div>
                  <div style={styles.bloodProgressLabel}>
                    <span>{((ratio * 100)).toFixed(0)}% capacity</span>
                    <span>Max: {item.max} bags</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hospital Operations */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Hospital Operations</h2>
          <div style={styles.actionGrid}>
            <button onClick={() => setSubView('ai-prediction')} style={styles.actionBtn}>
              <Brain size={20} color="#00e5c3" />
              <span>AI Prediction Alert</span>
            </button>
            <button onClick={() => setSubView('blood-inventory')} style={styles.actionBtn}>
              <Droplet size={20} color="#ef4444" fill="#ef4444" />
              <span>Blood Bank Inventory</span>
            </button>
            <button onClick={() => setSubView('alerts-messages')} style={styles.actionBtn}>
              <MessageSquare size={20} color="#3b82f6" />
              <span>Alerts & Messages</span>
            </button>
            <button onClick={() => setSubView('ward-supplies')} style={styles.actionBtn}>
              <Package size={20} color="#a855f7" />
              <span>Dengue Ward Supplies</span>
            </button>
          </div>
        </div>

        {/* Department Status removed as per requirements */}
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
  bloodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '40px',
  },
  bloodCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '20px',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  bloodCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bloodIconBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px',
    borderRadius: '8px',
  },
  bloodGroup: {
    fontWeight: '700',
    fontSize: '16px',
  },
  bloodStatusBadge: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.04em',
  },
  bloodInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bloodStockLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  bloodStockValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginTop: '2px',
  },
  bloodUnitSub: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: 'normal',
  },
  controlButtons: {
    display: 'flex',
    gap: '6px',
  },
  adjustBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  progressBarOuter: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  bloodProgressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#64748b',
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
  // Department Status styles removed as per requirements
};
