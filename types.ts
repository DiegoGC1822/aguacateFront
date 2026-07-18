export interface Prediction {
  id: number;
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
  lot_name?: string;
  tree_code?: string;
  north_coordinate?: number | null;
  east_coordinate?: number | null;
}

export interface BatchImage {
  id: string;
  uri: string;
  treeId: string;
  coorNorte: string;
  coorEste: string;
  prediction?: PredictionResponse;
}

export type History = Array<PredictionResponse>;

export type authResponse = {
  access: string;
  refresh: string;
};
