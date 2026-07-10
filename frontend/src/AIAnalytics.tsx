import React, { useState } from 'react';
import { BarChart3, AlertTriangle, Activity, Loader, Save, Send, ShieldAlert } from 'lucide-react';
import { aiService } from './services/aiService';
import { alertService } from './services/alertService';

interface AIAnalyticsProps {
  onClick?: () => void;
  isFullPage?: boolean;
}

const CITIES = [
  "Colombo Municipal Council",
  "Kolonnawa",
  "Kaduwela",
  "Nugegoda",
  "Maharagama",
  "Dehiwala",
  "Moratuwa",
  "Homagama"
];

const CITY_PRESETS = {
  "Colombo Municipal Council": { TEM: 28.5, TMAX: 32.1, Tm: 24.5, SLP: 1010.5, H: 75.0, PP: 12.5, VV: 10.0, V: 15.0, VM: 25.0, Week: 15 },
  "Kolonnawa": { TEM: 28.3, TMAX: 30.4, Tm: 24.4, SLP: 1016.1, H: 82.0, PP: 172.0, VV: 19.4, V: 3.3, VM: 17.1, Week: 32 }, // Triggers High
  "Kaduwela": { TEM: 28.5, TMAX: 31.0, Tm: 24.5, SLP: 1015.0, H: 83.0, PP: 160.0, VV: 18.0, V: 4.0, VM: 16.0, Week: 33 }, // Triggers High
  "Nugegoda": { TEM: 24.0, TMAX: 26.0, Tm: 21.0, SLP: 1010.0, H: 60.0, PP: 2.0, VV: 12.0, V: 8.0, VM: 12.0, Week: 10 }, // Triggers Low
  "Maharagama": { TEM: 23.5, TMAX: 25.5, Tm: 20.5, SLP: 1010.0, H: 58.0, PP: 1.5, VV: 12.0, V: 7.5, VM: 11.0, Week: 8 }, // Triggers Low
  "Dehiwala": { TEM: 28.3, TMAX: 30.4, Tm: 24.4, SLP: 1016.1, H: 82.0, PP: 172.0, VV: 19.4, V: 3.3, VM: 17.1, Week: 32 }, // Triggers High
  "Moratuwa": { TEM: 26.5, TMAX: 29.0, Tm: 23.0, SLP: 1012.0, H: 72.0, PP: 25.0, VV: 11.0, V: 10.0, VM: 18.0, Week: 20 }, // Triggers Medium
  "Homagama": { TEM: 27.0, TMAX: 29.5, Tm: 23.5, SLP: 1011.5, H: 70.0, PP: 35.0, VV: 11.0, V: 9.0, VM: 16.0, Week: 22 } // Triggers Medium
};

