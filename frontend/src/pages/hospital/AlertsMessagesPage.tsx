import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Send, MessageSquare, AlertCircle, ShieldAlert, Loader } from 'lucide-react';
import { alertService } from '../../services/alertService';
import { messageService } from '../../services/messageService';

interface AlertsMessagesPageProps {
  onBack: () => void;
  user: { id: string; name: string; email: string };
}

export default function AlertsMessagesPage({ onBack, user }: AlertsMessagesPageProps) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsData, messagesData] = await Promise.all([
        alertService.getAllAlerts(),
        messageService.getAllMessages()
      ]);
      setAlerts(alertsData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load alerts or messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await messageService.sendMessage({
        sender: 'hospital',
        senderName: user.name,
        senderId: user.id,
        message: newMessage
      });
      setNewMessage('');
      // Reload messages list
      const updatedMessages = await messageService.getAllMessages();
      setMessages(updatedMessages);
    } catch (error) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <ShieldAlert size={18} color="#ef4444" />;
      case 'WARNING':
        return <AlertCircle size={18} color="#f59e0b" />;
      default:
        return <Bell size={18} color="#3b82f6" />;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444';
      case 'WARNING': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Dashboard
        </button>
        <h1 style={styles.title}>Alerts & Messages</h1>
      </header>

      <main style={styles.main}>
        {loading ? (
          <div style={styles.loadingBox}>
            <Loader size={32} style={styles.spinner} />
            <p style={{ marginTop: '16px', color: '#94a3b8' }}>Syncing communication feeds...</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {/* Left: Alerts list */}
            <div style={styles.pane}>
              <h2 style={styles.paneTitle}>
                <Bell size={18} style={{ marginRight: '8px' }} />
                Public Health Alerts
              </h2>
              <div style={styles.alertList}>
                {alerts.length === 0 ? (
                  <div style={styles.emptyFeed}>
                    <p style={{ color: '#64748b', fontSize: '13.5px' }}>No active alerts posted.</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div 
                      key={alert._id} 
                      style={{
                        ...styles.alertCard,
                        borderLeft: `4px solid ${getAlertColor(alert.level)}`
                      }}
                    >
                      <div style={styles.alertHeader}>
                        <div style={styles.alertMeta}>
                          {getAlertIcon(alert.level)}
                          <span style={{ fontWeight: '700', fontSize: '12px', color: getAlertColor(alert.level) }}>
                            {alert.level}
                          </span>
                        </div>
                        <span style={styles.alertTime}>
                          {new Date(alert.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 style={styles.alertTitle}>{alert.message}</h4>
                      {alert.details && alert.details.location && (
                        <div style={styles.alertDetails}>District: {alert.details.location}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Message board */}
            <div style={styles.pane}>
              <h2 style={styles.paneTitle}>
                <MessageSquare size={18} style={{ marginRight: '8px' }} />
                Inter-departmental Chat Log
              </h2>
              <div style={styles.chatArea}>
                <div style={styles.messageList}>
                  {messages.length === 0 ? (
                    <div style={styles.emptyFeed}>
                      <p style={{ color: '#64748b', fontSize: '13.5px' }}>No message logs recorded.</p>
                    </div>
                  ) : (
                    // Invert back to newest at bottom for scrollable log
                    [...messages].reverse().map((msg) => {
                      const isMe = msg.sender === 'hospital';
                      return (
                        <div 
                          key={msg._id} 
                          style={{
                            ...styles.messageWrapper,
                            alignSelf: isMe ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div style={styles.messageSender}>{msg.senderName} ({msg.sender.toUpperCase()})</div>
                          <div 
                            style={{
                              ...styles.messageBubble,
                              backgroundColor: isMe ? '#00e5c3' : 'rgba(255, 255, 255, 0.05)',
                              color: isMe ? '#030d16' : '#ffffff',
                              border: isMe ? 'none' : '1px solid rgba(255,255,255,0.06)',
                              borderTopRightRadius: isMe ? '2px' : '12px',
                              borderTopLeftRadius: isMe ? '12px' : '2px',
                            }}
                          >
                            {msg.message}
                          </div>
                          <span style={styles.messageTime}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSendMessage} style={styles.sendForm}>
                  <input 
                    type="text" 
                    placeholder="Type feedback message to MOH or PHI..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={styles.sendInput}
                    disabled={sending}
                  />
                  <button type="submit" style={styles.sendBtn} disabled={sending || !newMessage.trim()}>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
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
    paddingBottom: '60px',
  },
  header: {
    backgroundColor: 'rgba(10, 25, 41, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backdropFilter: 'blur(10px)',
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  spinner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid rgba(0, 229, 195, 0.1)',
    borderTopColor: '#00e5c3',
    animation: 'spin 1s linear infinite',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    gap: '30px',
  },
  pane: {
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    height: '620px',
  },
  paneTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '17px',
    fontWeight: '700',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '12px',
  },
  alertList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    overflowY: 'auto',
    flex: 1,
  },
  alertCard: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  alertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  alertTime: {
    fontSize: '11px',
    color: '#64748b',
  },
  alertTitle: {
    fontSize: '14.5px',
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 1.4,
    margin: 0,
  },
  alertDetails: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  chatArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
    flex: 1,
    paddingRight: '6px',
    marginBottom: '16px',
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '80%',
  },
  messageSender: {
    fontSize: '10px',
    color: '#64748b',
    marginBottom: '4px',
    paddingLeft: '2px',
  },
  messageBubble: {
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '13.5px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  messageTime: {
    fontSize: '9px',
    color: '#64748b',
    marginTop: '3px',
    alignSelf: 'flex-end',
    paddingRight: '4px',
  },
  sendForm: {
    display: 'flex',
    gap: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '16px',
  },
  sendInput: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#030d16',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#00e5c3',
    color: '#030d16',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  emptyFeed: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
};
