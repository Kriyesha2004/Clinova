import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onBackToHome?: () => void; // Optional callback to return to the landing page
  onLoginSuccess?: (dashboardType: string, user: any) => void; // Callback on successful login
}

export default function Login({ onBackToHome, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('dashboardType', data.dashboardType);

      // Call the callback with login data
      if (onLoginSuccess) {
        onLoginSuccess(data.dashboardType, data.user);
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Glow Effects to match the Clinova landing page vibe */}
      <div style={styles.glowTopLeft} />
      <div style={styles.glowBottomRight} />

      <div style={styles.card}>
        {/* Brand / Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer} onClick={onBackToHome}>
            <span style={styles.logoText}>Clinova <span style={styles.logoAccent}>SL</span></span>
          </div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your credentials to access the platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                placeholder="name@clinova.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <div style={styles.passwordLabelRow}>
              <label style={styles.label}>Password</label>
              <a href="#forgot" style={styles.forgotLink}>Forgot password?</a>
            </div>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </button>
        </form>

        {/* Footer actions */}
        {onBackToHome && (
          <button onClick={onBackToHome} style={styles.backBtn}>
            ← Back to Homepage
          </button>
        )}
      </div>
    </div>
  );
}

// Inline styles designed to match the current look & feel of your landing page
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#030d16', // Deep dark blue-black background
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  glowTopLeft: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(0, 242, 254, 0.05)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(0, 242, 254, 0.03)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'rgba(10, 25, 41, 0.7)', // Slightly translucent dark card
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '40px 32px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoContainer: {
    cursor: 'pointer',
    marginBottom: '24px',
    display: 'inline-block',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '-0.5px',
  },
  logoAccent: {
    color: '#00f2fe', // Cyan matching your dashboard styling
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '600',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#8a99ad',
    fontSize: '0.9rem',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#cbd5e1',
  },
  passwordLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: '0.8rem',
    color: '#00f2fe',
    textDecoration: 'none',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '12px',
    color: '#64748b',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 40px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    backgroundColor: '#00f2fe', // Vibrant button matching your "Login →" theme color
    color: '#030d16',
    border: 'none',
    borderRadius: '30px', // Round pill design to match your current navbar login button
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    marginTop: '10px',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '10px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.9rem',
    margin: 0,
  },
  backBtn: {
    display: 'block',
    margin: '24px auto 0 auto',
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'none',
  },
};