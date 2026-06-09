import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface ComplianceReportsPageProps {
  onBack: () => void;
}

export default function ComplianceReportsPage({ onBack }: ComplianceReportsPageProps) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 style={styles.title}>Compliance Reports</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.card}>
            <Shield size={48} color="#00f2fe" />
            <h2 style={styles.heading}>Compliance Reports</h2>
            <p style={styles.description}>View compliance status and reports</p>
            
            <div style={styles.reportsGrid}>
              <div style={styles.reportCard}>
                <h3 style={styles.reportTitle}>HIPAA Compliance</h3>
                <div style={styles.complianceStatus}>
                  <span style={{...styles.statusValue, color: '#22c55e'}}>98.5%</span>
                  <span style={styles.statusLabel}>Compliant</span>
                </div>
              </div>
              <div style={styles.reportCard}>
                <h3 style={styles.reportTitle}>Data Encryption</h3>
                <div style={styles.complianceStatus}>
                  <span style={{...styles.statusValue, color: '#22c55e'}}>100%</span>
                  <span style={styles.statusLabel}>Encrypted</span>
                </div>
              </div>
              <div style={styles.reportCard}>
                <h3 style={styles.reportTitle}>Access Audit</h3>
                <div style={styles.complianceStatus}>
                  <span style={{...styles.statusValue, color: '#f59e0b'}}>95.2%</span>
                  <span style={styles.statusLabel}>Reviewed</span>
                </div>
              </div>
              <div style={styles.reportCard}>
                <h3 style={styles.reportTitle}>Security Updates</h3>
                <div style={styles.complianceStatus}>
                  <span style={{...styles.statusValue, color: '#22c55e'}}>99.9%</span>
                  <span style={styles.statusLabel}>Current</span>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Last Report</h3>
              <p style={styles.reportDate}>Generated on: June 8, 2026</p>
              <button style={styles.downloadBtn}>Download Full Report</button>
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
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '30px',
  },
  reportCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '20px',
  },
  reportTitle: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#94a3b8',
    margin: '0 0 12px 0',
  },
  complianceStatus: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statusValue: {
    fontSize: '24px',
    fontWeight: '700',
  },
  statusLabel: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  section: {
    textAlign: 'center',
    marginTop: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  reportDate: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '20px',
  },
  downloadBtn: {
    padding: '10px 24px',
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    border: '1px solid rgba(0, 242, 254, 0.3)',
    borderRadius: '8px',
    color: '#00f2fe',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
};
