export interface Prediction {
  confidence: number;
  predicted_category_display: string;
  raw_scores: {
    saludable: number;
    antracnosis: number;
    sarna: number;
  };
  error_message: string | null;
}
