import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, FileText, CheckCircle, Clock, AlertTriangle, Loader, X, Eye } from 'lucide-react';
import { cityVisitService } from '../services/cityVisitService';
import type { CityVisitDoc } from '../services/cityVisitService';

interface PHIWeeklyReportsPageProps {
  onBack: () => void;
}

export default function PHIWeeklyReportsPage({ onBack }: PHIWeeklyReportsPageProps) {
  const [reports, setReports] = useState<CityVisitDoc[]>([]);
  const [selectedReport, setSelectedReport] = useState<CityVisitDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null); // State for light-box modal preview

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await cityVisitService.getAllReports();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport(data[0]); // default to most recent week
      }
      setError(null);
    } catch (err) {
      setError('Failed to load weekly reports. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format YYYY-MM-DD to a beautiful week range
  const formatWeekRange = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const mondayFormatted = date.toLocaleDateString('en-US', options);
    
    // Add 6 days to get Sunday
    const sunday = new Date(date);
    sunday.setDate(sunday.getDate() + 6);
    const sundayFormatted = sunday.toLocaleDateString('en-US', options);
    
    return `Week of ${mondayFormatted} – ${sundayFormatted}`;
  };

  const formatUpdateTime = (timeStr?: string) => {
    if (!timeStr) return 'Not updated';
    const date = new Date(timeStr);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 style={styles.title}>PHI Weekly Reports</h1>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {loading ? (
          <div style={styles.loadingBox}>
            <Loader size={36} style={styles.spinner} />
            <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading historical reports...</p>
          </div>
        ) : error ? (
          <div style={styles.errorBox}>
            <p>{error}</p>
            <button onClick={loadReports} style={styles.retryBtn}>Retry</button>
          </div>
        ) : reports.length === 0 ? (
          <div style={styles.emptyContainer}>
            <FileText size={48} color="#64748b" />
            <h2 style={{ marginTop: '20px', fontSize: '20px', fontWeight: '600' }}>No reports logged yet</h2>
            <p style={{ color: '#94a3b8', marginTop: '8px' }}>
              PHI officers have not recorded any city visits for this week or previous weeks yet.
            </p>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Left Sidebar: Week Picker */}
            <div style={styles.sidebar}>
              <h3 style={styles.sidebarHeading}>Select Week</h3>
              <div style={styles.weekList}>
                {reports.map((report) => {
                  const isSelected = selectedReport?.weekStart === report.weekStart;
                  return (
                    <button
                      key={report.weekStart}
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      style={{
                        ...styles.weekItem,
                        backgroundColor: isSelected ? 'rgba(0, 229, 195, 0.1)' : 'rgba(10, 25, 41, 0.3)',
                        borderColor: isSelected ? 'rgba(0, 229, 195, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#00e5c3' : '#cbd5e1'
                      }}
                    >
                      <Calendar size={16} />
                      <div style={styles.weekItemText}>
                        <span style={styles.weekItemTitle}>{formatWeekRange(report.weekStart)}</span>
                        <span style={styles.weekItemSub}>
                          {report.visits.filter(v => v.status === 'Completed').length} / {report.visits.length} Completed
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Report Details */}
            {selectedReport && (
              <div style={styles.detailContainer}>
                <div style={styles.detailHeader}>
                  <div>
                    <h2 style={styles.detailTitle}>{formatWeekRange(selectedReport.weekStart)}</h2>
                    <p style={styles.detailSubtitle}>Weekly City Visit Surveillance Summary</p>
                  </div>
                  <div style={styles.summaryStats}>
                    <div style={styles.statChip}>
                      <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                        {selectedReport.visits.filter(v => v.status === 'Completed').length}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>Completed</span>
                    </div>
                    <div style={styles.statChip}>
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                        {selectedReport.visits.filter(v => v.status === 'Pending').length}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>Pending</span>
                    </div>
                    <div style={styles.statChip}>
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                        {selectedReport.visits.filter(v => v.status === 'Delayed').length}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>Delayed</span>
                    </div>
                  </div>
                </div>

                {/* Cities Table */}
                <div style={styles.tableCard}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>City / Municipal Council</th>
                        <th style={styles.th}>Surveillance Status</th>
                        <th style={styles.th}>Photo Attachment</th>
                        <th style={styles.th}>Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.visits.map((visit) => (
                        <tr key={visit.city} style={styles.tr}>
                          <td style={styles.tdName}>{visit.city}</td>
                          <td style={styles.td}>
                            {visit.status === 'Completed' ? (
                              <span style={styles.badgeCompleted}>
                                <CheckCircle size={12} />
                                Completed
                              </span>
                            ) : visit.status === 'Delayed' ? (
                              <span style={styles.badgeDelayed}>
                                <AlertTriangle size={12} />
                                Delayed
                              </span>
                            ) : (
                              <span style={styles.badgePending}>
                                <Clock size={12} />
                                Pending
                              </span>
                            )}
                          </td>
                          <td style={styles.td}>
                            {visit.photo ? (
                              <div style={styles.imageThumbnailWrapper} onClick={() => setActivePhoto(visit.photo)}>
                                <img src={visit.photo} alt="visit thumbnail" style={styles.thumbnail} />
                                <div style={styles.thumbnailHoverOverlay}>
                                  <Eye size={16} />
                                </div>
                              </div>
                            ) : (
                              <span style={styles.noPhotoText}>No photo uploaded</span>
                            )}
                          </td>
                          <td style={styles.tdDate}>{formatUpdateTime(visit.updatedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Lightbox Modal for Photo Viewer */}
      {activePhoto && (
        <div style={styles.modalOverlay} onClick={() => setActivePhoto(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setActivePhoto(null)}>
              <X size={24} />
            </button>
            <img src={activePhoto} alt="Surveillance Inspection Evidence" style={styles.largeImage} />
          </div>
        </div>
      )}
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
    position: 'sticky',
    top: 0,
    zIndex: 10,
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
    color: '#ffffff',
  },
  main: {
    padding: '40px',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '24px',
    color: '#ef4444',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '40px auto',
  },
  retryBtn: {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '40px auto',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '30px',
    alignItems: 'start',
  },
  sidebar: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backdropFilter: 'blur(10px)',
  },
  sidebarHeading: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#cbd5e1',
    letterSpacing: '0.02em',
  },
  weekList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  weekItem: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  weekItemText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  weekItemTitle: {
    fontWeight: '600',
    fontSize: '13px',
  },
  weekItemSub: {
    fontSize: '11px',
    color: '#64748b',
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  detailTitle: {
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
    color: '#ffffff',
  },
  detailSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
  },
  summaryStats: {
    display: 'flex',
    gap: '12px',
  },
  statChip: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    backgroundColor: 'rgba(10, 25, 41, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    minWidth: '80px',
    gap: '2px',
  },
  tableCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '16px 24px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent',
  },
  tdName: {
    padding: '20px 24px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
  },
  tdDate: {
    padding: '16px 24px',
    fontSize: '13px',
    color: '#64748b',
  },
  badgePending: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    color: '#f59e0b',
  },
  badgeCompleted: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.25)',
    color: '#22c55e',
  },
  badgeDelayed: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    color: '#ef4444',
  },
  imageThumbnailWrapper: {
    position: 'relative',
    width: '64px',
    height: '44px',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnailHoverOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  noPhotoText: {
    fontSize: '12px',
    color: '#475569',
    fontStyle: 'italic',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    position: 'relative',
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '-40px',
    right: 0,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
  },
  largeImage: {
    maxWidth: '100%',
    maxHeight: '80vh',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
};
// Add simple hover effect behavior using inline hooks/CSS in rendering if desired, 
// for thumbnails we can set hover state to display overlay
