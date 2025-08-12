export interface Feedback {
  id: number;
  artwork_id: number;
  curator_id: number;
  curator_name: string;
  comment: string;
  rating: number;
  created_at: string;
}

export interface FeedbackRequest {
  artwork_id: number;
  comment: string;
  rating: number;
}