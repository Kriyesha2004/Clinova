import React, { useState, useEffect } from 'react';
import { Trash2, Check, Loader } from 'lucide-react';
import { messageService } from '../services/messageService';

interface Message {
  _id: string;
  sender: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface MessagesListProps {
  onBack?: () => void;
}

export default function MessagesList({ onBack }: MessagesListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages();
    // Refresh every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getMOHInbox();
      setMessages(data.messages);
      setUnreadCount(data.unreadCount);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      setMessages(
        messages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await messageService.markAllAsRead();
      setMessages(messages.map((msg) => ({ ...msg, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all messages as read:', err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
      setMessages(messages.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {onBack && (
          <button style={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
        )}
        <h2 style={styles.title}>Messages from PHI</h2>
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount} unread</span>
        )}
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading && messages.length === 0 ? (
        <div style={styles.loadingBox}>
          <Loader size={24} style={styles.spinner} />
          <p>Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div style={styles.emptyBox}>
          <p>No messages yet</p>
        </div>
      ) : (
        <>
          {unreadCount > 0 && (
            <button
              style={styles.markAllBtn}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}

          <div style={styles.messagesList}>
            {messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  ...styles.messageItem,
                  ...(msg.read
                    ? styles.messageItemRead
                    : styles.messageItemUnread),
                }}
              >
                <div style={styles.messageHeader}>
                  <div style={styles.senderInfo}>
                    <strong style={styles.senderName}>
                      {msg.senderName}
                    </strong>
                    <span style={styles.senderBadge}>{msg.sender}</span>
                  </div>
                  <span style={styles.timestamp}>
                    {formatDate(msg.timestamp)}
                  </span>
                </div>

                <p style={styles.messageText}>{msg.message}</p>

                <div style={styles.messageFooter}>
                  {!msg.read && (
                    <button
                      style={styles.actionBtn}
                      onClick={() => handleMarkAsRead(msg._id)}
                      title="Mark as read"
                    >
                      <Check size={16} /> Mark as Read
                    </button>
                  )}
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDeleteMessage(msg._id)}
                    title="Delete message"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#030d16',
    minHeight: '100vh',
    color: '#e0e0e0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #1a3a52',
  } as React.CSSProperties,
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#0ea5e9',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    transition: 'background 0.2s',
  } as React.CSSProperties,
  title: {
    margin: 0,
    flex: 1,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
  } as React.CSSProperties,
  badge: {
    backgroundColor: '#ea580c',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  errorBox: {
    backgroundColor: '#3d1f1f',
    border: '1px solid #8b3e3e',
    color: '#ff6b6b',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
  } as React.CSSProperties,
  loadingBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    gap: '15px',
  } as React.CSSProperties,
  spinner: {
    animation: 'spin 1s linear infinite',
  } as React.CSSProperties,
  emptyBox: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
  } as React.CSSProperties,
  markAllBtn: {
    backgroundColor: '#0ea5e9',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: '500',
  } as React.CSSProperties,
  messagesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  } as React.CSSProperties,
  messageItem: {
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid #2a2a2a',
  } as React.CSSProperties,
  messageItemRead: {
    backgroundColor: '#0a0f14',
  } as React.CSSProperties,
  messageItemUnread: {
    backgroundColor: '#1a2332',
    borderLeft: '4px solid #0ea5e9',
  } as React.CSSProperties,
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  } as React.CSSProperties,
  senderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  } as React.CSSProperties,
  senderName: {
    fontSize: '15px',
    color: '#fff',
  } as React.CSSProperties,
  senderBadge: {
    backgroundColor: '#1a3a52',
    color: '#0ea5e9',
    padding: '3px 8px',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: '600',
  } as React.CSSProperties,
  timestamp: {
    fontSize: '12px',
    color: '#999',
  } as React.CSSProperties,
  messageText: {
    margin: '10px 0',
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word' as const,
    color: '#d0d0d0',
  } as React.CSSProperties,
  messageFooter: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #1a1a1a',
  } as React.CSSProperties,
  actionBtn: {
    backgroundColor: '#1a3a52',
    color: '#0ea5e9',
    border: '1px solid #0ea5e9',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  deleteBtn: {
    backgroundColor: 'transparent',
    color: '#ff6b6b',
    border: '1px solid #8b3e3e',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginLeft: 'auto',
    transition: 'all 0.2s',
  } as React.CSSProperties,
};
