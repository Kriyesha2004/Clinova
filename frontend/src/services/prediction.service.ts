import type { PredictionRequestData, PredictionReportData, PredictionReportDoc } from '../models/prediction.model';

const API_URL = 'http://localhost:5000/api/ai';

export const predictionService = {
  /**
   * Run outbreak prediction using climate indicators
   */
  predict: async (data: PredictionRequestData): Promise<{ prediction: string; risk_level_code: number; probability: number }> => {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'AI Outbreak prediction failed');
    }
    return await response.json();
  },

  /**
   * Save the generated prediction report to the database
   */
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

  /**
   * Get all saved prediction reports
   */
  getReports: async (): Promise<PredictionReportDoc[]> => {
    const response = await fetch(`${API_URL}/reports`);
    if (!response.ok) {
      throw new Error('Failed to fetch prediction reports');
    }
    return await response.json();
  },

  /**
   * Fetch the latest prediction report
   */
  getLatestPrediction: async (): Promise<PredictionReportDoc | null> => {
    const reports = await predictionService.getReports();
    return reports.length > 0 ? reports[0] : null;
  },

  /**
   * Fetch the last 7 prediction reports for analytics charts
   */
  getPredictionHistory: async (limit: number = 7): Promise<PredictionReportDoc[]> => {
    const reports = await predictionService.getReports();
    // Return the reports in chronological order (oldest to newest) for chart display
    return reports.slice(0, limit).reverse();
  },

  /**
   * Delete a prediction report
   */
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
