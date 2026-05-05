export interface Profile {
  id: string;
  name: string;
  foods: string[];
  animal_idx: number;
  palette_idx: number;
  tagline: string | null;
  created_at: string;
}

export interface LikeResult {
  matched: boolean;
}
