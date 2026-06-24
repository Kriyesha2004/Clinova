import React, { useEffect, useState } from 'react';
import { ArrowLeft, Droplet, Plus, Minus, FileText, Activity, Heart, ArrowDownLeft, ArrowUpRight, Loader } from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import type { BloodStockItem, BloodTransaction } from '../../services/hospitalService';

interface BloodInventoryPageProps {
  onBack: () => void;
  isReadOnly?: boolean;
}

export default function BloodInventoryPage({ onBack, isReadOnly = false }: BloodInventoryPageProps) {
  const [bloodStock, setBloodStock] = useState<BloodStockItem[]>([]);
  const [logs, setLogs] = useState<BloodTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Log Form State
  const [logGroup, setLogGroup] = useState<string>('A+');
  const [logUnits, setLogUnits] = useState<number>(1);
  const [logType, setLogType] = useState<'received' | 'dispensed'>('dispensed');
  const [logDest, setLogDest] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [stockData, logsData] = await Promise.all([
        hospitalService.getBloodStock(),
        hospitalService.getBloodLogs()
      ]);
      setBloodStock(stockData);
      setLogs(logsData);
    } catch (err: any) {
      setError(err.message || 'Failed to sync blood database');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (group: string, delta: number) => {
    if (isReadOnly) return;
    try {
      const updated = await hospitalService.adjustBloodStock(group, delta);
      setBloodStock(prev => prev.map(item => item.group === group ? updated : item));
    } catch (err) {
      alert('Failed to adjust stock');
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !logDest.trim() || submitting) return;

    try {
      setSubmitting(true);
      await hospitalService.logBloodTransaction({
        group: logGroup,
        units: logUnits,
        type: logType,
        dest: logDest
      });
      setLogDest('');
      setLogUnits(1);
      // Reload both stock and logs to ensure sync
      const [stockData, logsData] = await Promise.all([
        hospitalService.getBloodStock(),
        hospitalService.getBloodLogs()
      ]);
      setBloodStock(stockData);
      setLogs(logsData);
    } catch (err: any) {
      alert(err.message || 'Failed to submit transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const totalBags = bloodStock.reduce((acc, curr) => acc + curr.units, 0);
  const criticalCount = bloodStock.filter(item => (item.units / item.max) <= 0.25).length;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Dashboard
        </button>
        <h1 style={styles.title}>Blood Bank Inventory {isReadOnly ? '(View Only)' : 'System'}</h1>
      </header>

      <main style={styles.main}>
        {loading ? (
          <div style={styles.loadingBox}>
            <Loader size={32} style={styles.spinner} />
            <p style={{ marginTop: '16px', color: '#94a3b8' }}>Syncing blood reserves...</p>
          </div>
        ) : error ? (
          <div style={styles.errorAlert}>
            <p>{error}</p>
            <button onClick={fetchData} style={styles.retryBtn}>Retry Sync</button>
          </div>
        ) : (
          <>
            {/* Statistics Band */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <Heart size={22} color="#ef4444" fill="#ef4444" />
                </div>
                <div>
                  <div style={styles.statLabel}>Total Available Reserves</div>
                  <div style={styles.statValue}>{totalBags} <span style={styles.statValueSub}>Bags</span></div>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <Activity size={22} color="#f59e0b" />
                </div>
                <div>
                  <div style={styles.statLabel}>Critical Stock Alerts</div>
                  <div style={styles.statValue}>{criticalCount} <span style={styles.statValueSub}>Groups</span></div>
                </div>
              </div>
            </div>

            {/* Grid layout for management */}
            <div 
              style={{ 
                ...styles.workspace,
                gridTemplateColumns: isReadOnly ? '1fr' : '1.2fr 1fr' 
              }}
            >
              {/* Left panel: Inventory Manager */}
              <div style={styles.panelLeft}>
                <h2 style={styles.panelTitle}>Blood Reserves Inventory</h2>
                <div style={styles.reservesList}>
                  {bloodStock.map((item) => {
                    const ratio = item.units / item.max;
                    let statusColor = '#10b981';
                    if (ratio <= 0.25) statusColor = '#ef4444';
                    else if (ratio <= 0.5) statusColor = '#f59e0b';

                    return (
                      <div key={item.group} style={styles.reserveItem}>
                        <div style={styles.reserveGroupLabel}>
                          <Droplet size={18} color={statusColor} fill={statusColor} />
                          <span style={{ fontWeight: '700', fontSize: '15px' }}>{item.group}</span>
                        </div>

                        <div style={styles.progressBarWrapper}>
                          <div style={styles.progressBarOuter}>
                            <div style={{ ...styles.progressBarInner, width: `${(ratio * 100).toFixed(0)}%`, backgroundColor: statusColor }} />
                          </div>
                          <span style={styles.capacityLabel}>{Math.round(ratio * 100)}%</span>
                        </div>

                        <div style={styles.stockCounters}>
                          {!isReadOnly && (
                            <button onClick={() => handleAdjustStock(item.group, -1)} style={styles.adjustBtn}>
                              <Minus size={11} />
                            </button>
                          )}
                          <span style={styles.unitText}>{item.units} / {item.max} bags</span>
                          {!isReadOnly && (
                            <button onClick={() => handleAdjustStock(item.group, 1)} style={styles.adjustBtn}>
                              <Plus size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right panel: Transaction Logger (Only if NOT read-only) */}
              {!isReadOnly && (
                <div style={styles.panelRight}>
                  <div style={styles.loggerCard}>
                    <h3 style={styles.loggerTitle}>Log Transaction (Dispatch / Receipt)</h3>
                    <form onSubmit={handleAddLog} style={styles.form}>
                      <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Blood Type</label>
                          <select value={logGroup} onChange={(e) => setLogGroup(e.target.value)} style={styles.formSelect}>
                            {bloodStock.map(item => (
                              <option key={item.group} value={item.group}>{item.group}</option>
                            ))}
                          </select>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Quantity (Bags)</label>
                          <input 
                            type="number" 
                            min={1} 
                            max={20} 
                            value={logUnits} 
                            onChange={(e) => setLogUnits(Math.max(1, parseInt(e.target.value) || 1))}
                            style={styles.formInput} 
                          />
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Action Type</label>
                        <div style={styles.radioGroup}>
                          <label style={{ ...styles.radioLabel, border: logType === 'dispensed' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)' }}>
                            <input 
                              type="radio" 
                              name="logType" 
                              checked={logType === 'dispensed'} 
                              onChange={() => setLogType('dispensed')} 
                              style={{ marginRight: '6px' }}
                            />
                            Dispense / Use
                          </label>
                          <label style={{ ...styles.radioLabel, border: logType === 'received' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)' }}>
                            <input 
                              type="radio" 
                              name="logType" 
                              checked={logType === 'received'} 
                              onChange={() => setLogType('received')} 
                              style={{ marginRight: '6px' }}
                            />
                            Receive / Donate
                          </label>
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>{logType === 'dispensed' ? 'Destination / Ward' : 'Source / Donor Camp'}</label>
                        <input 
                          type="text" 
                          placeholder={logType === 'dispensed' ? 'e.g. Ward 4 General' : 'e.g. Donation Camp - Colombo'} 
                          value={logDest}
                          onChange={(e) => setLogDest(e.target.value)}
                          required
                          style={styles.formInput}
                        />
                      </div>

                      <button type="submit" disabled={submitting} style={styles.submitBtn}>
                        {submitting ? 'Submitting...' : 'Submit Entry'}
                      </button>
                    </form>
                  </div>

                  {/* Audit Trail list */}
                  <div style={styles.auditTrailCard}>
                    <h3 style={styles.auditTitle}>
                      <FileText size={16} style={{ marginRight: '8px' }} />
                      Recent Blood Logs
                    </h3>
                    <div style={styles.logList}>
                      {logs.length === 0 ? (
                        <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                          No transaction records.
                        </div>
                      ) : (
                        logs.map((log) => (
                          <div key={log._id} style={styles.logItem}>
                            <div style={styles.logDirection}>
                              {log.type === 'received' ? (
                                <div style={{ ...styles.directionIcon, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                  <ArrowDownLeft size={16} color="#10b981" />
                                </div>
                              ) : (
                                <div style={{ ...styles.directionIcon, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                  <ArrowUpRight size={16} color="#ef4444" />
                                </div>
                              )}
                              <div>
                                <div style={styles.logTitle}>
                                  {log.units} bags of <strong>{log.group}</strong> {log.type}
                                </div>
                                <div style={styles.logSubtitle}>{log.dest}</div>
                              </div>
                            </div>
                            <span style={styles.logTime}>{log.time || new Date(log.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
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
    paddingBottom: '60px',
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  spinner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid rgba(0, 229, 195, 0.1)',
    borderTopColor: '#00e5c3',
    animation: 'spin 1s linear infinite',
  },
  errorAlert: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '24px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '12px',
    color: '#f87171',
    textAlign: 'center',
  },
  retryBtn: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '35px',
  },
  statCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  statIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    marginTop: '2px',
  },
  statValueSub: {
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#64748b',
  },
  workspace: {
    display: 'grid',
    gap: '30px',
  },
  panelLeft: {
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '24px',
  },
  panelRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#ffffff',
  },
  reservesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reserveItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
  },
  reserveGroupLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '60px',
  },
  progressBarWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  progressBarOuter: {
    flex: 1,
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  capacityLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    minWidth: '30px',
    textAlign: 'right',
  },
  stockCounters: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  adjustBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitText: {
    fontSize: '12px',
    fontWeight: '600',
    minWidth: '70px',
    textAlign: 'center',
    color: '#cbd5e1',
  },
  loggerCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '24px',
  },
  loggerTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    margin: '0 0 16px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  formLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  formSelect: {
    padding: '10px 14px',
    backgroundColor: '#030d16',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
  },
  formInput: {
    padding: '10px 14px',
    backgroundColor: '#030d16',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  radioGroup: {
    display: 'flex',
    gap: '12px',
  },
  radioLabel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.01)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: '8px',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#00e5c3',
    color: '#030d16',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
  },
  auditTrailCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '24px',
  },
  auditTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    margin: '0 0 16px 0',
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '220px',
    overflowY: 'auto',
  },
  logItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  logDirection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  directionIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logTitle: {
    fontSize: '13.5px',
    color: '#e2e8f0',
  },
  logSubtitle: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '2px',
  },
  logTime: {
    fontSize: '11px',
    color: '#64748b',
  },
};
