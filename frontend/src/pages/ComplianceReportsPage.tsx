import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Trash2, Plus, Check, X, Mail, Loader } from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { cityVisitService } from '../services/cityVisitService';
import type { ComplaintData } from '../services/complaintService';

interface ComplianceReportsPageProps {
  onBack: () => void;
}

export default function ComplianceReportsPage({ onBack }: ComplianceReportsPageProps) {
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintData | null>(null);
  const [modalWeek, setModalWeek] = useState('');
  const [modalCity, setModalCity] = useState('');
  const [modalStatus, setModalStatus] = useState<'Pending' | 'Completed' | 'Delayed'>('Pending');
  const [savingToTimetable, setSavingToTimetable] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const getMondayDateStr = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    const monday = new Date(d.setDate(diff));
    const yyyy = monday.getFullYear();
    let mm = (monday.getMonth() + 1).toString();
    let dd = monday.getDate().toString();
    if (parseInt(mm) < 10) mm = '0' + mm;
    if (parseInt(dd) < 10) dd = '0' + dd;
    return `${yyyy}-${mm}-${dd}`;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch complaints
      const complaintsData = await complaintService.getAllComplaints();
      setComplaints(complaintsData);

      // Fetch reports to populate available weeks
      const reportsData = await cityVisitService.getAllReports();
      const weekStarts = reportsData.map(r => r.weekStart);
      
      // Also ensure current week is in the dropdown options
      const currentMonday = getMondayDateStr(new Date());
      if (!weekStarts.includes(currentMonday)) {
        weekStarts.unshift(currentMonday);
      }
      
      setWeeks(weekStarts);
      setError(null);
    } catch (err) {
      setError('Failed to load compliance data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to resolve and delete this message?')) return;
    try {
      await complaintService.deleteComplaint(id);
      setComplaints(complaints.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to resolve complaint.');
    }
  };

  // Helper to extract a Colombo-area city name from complaint text
  const detectCity = (text: string) => {
    const locations = [
      'Colombo Municipal Council', 'Kolonnawa', 'Kaduwela', 'Nugegoda', 
      'Maharagama', 'Dehiwala', 'Moratuwa', 'Homagama'
    ];
    for (const loc of locations) {
      const firstWord = loc.split(' ')[0].toLowerCase();
      if (text.toLowerCase().includes(firstWord)) {
        return loc;
      }
    }
    return '';
  };

  const handleOpenAddToTimetable = (complaint: ComplaintData) => {
    setSelectedComplaint(complaint);
    
    // Auto-detect city from complaint text
    const detected = detectCity(complaint.message);
    setModalCity(detected || 'Colombo Municipal Council');
    
    // Default to the most recent week
    if (weeks.length > 0) {
      setModalWeek(weeks[0]);
    } else {
      setModalWeek(getMondayDateStr(new Date()));
    }
    
    setModalStatus('Pending');
    setIsModalOpen(true);
  };

  const handleConfirmAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCity.trim() || !modalWeek) return;

    try {
      setSavingToTimetable(true);
      
      // Update/Append to city visit schedule
      await cityVisitService.updateVisit({
        weekStart: modalWeek,
        city: modalCity.trim(),
        status: modalStatus
      });

      alert(`Successfully added surveillance visit for "${modalCity}" to ${formatWeekRange(modalWeek)}.`);
      setIsModalOpen(false);
      setSelectedComplaint(null);
    } catch (err) {
      console.error(err);
      alert('Failed to add visit to schedule.');
    } finally {
      setSavingToTimetable(false);
    }
  };

  // Format YYYY-MM-DD to a week range string
  const formatWeekRange = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const mondayFormatted = date.toLocaleDateString('en-US', options);
    
    const sunday = new Date(date);
    sunday.setDate(sunday.getDate() + 6);
    const sundayFormatted = sunday.toLocaleDateString('en-US', options);
    
    return `Week of ${mondayFormatted} – ${sundayFormatted}`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 style={styles.title}>Compliance & Feedback</h1>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {loading ? (
          <div style={styles.loadingBox}>
            <Loader size={36} style={styles.spinner} />
            <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading customer feedback...</p>
          </div>
        ) : error ? (
          <div style={styles.errorBox}>
            <p>{error}</p>
            <button onClick={loadData} style={styles.retryBtn}>Retry</button>
          </div>
        ) : (
          <div style={styles.content}>
            <div style={styles.summaryCard}>
              <Shield size={40} color="#00f2fe" />
              <div style={styles.summaryText}>
                <h2 style={styles.heading}>Citizen Surveillance Complaints</h2>
                <p style={styles.description}>
                  Manage inquiries and breeding site reports submitted via the public portal. You can resolve these messages directly or schedule inspections in the city visit timetable.
                </p>
              </div>
            </div>

            {complaints.length === 0 ? (
              <div style={styles.emptyBox}>
                <Check size={48} color="#22c55e" />
                <h3 style={{ marginTop: '16px', fontSize: '18px', fontWeight: '600' }}>Inbox fully resolved</h3>
                <p style={{ color: '#94a3b8', marginTop: '8px' }}>No pending compliance complaints or feedback from the public portal.</p>
              </div>
            ) : (
              <div style={styles.list}>
                {complaints.map((comp) => (
                  <div key={comp._id} style={styles.card}>
                    {/* Meta */}
                    <div style={styles.cardHeader}>
                      <div style={styles.metaRow}>
                        <div style={styles.iconCircle}>
                          <Mail size={16} color="#00e5c3" />
                        </div>
                        <div>
                          <h4 style={styles.senderName}>{comp.name}</h4>
                          <span style={styles.senderEmail}>{comp.email}</span>
                        </div>
                      </div>
                      <span style={styles.dateLabel}>
                        {comp.createdAt ? new Date(comp.createdAt).toLocaleString() : 'Recent'}
                      </span>
                    </div>

                    <div style={styles.divider} />

                    {/* Content */}
                    <p style={styles.messageText}>{comp.message}</p>

                    {/* Actions */}
                    <div style={styles.actionsRow}>
                      <button
                        type="button"
                        onClick={() => handleOpenAddToTimetable(comp)}
                        style={styles.actionAddBtn}
                      >
                        <Plus size={16} />
                        Add to Timetable
                      </button>
                      <button
                        type="button"
                        onClick={() => comp._id && handleDelete(comp._id)}
                        style={styles.actionResolveBtn}
                      >
                        <Trash2 size={16} />
                        Resolve & Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add to Timetable Modal Popup */}
      {isModalOpen && selectedComplaint && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <form style={styles.modalContent} onClick={(e) => e.stopPropagation()} onSubmit={handleConfirmAdd}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Schedule Surveillance Visit</h3>
              <button type="button" style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Week Range</label>
                <select
                  style={styles.select}
                  value={modalWeek}
                  onChange={(e) => setModalWeek(e.target.value)}
                  required
                >
                  {weeks.map(w => (
                    <option key={w} value={w}>{formatWeekRange(w)}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Inspection Location / City</label>
                <input
                  type="text"
                  style={styles.input}
                  value={modalCity}
                  onChange={(e) => setModalCity(e.target.value)}
                  placeholder="e.g. Kolonnawa area"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Surveillance Status</label>
                <div style={styles.statusButtonsGroup}>
                  <button
                    type="button"
                    onClick={() => setModalStatus('Pending')}
                    style={{
                      ...styles.statusBtn,
                      ...(modalStatus === 'Pending' ? styles.statusPendingActive : styles.statusPendingInactive)
                    }}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalStatus('Completed')}
                    style={{
                      ...styles.statusBtn,
                      ...(modalStatus === 'Completed' ? styles.statusCompletedActive : styles.statusCompletedInactive)
                    }}
                  >
                    Completed
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalStatus('Delayed')}
                    style={{
                      ...styles.statusBtn,
                      ...(modalStatus === 'Delayed' ? styles.statusDelayedActive : styles.statusDelayedInactive)
                    }}
                  >
                    Delayed
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.confirmBtn}
                disabled={savingToTimetable}
              >
                {savingToTimetable ? 'Scheduling...' : 'Confirm Schedule'}
              </button>
            </div>
          </form>
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
  },
  main: {
    padding: '40px',
    maxWidth: '900px',
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
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  summaryCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px 30px',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    backdropFilter: 'blur(10px)',
  },
  summaryText: {
    flex: 1,
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  description: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.6,
  },
  emptyBox: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backdropFilter: 'blur(5px)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
  },
  metaRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 229, 195, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderName: {
    fontSize: '15px',
    fontWeight: '600',
    margin: 0,
  },
  senderEmail: {
    fontSize: '12px',
    color: '#64748b',
  },
  dateLabel: {
    fontSize: '12px',
    color: '#64748b',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  messageText: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#cbd5e1',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  actionAddBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 229, 195, 0.1)',
    border: '1px solid rgba(0, 229, 195, 0.3)',
    borderRadius: '8px',
    color: '#00e5c3',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  actionResolveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginLeft: 'auto',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    backgroundColor: '#0a1929',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  modalCloseBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
  },
  modalBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#94a3b8',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(3, 13, 22, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(3, 13, 22, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  statusButtonsGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  statusBtn: {
    padding: '10px 4px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  statusPendingActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    color: '#f59e0b',
  },
  statusPendingInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
  },
  statusCompletedActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    color: '#22c55e',
  },
  statusCompletedInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
  },
  statusDelayedActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    color: '#ef4444',
  },
  statusDelayedInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 24px',
    backgroundColor: 'rgba(3, 13, 22, 0.4)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: '#cbd5e1',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  confirmBtn: {
    padding: '8px 16px',
    backgroundColor: '#00e5c3',
    border: 'none',
    borderRadius: '8px',
    color: '#030d16',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
};