export default function AIAnalytics({ onClick, isFullPage = false }: AIAnalyticsProps) {
  const [selectedCity, setSelectedCity] = useState("Colombo Municipal Council");
  
  const [formData, setFormData] = useState({
    TEM: 28.5,
    TMAX: 32.1,
    Tm: 24.5,
    SLP: 1010.5,
    H: 75.0,
    PP: 12.5,
    VV: 10.0,
    V: 15.0,
    VM: 25.0,
    Week: 15
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ prediction: string, risk_level_code: number } | null>(null);
  const [error, setError] = useState('');
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [broadcastStatus, setBroadcastStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city in CITY_PRESETS) {
      setFormData({ ...CITY_PRESETS[city as keyof typeof CITY_PRESETS] });
    }
    setResult(null);
    setSaveStatus('idle');
    setBroadcastStatus('idle');
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setSaveStatus('idle');
    setBroadcastStatus('idle');

    try {
      const data = await aiService.predict(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Prediction failed. Ensure the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!result) return;
    setSaveStatus('saving');
    try {
      await aiService.saveReport({
        city: selectedCity,
        ...formData,
        prediction: result.prediction,
        risk_level_code: result.risk_level_code,
        recommendation: getRecommendation(result.prediction)
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  const handleBroadcastAlert = async () => {
    if (!result) return;
    setBroadcastStatus('sending');
    try {
      const predictionUpper = result.prediction.toUpperCase();
      const level = predictionUpper === 'HIGH' ? 'CRITICAL' : (predictionUpper === 'MEDIUM' ? 'WARNING' : 'INFO');
      
      await alertService.sendAlert({
        level,
        message: `MOH AI outbreak prediction results indicate a ${predictionUpper} RISK for Dengue in ${selectedCity}.`,
        sentBy: 'MOH',
        details: {
          action: "AI Prediction Broadcast",
          location: selectedCity,
          TEM: formData.TEM,
          H: formData.H,
          PP: formData.PP,
          prediction: result.prediction,
          risk_level_code: result.risk_level_code,
          recommendation: getRecommendation(result.prediction),
          timestamp: new Date().toISOString()
        }
      });
      setBroadcastStatus('sent');
      setTimeout(() => setBroadcastStatus('idle'), 4000);
    } catch (err: any) {
      console.error(err);
      setBroadcastStatus('error');
    }
  };

  if (!isFullPage) {
    return (
      <button onClick={onClick} style={styles.actionBtn}>
        <BarChart3 size={24} color="#00e5c3" />
        <span>AI Analytics</span>
      </button>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Outbreak Analytics</h1>
        <p style={styles.description}>
          Select a city zone to assess climate parameters, run predictive analysis models, generate reports, and dispatch alerts.
        </p>
      </div>

      {/* City Dropdown Selector */}
      <div style={styles.selectorCard}>
        <div style={styles.selectorGroup}>
          <label style={styles.selectorLabel}>Target Area (Colombo District)</label>
          <select 
            value={selectedCity} 
            onChange={handleCityChange} 
            style={styles.selectInput}
          >
            {CITIES.map(city => (
              <option key={city} value={city} style={styles.selectOption}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.content}>
        <form onSubmit={handlePredict} style={styles.form}>
          <h2 style={styles.formTitle}>Climate Indicators</h2>
          <div style={styles.grid}>
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} style={styles.inputGroup}>
                <label style={styles.label} title={getLabelTitle(key)}>{key}</label>
                <input
                  type="number"
                  step="any"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            ))}
          </div>
          
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? <Loader className="animate-spin" size={20} /> : <Activity size={20} />}
            {loading ? 'Running AI Engine...' : 'Run Outbreak Prediction'}
          </button>
        </form>

        <div style={styles.resultSection}>
          {error && (
            <div style={styles.errorBox}>
              <AlertTriangle size={24} color="#ef4444" />
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {result && (
            <div style={styles.reportCard}>
              <div style={styles.reportHeader}>
                <div style={styles.reportBranding}>
                  <BarChart3 size={20} color="#00e5c3" />
                  <span style={styles.reportBrandingText}>Clinova Outbreak Assessment System</span>
                </div>
                <div style={styles.reportStamp}>OFFICIAL REPORT</div>
              </div>
              
              <div style={styles.reportMeta}>
                <div>
                  <span style={styles.metaLabel}>TARGET MUNICIPALITY</span>
                  <div style={styles.metaValue}>{selectedCity}</div>
                </div>
                <div>
                  <span style={styles.metaLabel}>DATE GENERATED</span>
                  <div style={styles.metaValue}>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              <div style={styles.riskPrognosisRow}>
                <div style={{ ...styles.riskBadgeBox, backgroundColor: getRiskColor(result.prediction) + '15', borderColor: getRiskColor(result.prediction) + '30' }}>
                  <ShieldAlert size={28} color={getRiskColor(result.prediction)} />
                  <div>
                    <span style={styles.riskBadgeLabel}>PROGNOSIS LEVEL</span>
                    <div style={{ ...styles.riskBadgeValue, color: getRiskColor(result.prediction) }}>
                      {result.prediction.toUpperCase()} RISK
                    </div>
                  </div>
                </div>
                <div style={styles.modelDetail}>
                  <span style={styles.metaLabel}>PREDICTION MODEL</span>
                  <div style={styles.metaValue}>Random Forest Classifier v1.2</div>
                </div>
              </div>

              <div style={styles.indicatorsTableSection}>
                <span style={styles.metaLabel}>METEOROLOGICAL INDICATORS FOR ANALYSIS</span>
                <div style={styles.indicatorsTableGrid}>
                  <div style={styles.tableCell}><strong>TEM:</strong> {formData.TEM}°C</div>
                  <div style={styles.tableCell}><strong>Humidity:</strong> {formData.H}%</div>
                  <div style={styles.tableCell}><strong>Precip:</strong> {formData.PP}mm</div>
                  <div style={styles.tableCell}><strong>Week:</strong> {formData.Week}</div>
                </div>
              </div>

              <div style={styles.recommendationBox}>
                <h4 style={styles.recTitle}>DIRECTIVES & CLINICAL PROTOCOLS</h4>
                <p style={styles.recText}>{getRecommendation(result.prediction)}</p>
              </div>

              {/* Action Buttons inside Report */}
              <div style={styles.reportActions}>
                <button 
                  onClick={handleSaveReport} 
                  disabled={saveStatus === 'saving' || saveStatus === 'saved'} 
                  style={{ 
                    ...styles.reportActionBtn, 
                    backgroundColor: saveStatus === 'saved' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0, 229, 195, 0.1)',
                    borderColor: saveStatus === 'saved' ? '#22c55e' : '#00e5c3',
                    color: saveStatus === 'saved' ? '#22c55e' : '#00e5c3'
                  }}
                >
                  {saveStatus === 'saving' ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                  {saveStatus === 'saving' ? 'Saving...' : (saveStatus === 'saved' ? 'Report Saved to DB' : 'Save Report to DB')}
                </button>

                <button 
                  onClick={handleBroadcastAlert} 
                  disabled={broadcastStatus === 'sending' || broadcastStatus === 'sent'} 
                  style={{ 
                    ...styles.reportActionBtn, 
                    backgroundColor: broadcastStatus === 'sent' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    borderColor: broadcastStatus === 'sent' ? '#3b82f6' : '#ef4444',
                    color: broadcastStatus === 'sent' ? '#3b82f6' : '#ef4444'
                  }}
                >
                  {broadcastStatus === 'sending' ? <Loader className="animate-spin" size={16} /> : <Send size={16} />}
                  {broadcastStatus === 'sending' ? 'Broadcasting...' : (broadcastStatus === 'sent' ? 'Dispatched to Dashboards' : 'Send Results to PHI & Hospital')}
                </button>
              </div>
            </div>
          )}
          
          {!result && !error && (
            <div style={styles.emptyState}>
              <BarChart3 size={48} color="#1e293b" />
              <p style={{ margin: 0 }}>Select a city and run assessment model to display analysis report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helpers
function getRiskColor(risk: string) {
  if (risk.toLowerCase() === 'high') return '#ef4444'; // Red
  if (risk.toLowerCase() === 'medium') return '#f59e0b'; // Amber
  return '#22c55e'; // Green
}

function getRecommendation(risk: string) {
  if (risk.toLowerCase() === 'high') {
    return 'CRITICAL PROTOCOL: Immediate action required. Mobilize PHI units for vector surveillance and thermal fogging in breeding hubs. Alert district hospitals to allocate expansion wards, bolster O-negative and platelet blood counts, and stock rapid diagnostic kits. Broadcast public warnings through regional sanitary channels.';
  }
  if (risk.toLowerCase() === 'medium') {
    return 'SURVEILLANCE PROTOCOL: Increased vector surveillance recommended. Coordinate with municipal environmental health teams to run community-wide breeding site elimination programs. Conduct targeted larvicidal spraying in stagnant pools and monitor incoming clinical reports closely.';
  }
  return 'ROUTINE PREVENTATIVE MEASURES: Outbreak risk is low. Continue weekly public health awareness programs. Monitor standard rain indicator indexes and continue routine mosquito trap surveillance as scheduled.';
}

function getLabelTitle(key: string) {
  const titles: Record<string, string> = {
    TEM: "Average temperature",
    TMAX: "Maximum temperature recorded",
    Tm: "Minimum temperature recorded",
    SLP: "Sea level pressure",
    H: "Relative humidity",
    PP: "Amount of precipitation",
    VV: "Visibility",
    V: "Wind speed",
    VM: "Maximum sustained wind speed",
    Week: "Week of the year (1-53)"
  };
  return titles[key] || key;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '40px',
    maxWidth: '1200px',
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
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  description: {
    fontSize: '15px',
    color: '#94a3b8',
    maxWidth: '700px',
    lineHeight: '1.5',
  },
  selectorCard: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '20px 30px',
    marginBottom: '30px',
    backdropFilter: 'blur(10px)',
  },
  selectorGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '400px',
  },
  selectorLabel: {
    fontSize: '13px',
    color: '#00e5c3',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  selectInput: {
    backgroundColor: '#030d16',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
  },
  selectOption: {
    backgroundColor: '#030d16',
    color: '#ffffff',
  },
  content: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
  },
  form: {
    flex: '1',
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '30px',
    backdropFilter: 'blur(10px)',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    color: '#cbd5e1',
    fontWeight: '500',
    cursor: 'help',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '10px 15px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#00e5c3',
    color: '#030d16',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    transition: 'background-color 0.3s ease',
  },
  resultSection: {
    flex: '1.2',
    display: 'flex',
    flexDirection: 'column',
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
    minHeight: '400px',
    textAlign: 'center',
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
    gridTemplateColumns: '1fr 1fr',
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
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginTop: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '12px 15px',
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
    marginBottom: '25px',
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
  },
  reportActionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    border: '1px solid',
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
