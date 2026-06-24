import React, { useState } from 'react';
import { ArrowLeft, Brain, AlertTriangle, ShieldCheck, Thermometer, CloudRain, Droplets } from 'lucide-react';

interface AIPredictionPageProps {
  onBack: () => void;
}

export default function AIPredictionPage({ onBack }: AIPredictionPageProps) {
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  const riskFactors = [
    { name: 'Temperature Index', value: '29.5°C', status: 'Elevated Risk', icon: <Thermometer size={18} color="#f59e0b" /> },
    { name: 'Weekly Precipitation', value: '342 mm', status: 'High breeding potential', icon: <CloudRain size={18} color="#ef4444" /> },
    { name: 'Humidity Level', value: '82%', status: 'Optimal mosquito survival', icon: <Droplets size={18} color="#00e5c3" /> },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Dashboard
        </button>
        <h1 style={styles.title}>AI Outbreak Prediction Alert</h1>
      </header>

      <main style={styles.main}>
        {/* Risk Banner */}
        <div style={{
          ...styles.riskBanner,
          borderColor: acknowledged ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          background: acknowledged ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(0, 229, 195, 0.08) 100%)' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)'
        }}>
          <div style={styles.bannerHeader}>
            <div style={styles.riskBadge}>
              <Brain size={24} color={acknowledged ? '#10b981' : '#ef4444'} />
              <div>
                <div style={styles.riskLabel}>Predictive Risk Level</div>
                <div style={{ ...styles.riskValue, color: acknowledged ? '#10b981' : '#ef4444' }}>
                  {acknowledged ? 'PREPARED & ACTIVE' : 'HIGH CRITICAL RISK'}
                </div>
              </div>
            </div>
            <span style={{
              ...styles.statusBadge,
              color: acknowledged ? '#10b981' : '#ef4444',
              backgroundColor: acknowledged ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
            }}>
              {acknowledged ? 'Preparedness Verified' : 'Action Required'}
            </span>
          </div>
          <p style={styles.bannerDesc}>
            AI epidemiological model predicts a <strong>+82% likelihood</strong> of dengue outbreak spike in your health service district within the next <strong>10 to 14 days</strong>, triggered by recent monsoon rainfall and temperature indices.
          </p>
        </div>

        {/* Environmental Parameter Grid */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Environmental Outbreak Indicators</h2>
          <div style={styles.indicatorGrid}>
            {riskFactors.map((factor) => (
              <div key={factor.name} style={styles.factorCard}>
                <div style={styles.factorHeader}>
                  {factor.icon}
                  <span style={styles.factorName}>{factor.name}</span>
                </div>
                <div style={styles.factorValue}>{factor.value}</div>
                <div style={styles.factorStatus}>{factor.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Action Plan */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recommended Preparedness Protocol</h2>
          <div style={styles.protocolList}>
            <div style={styles.protocolItem}>
              <div style={styles.bulletNumber}>1</div>
              <div>
                <h4 style={styles.protocolHeader}>Expand Ward Allocation</h4>
                <p style={styles.protocolText}>Set aside an additional 15-20 beds specifically designated for acute dengue care. Install insecticide-treated mosquito nets over all ward beds immediately.</p>
              </div>
            </div>
            <div style={styles.protocolItem}>
              <div style={styles.bulletNumber}>2</div>
              <div>
                <h4 style={styles.protocolHeader}>Verify Blood Bank Reserve</h4>
                <p style={styles.protocolText}>Ensure platelet counts and critical blood group bags (especially group O) are at maximum targets to support hemorrhage cases.</p>
              </div>
            </div>
            <div style={styles.protocolItem}>
              <div style={styles.bulletNumber}>3</div>
              <div>
                <h4 style={styles.protocolHeader}>Audit Diagnostic Supplies</h4>
                <p style={styles.protocolText}>Stockpile Dengue NS1 antigen and IgM/IgG rapid test kits. Current stock should support at least 150 presentations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actionsBar}>
          {!acknowledged ? (
            <button style={styles.actionBtn} onClick={() => setAcknowledged(true)}>
              <AlertTriangle size={18} />
              Acknowledge & Deploy Preparedness Protocol
            </button>
          ) : (
            <div style={styles.successMessage}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Preparedness protocol initiated. Hospital response team has been notified.</span>
            </div>
          )}
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
    paddingBottom: '80px',
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
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
  },
  main: {
    padding: '40px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  riskBanner: {
    border: '1px solid',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '35px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  bannerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  riskLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  riskValue: {
    fontSize: '20px',
    fontWeight: '800',
    marginTop: '2px',
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '6px',
  },
  bannerDesc: {
    fontSize: '15px',
    color: '#e2e8f0',
    lineHeight: 1.6,
    margin: 0,
  },
  section: {
    marginBottom: '35px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px',
  },
  indicatorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  factorCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '20px',
  },
  factorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  factorName: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  factorValue: {
    fontSize: '24px',
    fontWeight: '700',
    marginTop: '12px',
    color: '#ffffff',
  },
  factorStatus: {
    fontSize: '12px',
    color: '#cbd5e1',
    marginTop: '4px',
  },
  protocolList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  protocolItem: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
  },
  bulletNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 229, 195, 0.1)',
    color: '#00e5c3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    flexShrink: 0,
  },
  protocolHeader: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
  },
  protocolText: {
    fontSize: '13.5px',
    color: '#94a3b8',
    lineHeight: 1.6,
    margin: '6px 0 0 0',
  },
  actionsBar: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '24px',
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'center',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 28px',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 24px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '8px',
    color: '#10b981',
    fontSize: '14.5px',
    fontWeight: '500',
  },
};
