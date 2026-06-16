import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Upload, CheckCircle, Clock, AlertTriangle, Loader, Check } from 'lucide-react';
import { cityVisitService } from '../services/cityVisitService';
import type { CityVisitDoc, Visit } from '../services/cityVisitService';

interface CityVisitTimeTablePageProps {
  onBack: () => void;
}

export default function CityVisitTimeTablePage({ onBack }: CityVisitTimeTablePageProps) {
  const [schedule, setSchedule] = useState<CityVisitDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track save status for each city to show custom inline loaders/success feedback
  const [savingCity, setSavingCity] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentSchedule();
  }, []);

  const loadCurrentSchedule = async () => {
    try {
      setLoading(true);
      const data = await cityVisitService.getCurrentWeek();
      setSchedule(data);
      setError(null);
    } catch (err) {
      setError('Failed to load the weekly schedule. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (city: string, newStatus: 'Pending' | 'Completed' | 'Delayed') => {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      visits: schedule.visits.map(v => 
        v.city === city ? { ...v, status: newStatus } : v
      )
    });
  };

  const handlePhotoUpload = (city: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schedule) return;

    // Check size (limit to 5MB just in case)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSchedule({
        ...schedule,
        visits: schedule.visits.map(v => 
          v.city === city ? { ...v, photo: base64String } : v
        )
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (city: string) => {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      visits: schedule.visits.map(v => 
        v.city === city ? { ...v, photo: '' } : v
      )
    });
  };

  const handleSaveVisit = async (visit: Visit) => {
    if (!schedule) return;
    try {
      setSavingCity(visit.city);
      setSaveSuccess(null);
      
      await cityVisitService.updateVisit({
        weekStart: schedule.weekStart,
        city: visit.city,
        status: visit.status,
        photo: visit.photo
      });

      setSaveSuccess(visit.city);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      alert(`Failed to save updates for ${visit.city}.`);
    } finally {
      setSavingCity(null);
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 style={styles.title}>City Visit Time Table</h1>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {loading ? (
          <div style={styles.loadingBox}>
            <Loader size={36} style={styles.spinner} />
            <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading weekly schedule...</p>
          </div>
        ) : error ? (
          <div style={styles.errorBox}>
            <p>{error}</p>
            <button onClick={loadCurrentSchedule} style={styles.retryBtn}>Retry</button>
          </div>
        ) : schedule ? (
          <div style={styles.content}>
            <div style={styles.weekIndicatorCard}>
              <div style={styles.weekIndicatorLeft}>
                <span style={styles.activeBadge}>Active Week</span>
                <h2 style={styles.weekTitle}>{formatWeekRange(schedule.weekStart)}</h2>
                <p style={styles.weekSubtitle}>
                  Please record visit statuses and upload optional photo evidence. Updates are reset weekly.
                </p>
              </div>
            </div>

            <div style={styles.grid}>
              {schedule.visits.map((visit) => {
                const isSaving = savingCity === visit.city;
                const isSuccess = saveSuccess === visit.city;

                return (
                  <div key={visit.city} style={styles.card}>
                    {/* Header */}
                    <div style={styles.cardHeader}>
                      <div style={styles.cardTitleRow}>
                        <MapPin size={18} color="#00e5c3" style={{ flexShrink: 0 }} />
                        <h3 style={styles.cardTitle}>{visit.city}</h3>
                      </div>
                    </div>

                    <div style={styles.divider} />

                    {/* Status Controls */}
                    <div style={styles.section}>
                      <span style={styles.sectionLabel}>Visit Status</span>
                      <div style={styles.statusButtonsGroup}>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(visit.city, 'Pending')}
                          style={{
                            ...styles.statusBtn,
                            ...(visit.status === 'Pending' ? styles.statusPendingActive : styles.statusPendingInactive)
                          }}
                        >
                          <Clock size={14} />
                          Pending
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(visit.city, 'Completed')}
                          style={{
                            ...styles.statusBtn,
                            ...(visit.status === 'Completed' ? styles.statusCompletedActive : styles.statusCompletedInactive)
                          }}
                        >
                          <CheckCircle size={14} />
                          Completed
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(visit.city, 'Delayed')}
                          style={{
                            ...styles.statusBtn,
                            ...(visit.status === 'Delayed' ? styles.statusDelayedActive : styles.statusDelayedInactive)
                          }}
                        >
                          <AlertTriangle size={14} />
                          Delayed
                        </button>
                      </div>
                    </div>

                    {/* Photo Upload */}
                    <div style={styles.section}>
                      <span style={styles.sectionLabel}>Photo Evidence (Optional)</span>
                      
                      {visit.photo ? (
                        <div style={styles.photoContainer}>
                          <img src={visit.photo} alt={`${visit.city} Visit`} style={styles.previewImage} />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(visit.city)}
                            style={styles.removePhotoBtn}
                          >
                            Remove Photo
                          </button>
                        </div>
                      ) : (
                        <label style={styles.uploadZone}>
                          <Upload size={24} color="#94a3b8" />
                          <span style={styles.uploadText}>Select Image File</span>
                          <span style={styles.uploadSubtext}>JPG, PNG up to 5MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(visit.city, e)}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleSaveVisit(visit)}
                      style={{
                        ...styles.saveBtn,
                        backgroundColor: isSuccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0, 229, 195, 0.1)',
                        borderColor: isSuccess ? 'rgba(34, 197, 94, 0.3)' : 'rgba(0, 229, 195, 0.3)',
                        color: isSuccess ? '#22c55e' : '#00e5c3',
                      }}
                    >
                      {isSaving ? (
                        <>
                          <Loader size={16} style={styles.spinner} />
                          Saving...
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check size={16} />
                          Saved!
                        </>
                      ) : (
                        'Save Updates'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  weekIndicatorCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(15px)',
  },
  weekIndicatorLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 229, 195, 0.1)',
    border: '1px solid rgba(0, 229, 195, 0.25)',
    color: '#00e5c3',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '100px',
    letterSpacing: '0.05em',
  },
  weekTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    color: '#ffffff',
  },
  weekSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.5,
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#ffffff',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statusButtonsGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  statusBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 4px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
  uploadZone: {
    border: '2px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  uploadText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e2e8f0',
    marginTop: '8px',
  },
  uploadSubtext: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '4px',
  },
  photoContainer: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  previewImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
  },
  removePhotoBtn: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  saveBtn: {
    marginTop: 'auto',
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
};
