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
  probability: number;
  recommendation: string;
  createdBy?: string;
  date?: string;
}

export interface PredictionReportDoc extends PredictionReportData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
