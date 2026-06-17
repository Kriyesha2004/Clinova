const API_URL = 'http://localhost:5000/api/complaints';

export interface ComplaintData {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

export const complaintService = {
  // Submit a complaint from the landing page
  sendComplaint: async (data: ComplaintData): Promise<{ message: string; data: ComplaintData }> => {
    try {
      const response = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit message');
      return await response.json();
    } catch (error) {
      console.error('Error submitting message:', error);
      throw error;
    }
  },

  // Get all complaints for PHI view
  getAllComplaints: async (): Promise<ComplaintData[]> => {
    try {
      const response = await fetch(`${API_URL}/all`);
      if (!response.ok) throw new Error('Failed to fetch complaints');
      return await response.json();
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  // Delete/Resolve a complaint
  deleteComplaint: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete complaint');
      return await response.json();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
  }
};
