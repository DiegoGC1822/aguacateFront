export interface Prediction {
  id: Number;
  confidence: number;
  predicted_category_display: string;
  raw_scores: {
    saludable: number;
    antracnosis: number;
    sarna: number;
  };
  error_message: string | null;
}

export interface PredictionResponse extends Prediction {
  image: string;
  classified_at: string;
  status: string;
}

export type History = Array<PredictionResponse>;

export type authResponse = {
  access: string;
  refresh: string;
};
