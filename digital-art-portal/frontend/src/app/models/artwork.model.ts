export interface Artwork {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tags: string;
  artist_id: number;
  artist_name: string;
  created_at: string;
}

export interface ArtworkRequest {
  title: string;
  description: string;
  image_url: string;
  tags: string;
}