import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Loader, MessageSquare } from 'lucide-react';
import { alertService } from '../services/alertService';
import ChatBox from '../components/ChatBox';

interface PHIAlertsPageProps {
  onBack: () => void;
}

export default function PHIAlertsPage({ onBack }: PHIAlertsPageProps) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await alertService.getAllAlerts();
        setAlerts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load alerts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Refresh alerts every 10 seconds
    const interval = setInterval(fetchAlerts, 10000);
    
    return () => clearInterval(interval);
  }, []);
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
              {loading && (
                <div style={styles.loadingContainer}>
                  <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  <p style={styles.loadingText}>Loading alerts...</p>
                </div>
              )}
              {error && (
                <div style={styles.errorContainer}>
                  <p style={styles.errorText}>{error}</p>
                </div>
              )}
              {!loading && alerts.length === 0 && (
                <p style={styles.noAlerts}>No alerts at the moment</p>
              )}
              <div style={styles.alertList}>
                {alerts.map((alert: any) => (
                  <div
                    key={alert._id}
                    style={{
                      ...styles.alertItem,
                      borderLeft: `4px solid ${
                        alert.level === 'CRITICAL'
                          ? '#ef4444'
                          : alert.level === 'WARNING'
                          ? '#f59e0b'
                          : '#22c55e'
                      }`,
                    }}
                  >
                    <div style={styles.alertHeader}>
                      <span
                        style={{
                          ...styles.alertLevel,
                          color:
                            alert.level === 'CRITICAL'
                              ? '#ef4444'
                              : alert.level === 'WARNING'
                              ? '#f59e0b'
                              : '#22c55e',
                        }}
                      >
                        {alert.level}
                      </span>
                      <span style={styles.alertTime}>
                        {new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p style={styles.alertMessage}>{alert.message}</p>
                    {alert.details?.action === "AI Prediction Broadcast" ? (
                      <div style={styles.alertDetailsCard}>
                        <div style={styles.detailsTitle}>AI EPIDEMIOLOGICAL DIAGNOSTIC REPORT</div>
                        <div style={styles.detailsGrid}>
                          <div><strong>Location:</strong> {alert.details.location}</div>
                          <div><strong>Predictive Risk:</strong> <span style={{ color: alert.details.prediction?.toLowerCase() === 'high' ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>{alert.details.prediction?.toUpperCase()}</span></div>
                          <div><strong>Mean Temp (TEM):</strong> {alert.details.TEM}°C</div>
                          <div><strong>Humidity (H):</strong> {alert.details.H}%</div>
                          <div><strong>Rainfall (PP):</strong> {alert.details.PP} mm</div>
                        </div>
                        <div style={styles.detailsProtocol}>
                          <strong>Vector Directives:</strong> {alert.details.recommendation}
                        </div>
                      </div>
                    ) : (
                      <>
                        {alert.details?.userId && (
                          <p style={styles.alertDetails}>User ID: {alert.details.userId}</p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Section */}
            <div style={styles.chatSection}>
              <button
                style={styles.chatToggleBtn}
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare size={20} />
                {showChat ? 'Hide Chat' : 'Send Message to MOH'}
              </button>
              {showChat && (
                <ChatBox
                  onClose={() => setShowChat(false)}
                  userName="PHI Officer"
                  userId="phi-001"
                  senderRole="PHI"
                />
              )}
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
  alertDetails: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: '8px 0 0 0',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    gap: '16px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  errorContainer: {
    padding: '16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  errorText: {
    color: '#ef4444',
    margin: 0,
    fontSize: '14px',
  },
  noAlerts: {
    fontSize: '14px',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '24px',
  },
  chatSection: {
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  chatToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    border: '1px solid rgba(14, 165, 233, 0.3)',
    borderRadius: '8px',
    color: '#0ea5e9',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  alertDetailsCard: {
    marginTop: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '14px',
    textAlign: 'left' as const,
  },
  detailsTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#00e5c3',
    letterSpacing: '0.04em',
    marginBottom: '8px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '6px 12px',
    fontSize: '13px',
    color: '#cbd5e1',
    marginBottom: '10px',
  },
  detailsProtocol: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '8px',
    fontSize: '12.5px',
    color: '#cbd5e1',
    lineHeight: '1.4',
  },
};
