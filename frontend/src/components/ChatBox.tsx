import React, { useState, useEffect, useRef } from 'react';
import { Send, X, CheckCheck } from 'lucide-react';
import { messageService } from '../services/messageService';

interface Message {
  _id: string;
  sender: 'PHI' | 'MOH' | 'hospital';
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface ChatBoxProps {
  onClose?: () => void;
  userName: string;
  userId?: string;
  senderRole?: 'PHI' | 'MOH';
}

export default function ChatBox({ onClose, userName, userId, senderRole = 'PHI' }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = async () => {
    try {
      const data = await messageService.getAllMessages();
      setMessages(data);
    } catch (err) {
      console.error('Polling error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Poll every 3 seconds
  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark all as read when chat opens
  useEffect(() => {
    messageService.markAllAsRead().catch(console.error);
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    try {
      await messageService.sendMessage({
        sender: senderRole,
        senderName: userName,
        senderId: userId,
        message: message.trim(),
      });
      setMessage('');
      await fetchMessages(); // immediate refresh after send
    } catch {
      setError('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.onlineDot} />
          <h3 style={styles.title}>Inter-departmental Chat</h3>
        </div>
        {onClose && (
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={styles.messageList}>
        {loading && (
          <p style={styles.statusText}>Loading messages...</p>
        )}
        {!loading && messages.length === 0 && (
          <p style={styles.statusText}>No messages yet. Start the conversation!</p>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender === senderRole;
          return (
            <div
              key={msg._id}
              style={{
                ...styles.bubbleWrapper,
                justifyContent: isMe ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor: isMe ? '#0ea5e9' : '#2a2a2a',
                  borderRadius: isMe
                    ? '14px 14px 2px 14px'
                    : '14px 14px 14px 2px',
                }}
              >
                <span style={styles.senderLabel}>
                  {isMe ? `You (${userName})` : `${msg.sender} — ${msg.senderName}`}
                </span>
                <p style={styles.bubbleText}>{msg.message}</p>
                <div style={styles.bubbleMeta}>
                  <span style={styles.timestamp}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && (
                    <CheckCheck
                      size={12}
                      style={{ opacity: msg.read ? 1 : 0.4 }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Input */}
      <div style={styles.inputRow}>
        <textarea
          style={styles.textarea}
          placeholder="Type a message... (Enter to send)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          rows={2}
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: sending || !message.trim() ? 0.5 : 1,
            cursor: sending || !message.trim() ? 'not-allowed' : 'pointer',
          }}
          onClick={handleSend}
          disabled={sending || !message.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    height: '520px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#e0e0e0',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid #2a2a2a',
    backgroundColor: '#111',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
  },
  title: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statusText: {
    color: '#555',
    textAlign: 'center',
    marginTop: '40px',
    fontSize: '13px',
  },
  bubbleWrapper: {
    display: 'flex',
    width: '100%',
  },
  bubble: {
    maxWidth: '72%',
    padding: '10px 14px',
    color: '#fff',
  },
  senderLabel: {
    display: 'block',
    fontSize: '10px',
    opacity: 0.6,
    marginBottom: '4px',
    fontWeight: 500,
  },
  bubbleText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  bubbleMeta: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '4px',
    marginTop: '4px',
  },
  timestamp: {
    fontSize: '10px',
    opacity: 0.5,
  },
  errorBox: {
    margin: '0 16px 8px',
    padding: '8px 12px',
    backgroundColor: '#3d1f1f',
    border: '1px solid #8b3e3e',
    color: '#ff6b6b',
    borderRadius: '4px',
    fontSize: '13px',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid #2a2a2a',
    alignItems: 'flex-end',
    backgroundColor: '#111',
  },
  textarea: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#0f0f0f',
    color: '#e0e0e0',
    fontFamily: 'inherit',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
  },
  sendBtn: {
    backgroundColor: '#0ea5e9',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
};