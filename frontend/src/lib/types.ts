export interface Profile {
  id: string;
  name: string;
  foods: string[];
  animal_idx: number;
  palette_idx: number;
  tagline: string | null;
  created_at: string;
}

export type ProfileInput = Omit<Profile, "id" | "created_at">;

export interface LikeResult {
  matched: boolean;
}

export type ScreenId = "splash" | "profile" | "browse" | "match" | "matches" | "crews" | "me";
