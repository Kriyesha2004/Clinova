const API_URL = 'http://localhost:5000/api/city-visits';

export interface Visit {
  _id?: string;
  city: string;
  status: 'Pending' | 'Completed' | 'Delayed';
  photo: string; // Base64 string representation of the photo
  updatedAt?: string;
}

export interface CityVisitDoc {
  _id: string;
  weekStart: string; // YYYY-MM-DD
  visits: Visit[];
  createdAt?: string;
  updatedAt?: string;
}

export const cityVisitService = {
  // Get active week's city visits schedule
  getCurrentWeek: async (): Promise<CityVisitDoc> => {
    try {
      const response = await fetch(`${API_URL}/current`);
      if (!response.ok) throw new Error('Failed to fetch current week schedule');
      return await response.json();
    } catch (error) {
      console.error('Error fetching current week schedule:', error);
      throw error;
    }
  },

  // Update details of a specific city visit
  updateVisit: async (data: {
    weekStart: string;
    city: string;
    status?: 'Pending' | 'Completed' | 'Delayed';
    photo?: string;
  }): Promise<{ message: string; data: CityVisitDoc }> => {
    try {
      const response = await fetch(`${API_URL}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update visit details');
      return await response.json();
    } catch (error) {
      console.error('Error updating visit details:', error);
      throw error;
    }
  },

  // Get all weekly reports for MOH view
  getAllReports: async (): Promise<CityVisitDoc[]> => {
    try {
      const response = await fetch(`${API_URL}/reports`);
      if (!response.ok) throw new Error('Failed to fetch weekly reports');
      return await response.json();
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      throw error;
    }
  }
};
