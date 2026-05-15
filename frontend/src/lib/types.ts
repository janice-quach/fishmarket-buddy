export interface Profile {
  id: string;
  name: string;
  foods: string[];
  animal_idx: number;
  palette_idx: number;
  tagline: string | null;
  created_at: string;
}

// Returned once on profile creation — client must persist write_token.
export interface ProfileCreated extends Profile {
  write_token: string;
}

export interface LikeResult {
  matched: boolean;
}

export type ScreenId = "splash" | "profile" | "browse" | "match" | "matches" | "crews" | "me";
