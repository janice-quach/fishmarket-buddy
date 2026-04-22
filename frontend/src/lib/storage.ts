const KEY = "fm_profile_id";

export function getProfileId(): string | null {
  return localStorage.getItem(KEY);
}

export function setProfileId(id: string): void {
  localStorage.setItem(KEY, id);
}
