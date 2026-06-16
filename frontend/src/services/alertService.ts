const API_URL = 'http://localhost:5000/api/alerts';

export const alertService = {
  // Get all alerts
  getAllAlerts: async () => {
    try {
      const response = await fetch(`${API_URL}/phi`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  },

  // Get alerts by level (CRITICAL, WARNING, INFO)
  getAlertsByLevel: async (level: string) => {
    try {
      const response = await fetch(`${API_URL}/filter/level/${level}`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts by level:', error);
      return [];
    }
  },

  // Send alert from MOH
  sendAlert: async (alertData: any) => {
    try {
      const response = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });
      if (!response.ok) throw new Error('Failed to send alert');
      return await response.json();
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    }
  },

  // Mark alert as read
  markAsRead: async (alertId: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/${alertId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to mark alert as read');
      return await response.json();
    } catch (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }
  },

  // Delete alert
  deleteAlert: async (alertId: string) => {
    try {
      const response = await fetch(`${API_URL}/${alertId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete alert');
      return await response.json();
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  },
};
