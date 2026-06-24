const API_URL = 'http://localhost:5000/api/hospital';

export interface BloodStockItem {
  _id?: string;
  group: string;
  units: number;
  max: number;
}

export interface BloodTransaction {
  _id?: string;
  group: string;
  units: number;
  type: 'received' | 'dispensed';
  dest: string;
  time?: string;
  createdAt?: string;
}

export interface WardSupplyItem {
  _id?: string;
  name: string;
  category: 'Diagnostic' | 'Therapeutic' | 'Preventative' | 'Equipment';
  stock: number;
  minTarget: number;
}

export const hospitalService = {
  // Blood stock operations
  getBloodStock: async (): Promise<BloodStockItem[]> => {
    try {
      const response = await fetch(`${API_URL}/blood-stock`);
      if (!response.ok) throw new Error('Failed to fetch blood stock');
      return await response.json();
    } catch (error) {
      console.error('Error fetching blood stock:', error);
      return [];
    }
  },

  adjustBloodStock: async (group: string, delta: number): Promise<BloodStockItem> => {
    try {
      const response = await fetch(`${API_URL}/blood-stock/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group, delta }),
      });
      if (!response.ok) throw new Error('Failed to adjust blood stock');
      const resJson = await response.json();
      return resJson.data;
    } catch (error) {
      console.error('Error adjusting blood stock:', error);
      throw error;
    }
  },

  getBloodLogs: async (): Promise<BloodTransaction[]> => {
    try {
      const response = await fetch(`${API_URL}/blood-logs`);
      if (!response.ok) throw new Error('Failed to fetch blood transaction logs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching blood logs:', error);
      return [];
    }
  },

  logBloodTransaction: async (data: BloodTransaction): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/blood-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit blood transaction');
      return await response.json();
    } catch (error) {
      console.error('Error submitting blood transaction:', error);
      throw error;
    }
  },

  // Ward supplies operations
  getWardSupplies: async (): Promise<WardSupplyItem[]> => {
    try {
      const response = await fetch(`${API_URL}/ward-supplies`);
      if (!response.ok) throw new Error('Failed to fetch ward supplies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching ward supplies:', error);
      return [];
    }
  },

  adjustWardSupply: async (id: string, delta: number): Promise<WardSupplyItem> => {
    try {
      const response = await fetch(`${API_URL}/ward-supplies/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, delta }),
      });
      if (!response.ok) throw new Error('Failed to adjust ward supply');
      const resJson = await response.json();
      return resJson.data;
    } catch (error) {
      console.error('Error adjusting ward supply:', error);
      throw error;
    }
  },

  replenishWardSupply: async (id: string, count?: number): Promise<WardSupplyItem> => {
    try {
      const response = await fetch(`${API_URL}/ward-supplies/replenish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, count }),
      });
      if (!response.ok) throw new Error('Failed to replenish ward supply');
      const resJson = await response.json();
      return resJson.data;
    } catch (error) {
      console.error('Error replenishing ward supply:', error);
      throw error;
    }
  },
};
