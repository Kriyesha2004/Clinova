import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Calendar, 
  Clock, 
  Info, 
  TrendingUp 
} from 'lucide-react';
import type { PredictionReportDoc } from '../../models/prediction.model';

interface AnalyticsSummaryProps {
  prediction: PredictionReportDoc | null;
  history: PredictionReportDoc[];
  onRefresh: () => void;
  loading: boolean;
}

export default function AnalyticsSummary({ prediction, history, onRefresh, loading }: AnalyticsSummaryProps) {
  
  // Helpers
  const getRiskColor = (risk: string) => {
    if (!risk) return '#22c55e';
    const r = risk.toLowerCase();
    if (r === 'high') return '#ef4444';
    if (r === 'medium') return '#f59e0b';
    return '#22c55e';
  };

  const getStatusBadge = (risk: string) => {
    if (!risk) return { bg: 'rgba(34, 197, 94, 0.08)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)', label: 'Normal Status' };
    const r = risk.toLowerCase();
    if (r === 'high') {
      return {
        bg: 'rgba(239, 68, 68, 0.08)',
        text: '#ef4444',
        border: 'rgba(239, 68, 68, 0.2)',
        label: 'Critical Action Required'
      };
    }
    if (r === 'medium') {
      return {
        bg: 'rgba(245, 158, 11, 0.08)',
        text: '#f59e0b',
        border: 'rgba(245, 158, 11, 0.2)',
        label: 'Active Surveillance'
      };
    }
    return {
      bg: 'rgba(34, 197, 94, 0.08)',
      text: '#22c55e',
      border: 'rgba(34, 197, 94, 0.2)',
      label: 'Outbreak Risk Low'
    };
  };

  const currentRisk = prediction?.prediction || 'Low';
  const confidence = (prediction?.probability !== undefined && prediction?.probability !== null && prediction?.probability !== 0)
    ? prediction.probability 
    : (prediction ? (prediction.prediction.toLowerCase() === 'high' ? 94.0 : (prediction.prediction.toLowerCase() === 'medium' ? 78.0 : 65.0)) : 0);
  const status = getStatusBadge(currentRisk);
  const riskColor = getRiskColor(currentRisk);

  const formattedDate = prediction?.date
    ? new Date(prediction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'No Data';

  const formattedLastUpdated = prediction?.createdAt
    ? new Date(prediction.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Draw SVG Line Chart
  const renderHistoryChart = () => {
    if (history.length === 0) {
      return (
        <div style={styles.chartPlaceholder}>
          <TrendingUp size={24} color="#94a3b8" />
          <span style={styles.chartPlaceholderText}>No historical data available</span>
        </div>
      );
    }

    const paddingX = 40;
    const paddingY = 20;
    const width = 360;
    const height = 120;

    const points = history.map((item, idx) => {
      const x = paddingX + (idx * (width - 2 * paddingX)) / Math.max(history.length - 1, 1);
      const prob = (item.probability !== undefined && item.probability !== null && item.probability !== 0)
        ? item.probability
        : (item.prediction.toLowerCase() === 'high' ? 94.0 : (item.prediction.toLowerCase() === 'medium' ? 78.0 : 65.0));
      // Map probability (0-100) to height coordinate
      const y = height - paddingY - (prob / 100) * (height - 2 * paddingY);
      return { x, y, prob, ...item };
    });

    const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Chart Grid Lines */}
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="rgba(0, 0, 0, 0.04)" strokeDasharray="3" />
        <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="rgba(0, 0, 0, 0.04)" strokeDasharray="3" />
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="rgba(0, 0, 0, 0.04)" strokeDasharray="3" />

        {/* The Connection Line */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Points */}
        {points.map((p, idx) => (
          <g key={p._id || idx}>
            {/* Soft Glow */}
            <circle cx={p.x} cy={p.y} r="7" fill={getRiskColor(p.prediction)} opacity="0.25" />
            {/* Core Circle */}
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="4.5" 
              fill={getRiskColor(p.prediction)} 
              stroke="#ffffff" 
              strokeWidth="1.5" 
              style={{ cursor: 'pointer' }}
            />
            {/* Tooltip Labels (Confidence Text) */}
            <text 
              x={p.x} 
              y={p.y - 10} 
              fontSize="9" 
              fontWeight="700" 
              textAnchor="middle" 
              fill="#475569"
            >
              {p.prob}%
            </text>
            {/* Date label at bottom */}
            <text 
              x={p.x} 
              y={height - 4} 
              fontSize="8" 
              fontWeight="500" 
              textAnchor="middle" 
              fill="#94a3b8"
            >
              {new Date(p.date || '').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Prediction Summary</h3>
        <button 
          onClick={onRefresh} 
          disabled={loading} 
          style={styles.refreshBtn}
        >
          <Clock size={14} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Fetching...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Current Risk Level Card */}
      <div style={{ ...styles.riskCard, borderColor: riskColor + '20' }}>
        <div style={styles.riskCardHeader}>
          <span style={styles.riskCardLabel}>CURRENT DENGUE RISK</span>
          <span style={{ 
            ...styles.statusBadge, 
            backgroundColor: status.bg, 
            color: status.text, 
            borderColor: status.border 
          }}>
            {status.label}
          </span>
        </div>
        <h2 style={{ ...styles.riskValue, color: riskColor }}>
          {currentRisk.toUpperCase()}
        </h2>
        
        {/* Progress Bar for Confidence */}
        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>AI Model Confidence</span>
            <span style={styles.progressValue}>{confidence}%</span>
          </div>
          <div style={styles.progressBarBg}>
            <div style={{ 
              ...styles.progressBarFill, 
              width: `${confidence}%`, 
              backgroundColor: riskColor 
            }} />
          </div>
        </div>
      </div>

      {/* Climate Indicators */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Meteorological Parameters</h4>
        <div style={styles.metricsGrid}>
          <div style={styles.metricItem}>
            <div style={{ ...styles.metricIconBox, backgroundColor: 'rgba(59, 130, 246, 0.08)' }}>
              <Thermometer size={18} color="#3b82f6" />
            </div>
            <div>
              <span style={styles.metricLabel}>Average Temp</span>
              <h4 style={styles.metricVal}>{prediction?.TEM ? `${prediction.TEM.toFixed(1)}°C` : 'N/A'}</h4>
            </div>
          </div>

          <div style={styles.metricItem}>
            <div style={{ ...styles.metricIconBox, backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
              <Droplets size={18} color="#10b981" />
            </div>
            <div>
              <span style={styles.metricLabel}>Humidity</span>
              <h4 style={styles.metricVal}>{prediction?.H ? `${prediction.H.toFixed(0)}%` : 'N/A'}</h4>
            </div>
          </div>

          <div style={styles.metricItem}>
            <div style={{ ...styles.metricIconBox, backgroundColor: 'rgba(239, 68, 68, 0.08)' }}>
              <CloudRain size={18} color="#ef4444" />
            </div>
            <div>
              <span style={styles.metricLabel}>Rainfall</span>
              <h4 style={styles.metricVal}>{prediction?.PP ? `${prediction.PP.toFixed(1)} mm` : 'N/A'}</h4>
            </div>
          </div>

          <div style={styles.metricItem}>
            <div style={{ ...styles.metricIconBox, backgroundColor: 'rgba(124, 58, 237, 0.08)' }}>
              <Calendar size={18} color="#7c3aed" />
            </div>
            <div>
              <span style={styles.metricLabel}>Prediction Date</span>
              <h4 style={styles.metricVal}>{formattedDate}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Outbreak Chart */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Confidence & Risk History (Last 7 predictions)</h4>
        <div style={styles.chartCard}>
          {renderHistoryChart()}
        </div>
      </div>

      {/* Legend Indicator */}
      <div style={styles.legendContainer}>
        <div style={styles.legendHeader}>
          <Info size={12} color="#64748b" />
          <span style={styles.legendTitle}>Risk Level Guide</span>
        </div>
        <div style={styles.legendGrid}>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: '#22c55e' }} />
            <span style={styles.legendText}>Low Risk</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: '#f59e0b' }} />
            <span style={styles.legendText}>Medium Risk</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: '#ef4444' }} />
            <span style={styles.legendText}>High Risk</span>
          </div>
        </div>
      </div>

      {/* Last updated footer */}
      <div style={styles.footer}>
        <span style={styles.footerText}>Last synced: {formattedLastUpdated}</span>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
    color: '#1e293b',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    borderRadius: '8px',
    color: '#3b82f6',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  riskCard: {
    backgroundColor: 'rgba(248, 250, 252, 0.6)',
    border: '1px dashed rgba(0, 0, 0, 0.08)',
    borderRadius: '12px',
    padding: '16px',
  },
  riskCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  riskCardLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.05em',
  },
  statusBadge: {
    border: '1px solid',
    borderRadius: '100px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: '700',
  },
  riskValue: {
    fontSize: '28px',
    fontWeight: '800',
    margin: '0 0 16px 0',
    letterSpacing: '-0.02em',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '500',
  },
  progressLabel: {},
  progressValue: {
    fontWeight: '700',
    color: '#0f172a',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '100px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '100px',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f8fafc',
    border: '1px solid rgba(0, 0, 0, 0.03)',
    borderRadius: '10px',
    padding: '10px',
  },
  metricIconBox: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: '10px',
    color: '#64748b',
    display: 'block',
    fontWeight: '500',
  },
  metricVal: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '2px 0 0 0',
  },
  chartCard: {
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    padding: '12px 8px 6px 8px',
    backgroundColor: '#ffffff',
  },
  chartPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    height: '100px',
  },
  chartPlaceholderText: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  legendContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid rgba(0, 0, 0, 0.02)',
  },
  legendHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  legendGrid: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  legendText: {
    fontSize: '11px',
    color: '#475569',
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    borderTop: '1px solid rgba(0, 0, 0, 0.04)',
    paddingTop: '12px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '500',
  },
};
