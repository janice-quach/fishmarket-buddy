const PROFILE_KEY = "fm_profile_id";
const TOKEN_KEY = "fm_write_token";

export function getProfileId(): string | null {
  return localStorage.getItem(PROFILE_KEY);
}

export function setProfileId(id: string): void {
  localStorage.setItem(PROFILE_KEY, id);
}

export function getWriteToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setWriteToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
