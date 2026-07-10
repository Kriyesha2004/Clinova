const API_URL = 'http://localhost:5000/api/ai';

export interface PredictionRequestData {
  TEM: number;
  TMAX: number;
  Tm: number;
  SLP: number;
  H: number;
  PP: number;
  VV: number;
  V: number;
  VM: number;
  Week: number;
}

export interface PredictionReportData extends PredictionRequestData {
  city: string;
  prediction: string;
  risk_level_code: number;
  recommendation: string;
  createdBy?: string;
}

export interface PredictionReportDoc extends PredictionReportData {
  _id: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export const aiService = {
  // Run prediction
  predict: async (data: PredictionRequestData) => {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'AI Prediction failed');
    }
    return await response.json();
  },

  // Save prediction report
  saveReport: async (reportData: PredictionReportData): Promise<PredictionReportDoc> => {
    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to save prediction report');
    }
    return await response.json();
  },

  // Get all saved prediction reports
  getReports: async (): Promise<PredictionReportDoc[]> => {
    const response = await fetch(`${API_URL}/reports`);
    if (!response.ok) {
      throw new Error('Failed to fetch prediction reports');
    }
    return await response.json();
  },

  // Delete a prediction report
  deleteReport: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete report');
    }
    return await response.json();
  },
};
