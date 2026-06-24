import React, { useEffect, useState } from 'react';
import { ArrowLeft, Shield, AlertCircle, HeartPulse, HelpCircle, Phone, Info } from 'lucide-react';
import { dengueContentService } from '../services/dengueContentService';
import type { DengueContentItem } from '../services/dengueContentService';

interface DengueResourcePageProps {
  onBack: () => void;
}

export default function DengueResourcePage({ onBack }: DengueResourcePageProps) {
  const [contentItems, setContentItems] = useState<DengueContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'prevention' | 'safety' | 'help'>('all');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const items = await dengueContentService.getAllContent();
      setContentItems(items);
    } catch (error) {
      console.error('Failed to load dengue content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeTab === 'all' 
    ? contentItems 
    : contentItems.filter(item => item.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prevention':
        return <Shield size={20} color="#00e5c3" />;
      case 'safety':
        return <AlertCircle size={20} color="#f59e0b" />;
      case 'help':
        return <HeartPulse size={20} color="#f87171" />;
      default:
        return <Info size={20} color="#818cf8" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'prevention':
        return 'Prevention';
      case 'safety':
        return 'Safety Guidelines';
      case 'help':
        return 'Help & Medical';
      default:
        return 'General';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prevention':
        return '#00e5c3';
      case 'safety':
        return '#f59e0b';
      case 'help':
        return '#f87171';
      default:
        return '#818cf8';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <button style={styles.backBtn} onClick={onBack}>
            <ArrowLeft size={18} />
            Back to Home
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
            <span style={styles.badge}>
              <span style={styles.badgeDot} />
              Outbreak Preparedness
            </span>
          </div>
          <h1 style={styles.title}>Dengue Resource Hub</h1>
          <p style={styles.subtitle}>Empowering communities with real-time prevention guidance, safety instructions, and medical support directories.</p>
        </div>
      </header>

      <main style={styles.main}>
        {/* Banner infographic image */}
        <div style={styles.heroBanner}>
          <div style={styles.bannerGrid}>
            <div style={styles.bannerTextContainer}>
              <h2 style={styles.bannerHeading}>Stop Dengue Before It Starts</h2>
              <p style={styles.bannerText}>
                Dengue fever is a severe viral disease transmitted by female Aedes mosquitoes. By understanding prevention and taking strict precautions in high-risk zones, we can collectively keep our neighborhoods safe. 
              </p>
              <div style={styles.emergencyContactCard}>
                <div style={styles.emergencyIconBox}>
                  <Phone size={20} color="#f87171" />
                </div>
                <div>
                  <div style={styles.emergencyLabel}>National Dengue Control Unit Hotline</div>
                  <div style={styles.emergencyPhone}>+94 11 236 8107 | 1990 (Ambulance)</div>
                </div>
              </div>
            </div>
            <div style={styles.bannerImageContainer}>
              <img 
                src="/dengue_prevention.png" 
                alt="Dengue Prevention Methods Infographic" 
                style={styles.bannerImage}
                onError={(e) => {
                  // Fallback if image isn't loaded/found
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={styles.tabContainer}>
          {(['all', 'prevention', 'safety', 'help'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabButton,
                color: activeTab === tab ? '#ffffff' : '#94a3b8',
                borderBottom: activeTab === tab ? '2px solid #00e5c3' : '2px solid transparent',
                backgroundColor: activeTab === tab ? 'rgba(0, 229, 195, 0.05)' : 'transparent',
              }}
            >
              {tab === 'all' && 'All Resources'}
              {tab === 'prevention' && 'Prevention Guides'}
              {tab === 'safety' && 'Area Safety'}
              {tab === 'help' && 'Symptoms & Help'}
            </button>
          ))}
        </div>

        {/* Resources Content Grid */}
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner} />
            <p style={{ marginTop: '16px', color: '#94a3b8' }}>Syncing local updates...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={styles.emptyState}>
            <HelpCircle size={48} color="#475569" />
            <h3 style={{ marginTop: '16px', fontSize: '18px', fontWeight: 600 }}>No Resources Found</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Please check back later or modify your filter choice.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredItems.map((item) => (
              <div key={item._id} style={styles.card}>
                {item.image && (
                  <div style={styles.cardImageContainer}>
                    <img src={item.image} alt={item.title} style={styles.cardImage} />
                  </div>
                )}
                <div style={styles.cardContent}>
                  <div style={styles.cardMeta}>
                    <span 
                      style={{
                        ...styles.cardCategoryBadge,
                        color: getCategoryColor(item.category),
                        backgroundColor: `${getCategoryColor(item.category)}14`,
                        borderColor: `${getCategoryColor(item.category)}33`,
                      }}
                    >
                      {getCategoryIcon(item.category)}
                      {getCategoryLabel(item.category)}
                    </span>
                    <span style={styles.cardDate}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Official'}
                    </span>
                  </div>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <div style={styles.cardBody}>
                    {item.content.split('\n').map((paragraph, index) => (
                      <p key={index} style={styles.cardParagraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#040d1a',
    color: '#e2e8f0',
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    paddingBottom: '80px',
  },
  header: {
    background: 'linear-gradient(180deg, rgba(6, 15, 32, 0.9) 0%, rgba(4, 13, 26, 0.4) 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '40px clamp(1rem, 4vw, 3rem) 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    maxWidth: '800px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '100px',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(0, 229, 195, 0.1)',
    border: '1px solid rgba(0, 229, 195, 0.25)',
    color: '#00e5c3',
    fontSize: '0.78rem',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '0.35rem 0.9rem',
    borderRadius: '100px',
    marginTop: '15px',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#00e5c3',
    display: 'inline-block',
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 2.75rem)',
    fontWeight: '800',
    fontFamily: "'Syne', sans-serif",
    margin: '12px 0 8px 0',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '15px',
    color: '#94a3b8',
    lineHeight: 1.6,
    margin: 0,
  },
  main: {
    padding: '40px clamp(1rem, 4vw, 3rem)',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  heroBanner: {
    background: 'linear-gradient(135deg, rgba(0, 229, 195, 0.08) 0%, rgba(0, 150, 255, 0.08) 100%)',
    border: '1px solid rgba(0, 229, 195, 0.15)',
    borderRadius: '24px',
    overflow: 'hidden',
    marginBottom: '40px',
  },
  bannerGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '30px',
    alignItems: 'center',
    padding: '40px',
  },
  bannerTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  bannerHeading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: "'Syne', sans-serif",
  },
  bannerText: {
    fontSize: '15px',
    color: '#94a3b8',
    lineHeight: 1.7,
  },
  emergencyContactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    border: '1px solid rgba(248, 113, 113, 0.2)',
    borderRadius: '16px',
    marginTop: '10px',
  },
  emergencyIconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emergencyLabel: {
    fontSize: '12px',
    color: '#f87171',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
  },
  emergencyPhone: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    marginTop: '2px',
  },
  bannerImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    maxWidth: '100%',
    maxHeight: '260px',
    objectFit: 'contain',
    borderRadius: '16px',
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    marginBottom: '35px',
    overflowX: 'auto',
  },
  tabButton: {
    padding: '14px 24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '25px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  },
  cardImageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#030b14',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  cardCategoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid transparent',
  },
  cardDate: {
    fontSize: '12px',
    color: '#64748b',
  },
  cardTitle: {
    fontSize: '19px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '14px',
    lineHeight: 1.3,
  },
  cardBody: {
    fontSize: '14.5px',
    color: '#94a3b8',
    lineHeight: 1.7,
    flex: 1,
  },
  cardParagraph: {
    marginBottom: '12px',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
  },
  spinner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid rgba(0, 229, 195, 0.1)',
    borderTopColor: '#00e5c3',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    border: '1px dashed rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    textAlign: 'center',
  },
};
