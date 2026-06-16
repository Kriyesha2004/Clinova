import React, { useState } from 'react';
import { AlertCircle, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { alertService } from './services/alertService';

// Assuming ChatBox is imported from its respective file path
// Replace './ChatBox' with your actual path if different
import ChatBox from './components/ChatBox'; 

interface AlertsProps {
  onClick?: () => void;
  isFullPage?: boolean;
}

export default function Alerts({ onClick, isFullPage = false }: AlertsProps) {
  const [formData, setFormData] = useState({
    level: 'INFO',
    message: '',
    userId: '',
    action: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State to manage the chat collapse/expand visibility
  const [showChat, setShowChat] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message) {
      setError('Message is required');
      return;
    }

    try {
      setSending(true);
      setError(null);
      
      await alertService.sendAlert({
        level: formData.level,
        message: formData.message,
        sentBy: 'MOH',
        details: {
          userId: formData.userId,
          action: formData.action,
        }
      });

      setSuccess(true);
      setFormData({
        level: 'INFO',
        message: '',
        userId: '',
        action: '',
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to send alert. Please try again.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (isFullPage) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Send Alerts to PHI System</h1>
        <p style={styles.description}>Send real-time alerts and notifications to the PHI (Protected Health Information) Dashboard.</p>
        
        <div style={styles.formContainer}>
          <form onSubmit={handleSendAlert}>
            {success && (
              <div style={styles.successBox}>
                <CheckCircle size={20} />
                <span>Alert sent successfully to PHI!</span>
              </div>
            )}
            
            {error && (
              <div style={styles.errorBox}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Alert Level *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="INFO">Info</option>
                <option value="WARNING">Warning</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter alert message..."
                style={styles.textarea}
                rows={4}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>User ID (optional)</label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="e.g., 12345"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Action (optional)</label>
                <input
                  type="text"
                  name="action"
                  value={formData.action}
                  onChange={handleChange}
                  placeholder="e.g., Unauthorized access"
                  style={styles.input}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              style={{
                ...styles.submitBtn,
                opacity: sending ? 0.6 : 1,
                cursor: sending ? 'not-allowed' : 'pointer',
              }}
            >
              <Send size={18} />
              {sending ? 'Sending...' : 'Send Alert to PHI'}
            </button>
          </form>

          {/* Integrated Chat Section */}
          <div style={styles.chatSection}>
            <button
              style={styles.chatToggleBtn}
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare size={20} />
              {showChat ? 'Hide Chat' : 'Send Message to PHI'}
            </button>
            {showChat && (
              <ChatBox
                onClose={() => setShowChat(false)}
                userName="MO Officer"
                userId="moh-001"
                senderRole="MOH"
              />
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <button onClick={onClick} style={styles.actionBtn}>
      <AlertCircle size={20} />
      <span>Alerts</span>
    </button>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    color: '#ffffff',
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
    marginBottom: '30px',
  },
  formContainer: {
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '30px',
    backdropFilter: 'blur(10px)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(10, 25, 41, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(10, 25, 41, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(10, 25, 41, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.2s ease',
  },
  submitBtn: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    color: '#22c55e',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    marginTop: '20px',
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    color: '#22c55e',
    marginBottom: '20px',
    fontSize: '14px',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    marginBottom: '20px',
    fontSize: '14px',
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
  
  /* Styled chat additions to fit your current aesthetics */
  chatSection: {
    marginTop: '30px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '20px',
  },
  chatToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '15px',
  }
};