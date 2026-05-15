import type { LikeResult, Profile, ProfileCreated } from "./types";

const API = "https://fishmarket-buddy-api.janicequach.workers.dev";

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = (await res.json()) as T | { error: string };
  if (!res.ok) {
    const msg = typeof data === "object" && data !== null && "error" in data ? data.error : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

function withToken(token: string, extra?: HeadersInit): HeadersInit {
  return { "Content-Type": "application/json", "X-Write-Token": token, ...extra };
}

function parseProfile(p: Profile): Profile {
  return {
    ...p,
    foods: typeof p.foods === "string" ? (JSON.parse(p.foods) as string[]) : p.foods,
  };
}

export function getProfiles(): Promise<Profile[]> {
  return request<Profile[]>("/profiles").then((ps) => ps.map(parseProfile));
}

export function createProfile(data: {
  name: string;
  foods: string[];
  animal_idx: number;
  palette_idx: number;
  tagline: string | null;
}): Promise<ProfileCreated> {
  return request<ProfileCreated>("/profiles", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((p) => ({ ...p, foods: typeof p.foods === "string" ? (JSON.parse(p.foods) as string[]) : p.foods }));
}

export function updateProfile(
  id: string,
  token: string,
  data: {
    name: string;
    foods: string[];
    animal_idx: number;
    palette_idx: number;
    tagline: string | null;
  }
): Promise<Profile> {
  return request<Profile>(`/profiles/${id}`, {
    method: "PUT",
    headers: withToken(token),
    body: JSON.stringify(data),
  });
}

export function likeProfile(fromId: string, toId: string, token: string): Promise<LikeResult> {
  return request<LikeResult>("/likes", {
    method: "POST",
    headers: withToken(token),
    body: JSON.stringify({ from_id: fromId, to_id: toId }),
  });
}

export function getMyLikes(profileId: string, token: string): Promise<string[]> {
  return request<string[]>(`/likes/${profileId}`, { headers: withToken(token) });
}

export function getMatches(profileId: string, token: string): Promise<Profile[]> {
  return request<Profile[]>(`/matches/${profileId}`, { headers: withToken(token) }).then((ps) => ps.map(parseProfile));
}
