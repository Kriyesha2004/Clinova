import React, { useState } from 'react';
import { BarChart3, AlertTriangle, CheckCircle, Activity, Loader } from 'lucide-react';

interface AIAnalyticsProps {
  onClick?: () => void;
  isFullPage?: boolean;
}

export default function AIAnalytics({ onClick, isFullPage = false }: AIAnalyticsProps) {
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

    try {
      const response = await fetch('http://localhost:5000/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Prediction failed. Ensure the AI service is running.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        <h1 style={styles.title}>AI Outbreak Prediction</h1>
        <p style={styles.description}>
          Enter the current meteorological data to predict the dengue outbreak risk level using our advanced Random Forest model.
        </p>
      </div>

      <div style={styles.content}>
        <form onSubmit={handlePredict} style={styles.form}>
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
            {loading ? 'Analyzing...' : 'Run Prediction'}
          </button>
        </form>

        <div style={styles.resultSection}>
          {error && (
            <div style={styles.errorBox}>
              <AlertTriangle size={24} color="#ef4444" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div style={{ ...styles.resultBox, borderColor: getRiskColor(result.prediction) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ ...styles.riskIcon, backgroundColor: getRiskColor(result.prediction) + '20' }}>
                  <AlertTriangle size={32} color={getRiskColor(result.prediction)} />
                </div>
                <div>
                  <h3 style={styles.resultTitle}>Predicted Risk Level</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ ...styles.riskValue, color: getRiskColor(result.prediction) }}>
                      {result.prediction.toUpperCase()}
                    </span>
                    <span style={styles.riskCode}>(Code: {result.risk_level_code})</span>
                  </div>
                </div>
              </div>
              <p style={styles.resultRecommendation}>{getRecommendation(result.prediction)}</p>
            </div>
          )}
          
          {!result && !error && (
            <div style={styles.emptyState}>
              <BarChart3 size={48} color="#1e293b" />
              <p>Awaiting data input...</p>
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
  if (risk.toLowerCase() === 'high') return 'Immediate action required. Mobilize PHI units for fogging, alert local hospitals to prepare for potential patient surge, and issue public warnings.';
  if (risk.toLowerCase() === 'medium') return 'Increased surveillance recommended. Initiate community clean-up programs and monitor case numbers closely in this area.';
  return 'Normal conditions. Continue standard preventative measures and routine inspections.';
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
  },
  description: {
    fontSize: '15px',
    color: '#94a3b8',
    maxWidth: '600px',
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
    flex: '1',
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
    minHeight: '300px',
  },
  resultBox: {
    backgroundColor: 'rgba(10, 25, 41, 0.7)',
    border: '2px solid',
    borderRadius: '12px',
    padding: '30px',
    backdropFilter: 'blur(10px)',
  },
  riskIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: '0 0 5px 0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  riskValue: {
    fontSize: '36px',
    fontWeight: '800',
    margin: '0',
  },
  riskCode: {
    fontSize: '14px',
    color: '#64748b',
  },
  resultRecommendation: {
    marginTop: '25px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#cbd5e1',
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
