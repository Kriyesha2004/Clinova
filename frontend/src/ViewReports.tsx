import React, { useEffect, useState } from 'react';
import { FileText, Loader, Trash2, Printer, AlertTriangle, ShieldAlert } from 'lucide-react';
import { aiService } from './services/aiService';
import type { PredictionReportDoc } from './services/aiService';

interface ViewReportsProps {
  onClick?: () => void;
  isFullPage?: boolean;
}

export default function ViewReports({ onClick, isFullPage = false }: ViewReportsProps) {
  const [reports, setReports] = useState<PredictionReportDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PredictionReportDoc | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isFullPage) {
      loadReports();
    }
  }, [isFullPage]);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await aiService.getReports();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport(data[0]);
      } else {
        setSelectedReport(null);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to load saved prediction reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this report?')) return;
    try {
      await aiService.deleteReport(id);
      setReports(prev => prev.filter(r => r._id !== id));
      if (selectedReport?._id === id) {
        const remaining = reports.filter(r => r._id !== id);
        setSelectedReport(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (err) {
      alert('Failed to delete report.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isFullPage) {
    return (
      <button onClick={onClick} style={styles.actionBtn}>
        <FileText size={20} />
        <span>View Reports</span>
      </button>
    );
  }

  return (
    <div style={styles.container}>
      {/* Inject Printable styles */}
      <style>{`
        @media print {
          /* Hide everything except the print container */
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 20px !important;
            margin: 0 !important;
          }
          /* Print details style overrides */
          .print-header {
            border-bottom: 2px solid #000000 !important;
            padding-bottom: 10px !important;
            margin-bottom: 15px !important;
            color: #000000 !important;
          }
          .print-branding-text {
            color: #000000 !important;
            font-size: 16px !important;
            font-weight: bold !important;
          }
          .print-meta {
            background: #f1f5f9 !important;
            border: 1px solid #cbd5e1 !important;
            color: #000000 !important;
          }
          .print-meta-value {
            color: #000000 !important;
          }
          .print-badge-box {
            border: 2px solid #000000 !important;
            background: #f8fafc !important;
            color: #000000 !important;
          }
          .print-badge-value {
            color: #000000 !important;
          }
          .print-table {
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            color: #000000 !important;
          }
          .print-cell {
            color: #000000 !important;
            border: 1px solid #e2e8f0 !important;
          }
          .print-rec {
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            color: #000000 !important;
          }
          .print-rec-title {
            color: #000000 !important;
          }
          .print-rec-text {
            color: #000000 !important;
          }
          .print-actions-hide {
            display: none !important;
          }
        }
      `}</style>

      <div className="no-print" style={styles.header}>
        <h1 style={styles.title}>Outbreak Assessment Reports</h1>
        <p style={styles.description}>Access, review, and print all historically saved epidemic outbreak analysis reports.</p>
      </div>

      {loading && reports.length === 0 ? (
        <div style={styles.loadingBox}>
          <Loader className="animate-spin" size={32} color="#00e5c3" />
          <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading saved reports...</p>
        </div>
      ) : error ? (
        <div style={styles.errorBox}>
          <AlertTriangle size={24} color="#ef4444" />
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      ) : reports.length === 0 ? (
        <div style={styles.emptyState}>
          <FileText size={48} color="#1e293b" />
          <p style={{ margin: 0 }}>No saved reports found. Run predictions in AI Analytics to save reports.</p>
        </div>
      ) : (
        <div style={styles.workspace}>
          {/* Sidebar list */}
          <div className="no-print" style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Saved Appraisals</h3>
            <div style={styles.listContainer}>
              {reports.map((report) => {
                const isActive = selectedReport?._id === report._id;
                return (
                  <div
                    key={report._id}
                    onClick={() => {
                      setSelectedReport(report);
                      setError('');
                    }}
                    style={{
                      ...styles.reportListItem,
                      backgroundColor: isActive ? 'rgba(0, 229, 195, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      borderColor: isActive ? '#00e5c3' : 'rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div style={styles.itemHeader}>
                      <span style={styles.itemCity}>{report.city}</span>
                      <span style={{
                        ...styles.itemBadge,
                        color: getRiskColor(report.prediction),
                        backgroundColor: getRiskColor(report.prediction) + '15'
                      }}>
                        {report.prediction.toUpperCase()}
                      </span>
                    </div>
                    <div style={styles.itemMeta}>
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                      <button 
                        onClick={(e) => handleDelete(report._id, e)} 
                        style={styles.deleteIconBtn}
                        title="Delete Report"
                      >
                        <Trash2 size={14} color="#94a3b8" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details view */}
          <div style={styles.detailsPane}>
            {selectedReport ? (
              <div id="printable-area" style={styles.reportCard}>
                <div className="print-header" style={styles.reportHeader}>
                  <div style={styles.reportBranding}>
                    <FileText size={20} color="#00e5c3" />
                    <span className="print-branding-text" style={styles.reportBrandingText}>Clinova Outbreak Assessment System</span>
                  </div>
                  <div style={styles.reportStamp}>ARCHIVED ASSESSMENT</div>
                </div>
                
                <div className="print-meta" style={styles.reportMeta}>
                  <div>
                    <span style={styles.metaLabel}>TARGET MUNICIPALITY</span>
                    <div className="print-meta-value" style={styles.metaValue}>{selectedReport.city}</div>
                  </div>
                  <div>
                    <span style={styles.metaLabel}>DATE GENERATED</span>
                    <div className="print-meta-value" style={styles.metaValue}>{new Date(selectedReport.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>

                <div style={styles.riskPrognosisRow}>
                  <div className="print-badge-box" style={{ ...styles.riskBadgeBox, backgroundColor: getRiskColor(selectedReport.prediction) + '15', borderColor: getRiskColor(selectedReport.prediction) + '30' }}>
                    <ShieldAlert size={28} color={getRiskColor(selectedReport.prediction)} />
                    <div>
                      <span style={styles.riskBadgeLabel}>PROGNOSIS LEVEL</span>
                      <div className="print-badge-value" style={{ ...styles.riskBadgeValue, color: getRiskColor(selectedReport.prediction) }}>
                        {selectedReport.prediction.toUpperCase()} RISK
                      </div>
                    </div>
                  </div>
                  <div style={styles.modelDetail}>
                    <span style={styles.metaLabel}>PREDICTION ENGINE</span>
                    <div className="print-meta-value" style={styles.metaValue}>Random Forest Classifier v1.2</div>
                  </div>
                </div>

                <div style={styles.indicatorsTableSection}>
                  <span style={styles.metaLabel}>METEOROLOGICAL ATTRIBUTES ANALYSIS</span>
                  <div className="print-table" style={styles.indicatorsTableGrid}>
                    <div className="print-cell" style={styles.tableCell}><strong>TEM:</strong> {selectedReport.TEM}°C</div>
                    <div className="print-cell" style={styles.tableCell}><strong>TMAX:</strong> {selectedReport.TMAX}°C</div>
                    <div className="print-cell" style={styles.tableCell}><strong>Tm:</strong> {selectedReport.Tm}°C</div>
                    <div className="print-cell" style={styles.tableCell}><strong>SLP:</strong> {selectedReport.SLP} hPa</div>
                    <div className="print-cell" style={styles.tableCell}><strong>Humidity (H):</strong> {selectedReport.H}%</div>
                    <div className="print-cell" style={styles.tableCell}><strong>Rainfall (PP):</strong> {selectedReport.PP}mm</div>
                    <div className="print-cell" style={styles.tableCell}><strong>Visibility (VV):</strong> {selectedReport.VV}km</div>
                    <div className="print-cell" style={styles.tableCell}><strong>Wind (V):</strong> {selectedReport.V} km/h</div>
                    <div className="print-cell" style={styles.tableCell}><strong>Max Wind (VM):</strong> {selectedReport.VM} km/h</div>
                    <div className="print-cell" style={styles.tableCell}><strong>Epi Week:</strong> {selectedReport.Week}</div>
                  </div>
                </div>

                <div className="print-rec" style={styles.recommendationBox}>
                  <h4 className="print-rec-title" style={styles.recTitle}>DIRECTIVES & CLINICAL PROTOCOLS</h4>
                  <p className="print-rec-text" style={styles.recText}>{selectedReport.recommendation}</p>
                </div>

                <div className="print-meta" style={{ ...styles.reportMeta, marginTop: '20px', gridTemplateColumns: '1fr' }}>
                  <div>
                    <span style={styles.metaLabel}>GENERATED BY HEALTH OFFICIAL</span>
                    <div className="print-meta-value" style={styles.metaValue}>{selectedReport.createdBy || 'MOH Officer'} (Ministry of Health, Sri Lanka)</div>
                  </div>
                </div>

                {/* Print Control Buttons */}
                <div className="print-actions-hide" style={styles.reportActions}>
                  <button 
                    onClick={handlePrint} 
                    style={styles.printActionBtn}
                  >
                    <Printer size={16} />
                    Print / Export PDF Report
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <FileText size={48} color="#1e293b" />
                <p>Select a report to inspect details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
function getRiskColor(risk: string) {
  if (risk.toLowerCase() === 'high') return '#ef4444'; // Red
  if (risk.toLowerCase() === 'medium') return '#f59e0b'; // Amber
  return '#22c55e'; // Green
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    color: '#ffffff',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#ffffff',
  },
  description: {
    fontSize: '14px',
    color: '#94a3b8',
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
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    color: '#ef4444',
  },
  emptyState: {
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    border: '1px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    color: '#64748b',
    minHeight: '300px',
  },
  workspace: {
    display: 'flex',
    gap: '35px',
  },
  sidebar: {
    flex: '1',
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '24px',
    height: '650px',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '10px',
    color: '#00e5c3',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  listContainer: {
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  reportListItem: {
    border: '1px solid',
    borderRadius: '8px',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  itemCity: {
    fontWeight: '600',
    fontSize: '14.5px',
    color: '#ffffff',
  },
  itemBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  itemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#94a3b8',
  },
  deleteIconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
  detailsPane: {
    flex: '1.8',
  },
  reportCard: {
    backgroundColor: '#061320',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    color: '#e2e8f0',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #00e5c3',
    paddingBottom: '15px',
    marginBottom: '20px',
  },
  reportBranding: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  reportBrandingText: {
    fontWeight: '700',
    fontSize: '14px',
    color: '#00e5c3',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  reportStamp: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#00e5c3',
    border: '1px solid #00e5c3',
    padding: '3px 8px',
    borderRadius: '4px',
    letterSpacing: '0.1em',
  },
  reportMeta: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '20px',
    marginBottom: '25px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  metaLabel: {
    display: 'block',
    fontSize: '10px',
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  metaValue: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
  },
  riskPrognosisRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    marginBottom: '25px',
  },
  riskBadgeBox: {
    flex: '1.5',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid',
  },
  riskBadgeLabel: {
    fontSize: '10px',
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  riskBadgeValue: {
    fontSize: '20px',
    fontWeight: '800',
    marginTop: '2px',
  },
  modelDetail: {
    flex: '1',
  },
  indicatorsTableSection: {
    marginBottom: '25px',
  },
  indicatorsTableGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px 20px',
    marginTop: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '15px',
  },
  tableCell: {
    fontSize: '13px',
    color: '#cbd5e1',
  },
  recommendationBox: {
    backgroundColor: 'rgba(10, 25, 41, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '20px',
  },
  recTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 10px 0',
    letterSpacing: '0.05em',
  },
  recText: {
    fontSize: '13.5px',
    color: '#cbd5e1',
    lineHeight: '1.6',
    margin: 0,
  },
  reportActions: {
    display: 'flex',
    gap: '15px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '20px',
    marginTop: '25px',
  },
  printActionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    backgroundColor: '#00e5c3',
    color: '#030d16',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
