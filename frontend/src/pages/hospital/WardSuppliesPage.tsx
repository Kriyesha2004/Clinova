import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Minus, ClipboardList, Loader } from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import type { WardSupplyItem } from '../../services/hospitalService';

interface WardSuppliesPageProps {
  onBack: () => void;
  isReadOnly?: boolean;
}

export default function WardSuppliesPage({ onBack, isReadOnly = false }: WardSuppliesPageProps) {
  const [supplies, setSupplies] = useState<WardSupplyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [requestedId, setRequestedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hospitalService.getWardSupplies();
      setSupplies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to sync supplies inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (id: string, delta: number) => {
    if (isReadOnly) return;
    try {
      const updated = await hospitalService.adjustWardSupply(id, delta);
      setSupplies(prev => prev.map(item => item._id === id ? updated : item));
    } catch (err) {
      alert('Failed to adjust supply stock');
    }
  };

  const handleRequestRestock = async (id: string) => {
    if (isReadOnly) return;
    try {
      setRequestedId(id);
      const updated = await hospitalService.replenishWardSupply(id);
      setSupplies(prev => prev.map(item => item._id === id ? updated : item));
      alert('Emergency restock request approved. 50 units dispatched and stocked.');
    } catch (err) {
      alert('Failed to request restock');
    } finally {
      setRequestedId(null);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Dashboard
        </button>
        <h1 style={styles.title}>Dengue Ward Supplies {isReadOnly ? '(View Only)' : 'Management'}</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.summaryCard}>
          <ClipboardList size={22} color="#00e5c3" style={{ marginRight: '10px' }} />
          <div>
            <h3 style={styles.summaryTitle}>Ward Inventory Policy</h3>
            <p style={styles.summaryText}>
              Keep therapeutic fluids and mosquito nets above warning thresholds. Emergency restock triggers a supply request message to the MOH logistics warehouse.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingBox}>
            <Loader size={32} style={styles.spinner} />
            <p style={{ marginTop: '16px', color: '#94a3b8' }}>Syncing supplies checklist...</p>
          </div>
        ) : error ? (
          <div style={styles.errorAlert}>
            <p>{error}</p>
            <button onClick={fetchSupplies} style={styles.retryBtn}>Retry Sync</button>
          </div>
        ) : (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Supply Inventory Checklist</h2>
            <div style={styles.grid}>
              {supplies.map((item) => {
                const isLow = item.stock < item.minTarget;
                const statusColor = isLow ? '#ef4444' : '#10b981';
                const isRequesting = requestedId === item._id;

                return (
                  <div 
                    key={item._id} 
                    style={{
                      ...styles.supplyCard,
                      borderColor: isLow ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <div style={styles.cardHeader}>
                      <div style={styles.metaRow}>
                        <span style={styles.categoryBadge}>{item.category}</span>
                        {isLow && <span style={styles.warningLabel}>Low Stock</span>}
                      </div>
                      <h4 style={styles.itemName}>{item.name}</h4>
                    </div>

                    <div style={styles.stockInfo}>
                      <div style={styles.stockLevelBox}>
                        <div style={styles.stockLabel}>Stock Quantity</div>
                        <div style={{ ...styles.stockValue, color: statusColor }}>{item.stock}</div>
                      </div>

                      {!isReadOnly && (
                        <div style={styles.adjustControls}>
                          <button onClick={() => handleAdjustStock(item._id!, -5)} style={styles.adjustBtn} title="Reduce 5 Units">
                            <Minus size={12} />
                          </button>
                          <button onClick={() => handleAdjustStock(item._id!, 5)} style={styles.adjustBtn} title="Add 5 Units">
                            <Plus size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={styles.footerRow}>
                      <span style={styles.minTargetText}>Min target: {item.minTarget} units</span>
                      {isLow && !isReadOnly && (
                        <button 
                          onClick={() => handleRequestRestock(item._id!)} 
                          disabled={isRequesting}
                          style={styles.restockBtn}
                        >
                          {isRequesting ? 'Requesting...' : 'Request Restock'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'rgba(0, 229, 195, 0.05)',
    border: '1px solid rgba(0, 229, 195, 0.15)',
    borderRadius: '12px',
    marginBottom: '30px',
  },
  summaryTitle: {
    fontSize: '15px',
    fontWeight: '700',
    margin: 0,
    color: '#00e5c3',
  },
  summaryText: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
    lineHeight: 1.5,
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
    marginTop: '12px',
  },
  panel: {
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '24px',
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#ffffff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  supplyCard: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    justifyContent: 'space-between',
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: '0.04em',
  },
  warningLabel: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.4,
  },
  stockInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 25, 41, 0.2)',
    padding: '12px 16px',
    borderRadius: '8px',
  },
  stockLevelBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  stockLabel: {
    fontSize: '11px',
    color: '#64748b',
  },
  stockValue: {
    fontSize: '20px',
    fontWeight: '800',
    marginTop: '2px',
  },
  adjustControls: {
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
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minTargetText: {
    fontSize: '11px',
    color: '#64748b',
  },
  restockBtn: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
