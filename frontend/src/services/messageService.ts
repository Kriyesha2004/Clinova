const API_URL = 'http://localhost:5000/api/messages';

export const messageService = {
  // Get all messages
 getAllMessages: async () => {
    try {
      const response = await fetch(`${API_URL}/all`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      return [...data].reverse(); // ← add this: oldest first for chat UI
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  // Get MOH inbox with unread count
  getMOHInbox: async () => {
    try {
      const response = await fetch(`${API_URL}/moh/inbox`);
      if (!response.ok) throw new Error('Failed to fetch inbox');
      return await response.json();
    } catch (error) {
      console.error('Error fetching inbox:', error);
      return { messages: [], unreadCount: 0 };
    }
  },

  // Get messages from specific sender
  getMessagesBySender: async (sender: string) => {
    try {
      const response = await fetch(`${API_URL}/from/${sender}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  // Send message
  sendMessage: async (messageData: {
    sender: string;
    senderName: string;
    senderId?: string;
    message: string;
    attachments?: string[];
  }) => {
    try {
      const response = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark message as read
  markAsRead: async (messageId: string) => {
    try {
      const response = await fetch(`${API_URL}/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to mark message as read');
      return await response.json();
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  // Mark all messages as read
  markAllAsRead: async () => {
    try {
      const response = await fetch(`${API_URL}/mark-all/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to mark all messages as read');
      return await response.json();
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  },

  // Delete message
  deleteMessage: async (messageId: string) => {
    try {
      const response = await fetch(`${API_URL}/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete message');
      return await response.json();
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },
};
