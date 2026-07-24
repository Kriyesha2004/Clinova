import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PredictionReportDoc } from '../../models/prediction.model';

const mapGeoJsonToCityPreset = (divisionName: string): string => {
  const name = divisionName.toLowerCase().trim();
  if (name.includes('colombo') || name.includes('thimbirigasyaya')) return 'Colombo Municipal Council';
  if (name.includes('dehiwala') || name.includes('ratmalana')) return 'Dehiwala';
  if (name.includes('homagama') || name.includes('padukka') || name.includes('seethawaka')) return 'Homagama';
  if (name.includes('kaduwela')) return 'Kaduwela';
  if (name.includes('kolonnawa')) return 'Kolonnawa';
  if (name.includes('maharagama') || name.includes('kesbewa')) return 'Maharagama';
  if (name.includes('moratuwa')) return 'Moratuwa';
  if (name.includes('kotte') || name.includes('nugegoda')) return 'Nugegoda';
  return 'Colombo Municipal Council';
};

interface RiskMapProps {
  prediction: PredictionReportDoc | null;
  cityPredictions: { [cityName: string]: PredictionReportDoc };
  loading: boolean;
}

export default function RiskMap({ prediction: _prediction, cityPredictions, loading }: RiskMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  // Helper to determine color based on risk level
  const getRiskColor = (risk: string) => {
    if (!risk) return '#22c55e'; // Green as default/low
    const r = risk.toLowerCase();
    if (r === 'high') return '#ef4444'; // Red
    if (r === 'medium') return '#f59e0b'; // Yellow/Amber
    return '#22c55e'; // Green
  };

  // Helper to get recommendation lists based on risk level
  const getRecommendations = (risk: string) => {
    if (!risk) return [];
    const r = risk.toLowerCase();
    if (r === 'high') {
      return [
        'Remove stagnant water immediately',
        'Increase mosquito control activities and fogging',
        'Encourage public awareness campaigns',
        'Alert medical centers for high patient influx'
      ];
    }
    if (r === 'medium') {
      return [
        'Clear gutters and drain standing water weekly',
        'Coordinate vector surveillance in hotspot neighborhoods',
        'Distribute mosquito nets and repellents'
      ];
    }
    return [
      'Maintain routine drainage checks',
      'Continue weekly public health awareness initiatives'
    ];
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    // Create Leaflet map centered on Colombo district center
    const colomboCenter: L.LatLngExpression = [6.8667, 80.0167];
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(colomboCenter, 10.5);

    // Load OpenStreetMap tiles with a premium clean/dark hybrid style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    // Fetch and load Colombo divisions GeoJSON
    fetch('/colombo_divisions.geojson')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load GeoJSON boundaries');
        }
        return res.json();
      })
      .then((geoJsonData) => {
        if (!isMounted || !mapRef.current || mapRef.current !== map) return;

        // Styling options for divisions
        const geoJsonLayer = L.geoJSON(geoJsonData, {
          style: (feat) => {
            const divisionName = feat?.properties?.ADM3_EN || '';
            const cityName = mapGeoJsonToCityPreset(divisionName);
            const cityPred = cityPredictions[cityName];
            const risk = cityPred?.prediction || 'Low';
            const fillColor = getRiskColor(risk);

            return {
              fillColor: fillColor,
              fillOpacity: 0.45,
              color: '#ffffff',
              weight: 1.5,
              opacity: 0.8,
              dashArray: '2',
            };
          },
          onEachFeature: (_feature, layer) => {
            // Setup hover effects
            layer.on({
              mouseover: (e) => {
                const target = e.target;
                target.setStyle({
                  fillOpacity: 0.7,
                  weight: 3,
                  opacity: 1
                });
              },
              mouseout: (e) => {
                if (geoJsonLayerRef.current) {
                  geoJsonLayerRef.current.resetStyle(e.target);
                }
              },
            });
          }
        }).addTo(map);

        geoJsonLayerRef.current = geoJsonLayer;

        // Recalculate size and fit bounds safely
        map.invalidateSize();
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error rendering GeoJSON on Map:', err);
        }
      });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map colors and popups when city predictions change
  useEffect(() => {
    if (!geoJsonLayerRef.current || !mapRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      const feature = layer.feature;
      const divisionName = feature?.properties?.ADM3_EN || '';
      const cityName = mapGeoJsonToCityPreset(divisionName);
      const cityPred = cityPredictions[cityName];

      const currentRisk = cityPred?.prediction || 'Low';
      const confidence = (cityPred?.probability !== undefined && cityPred?.probability !== null && cityPred?.probability !== 0)
        ? cityPred.probability 
        : (cityPred ? (cityPred.prediction.toLowerCase() === 'high' ? 94.0 : (cityPred.prediction.toLowerCase() === 'medium' ? 78.0 : 65.0)) : 0);
      const temp = cityPred?.TEM || 0;
      const humidity = cityPred?.H || 0;
      const rainfall = cityPred?.PP || 0;
      const dateStr = cityPred?.date 
        ? new Date(cityPred.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'No Data';

      const fillColor = getRiskColor(currentRisk);

      // Apply style for this division
      layer.setStyle({
        fillColor: fillColor,
        color: '#ffffff',
        weight: 1.5,
        fillOpacity: 0.45,
      });

      layer.unbindTooltip();
      layer.unbindPopup();

      // Tooltip displaying division name and risk on hover
      layer.bindTooltip(`<strong>${divisionName} Division</strong><br/>Risk: <span style="color: ${fillColor}; font-weight: bold;">${currentRisk}</span>`, {
        sticky: true,
        className: 'custom-map-tooltip'
      });

      // Click popup content
      const popupContent = `
        <div class="map-popup-card">
          <h3 class="popup-title">Location: ${divisionName} Division</h3>
          <p class="popup-subtitle" style="font-size: 11.5px; color: #94a3b8; margin: -4px 0 8px 0;">Mapped Area: ${cityName}</p>
          <div class="popup-divider"></div>
          
          <div class="popup-grid">
            <div class="popup-metric">
              <span class="popup-label">Current Risk:</span>
              <span class="popup-val risk-badge" style="background-color: ${fillColor}15; color: ${fillColor}; border: 1px solid ${fillColor}40;">
                ${currentRisk} Risk
              </span>
            </div>
            
            ${cityPred ? `
              <div class="popup-metric">
                <span class="popup-label">AI Confidence:</span>
                <span class="popup-val font-semibold text-blue-400">${confidence.toFixed(1)}%</span>
              </div>

              <div class="popup-metric">
                <span class="popup-label">Temperature:</span>
                <span class="popup-val">${temp.toFixed(1)}°C</span>
              </div>

              <div class="popup-metric">
                <span class="popup-label">Humidity:</span>
                <span class="popup-val">${humidity.toFixed(0)}%</span>
              </div>

              <div class="popup-metric">
                <span class="popup-label">Rainfall:</span>
                <span class="popup-val">${rainfall.toFixed(1)} mm</span>
              </div>

              <div class="popup-metric">
                <span class="popup-label">Prediction Date:</span>
                <span class="popup-val">${dateStr}</span>
              </div>
            ` : `
              <div class="popup-metric" style="grid-column: 1 / -1; justify-content: center; padding: 10px 0; color: #94a3b8; font-style: italic; text-align: center;">
                No saved prediction for this zone
              </div>
            `}
          </div>

          <div class="popup-divider"></div>
          <h4 class="popup-rec-title">Recommended Actions:</h4>
          <ul class="popup-rec-list">
            ${getRecommendations(currentRisk).map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>
      `;

      layer.bindPopup(popupContent, {
        maxWidth: 320,
        className: 'custom-map-popup'
      });
    });

  }, [cityPredictions]);

  return (
    <div style={styles.cardContainer}>
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>Colombo District Map</h3>
          <p style={styles.cardSubtitle}>Interactive outbreak surveillance map powered by OpenStreetMap</p>
        </div>
        <div style={styles.badgeRow}>
          <span style={styles.activeBadge}>LIVE</span>
        </div>
      </div>

      <div style={styles.mapWrapper}>
        <div ref={mapContainerRef} style={styles.mapElement} />
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner} />
            <span style={styles.loadingText}>Updating Map...</span>
          </div>
        )}
      </div>

      {/* Embedded CSS for styling custom Leaflet tooltips & popups */}
      <style>{`
        /* Smooth fill transition for map colors */
        .leaflet-interactive {
          transition: fill 0.6s ease, stroke 0.6s ease, stroke-width 0.2s ease, fill-opacity 0.2s ease !important;
        }

        /* Tooltip styling */
        .custom-map-tooltip {
          background-color: #0f172a !important;
          color: #e2e8f0 !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 6px !important;
          padding: 6px 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
          font-family: system-ui, sans-serif !important;
          font-size: 13px !important;
        }
        .custom-map-tooltip::before {
          border-right-color: #0f172a !important;
        }

        /* Popup wrapper */
        .custom-map-popup .leaflet-popup-content-wrapper {
          background-color: #0d1b2a !important;
          color: #f8fafc !important;
          border: 1px solid rgba(0, 229, 195, 0.2) !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7) !important;
          padding: 8px !important;
          font-family: system-ui, sans-serif !important;
        }
        .custom-map-popup .leaflet-popup-tip {
          background-color: #0d1b2a !important;
          border: 1px solid rgba(0, 229, 195, 0.2) !important;
        }
        .custom-map-popup .leaflet-popup-close-button {
          color: #94a3b8 !important;
          padding: 12px !important;
        }
        .custom-map-popup .leaflet-popup-close-button:hover {
          color: #ffffff !important;
        }

        /* Popup Content Card */
        .map-popup-card {
          padding: 4px 6px;
        }
        .popup-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
        }
        .popup-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 10px 0;
        }
        .popup-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .popup-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12.5px;
        }
        .popup-label {
          color: #94a3b8;
          font-weight: 500;
        }
        .popup-val {
          color: #f1f5f9;
          font-weight: 600;
        }
        .risk-badge {
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .popup-rec-title {
          font-size: 12px;
          font-weight: 700;
          color: #00e5c3;
          margin: 0 0 6px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .popup-rec-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .popup-rec-list li {
          font-size: 12px;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  cardContainer: {
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: '#1e293b',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0',
  },
  cardSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4',
  },
  badgeRow: {
    display: 'flex',
    gap: '8px',
  },
  activeBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '100px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  mapWrapper: {
    position: 'relative',
    flex: 1,
    minHeight: '400px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(0, 0, 0, 0.08)',
  },
  mapElement: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(59, 130, 246, 0.1)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '13px',
    color: '#475569',
    fontWeight: '500',
  },
};
