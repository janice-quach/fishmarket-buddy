import { useEffect, useState } from "react";
import { getProfiles } from "../lib/api";
import { FOODS } from "../lib/foods";
import type { Profile } from "../lib/types";
import { AvatarCanvas } from "./AvatarCanvas";

interface Props {
  profileId: string;
  profilesRef: React.MutableRefObject<Profile[]>;
}

export function CrewsScreen({ profileId, profilesRef }: Props) {
  const [crews, setCrew] = useState<{ food: (typeof FOODS)[number]; members: Profile[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const build = (profiles: Profile[]) => {
      const crewMap = new Map<string, Profile[]>();
      for (const f of FOODS) crewMap.set(f.id, []);
      for (const p of profiles) {
        for (const fid of p.foods) {
          crewMap.get(fid)?.push(p);
        }
      }
      return FOODS.filter((f) => (crewMap.get(f.id)?.length ?? 0) > 0)
        .sort((a, b) => (crewMap.get(b.id)?.length ?? 0) - (crewMap.get(a.id)?.length ?? 0))
        .map((f) => ({ food: f, members: crewMap.get(f.id) ?? [] }));
    };

    if (profilesRef.current.length > 0) {
      setCrew(build(profilesRef.current));
      setLoading(false);
    } else {
      getProfiles()
        .then((profiles) => {
          if (cancelled) return;
          profilesRef.current = profiles;
          setCrew(build(profiles));
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [profilesRef]);

  if (loading) {
    return (
      <div className="screen active scrollable">
        <h2>the crews</h2>
        <div className="loading">loading crews...</div>
      </div>
    );
  }

  return (
    <div className="screen active scrollable">
      <h2>the crews</h2>
      <p style={{ fontSize: 7, color: "var(--muted)", lineHeight: 1.6, marginBottom: 4 }}>find your people by food</p>
      {crews.length === 0 ? (
        <div className="crew-empty">
          no one has joined yet!
          <br />
          be the first 🐟
        </div>
      ) : (
        crews.map((crew) => (
          <div key={crew.food.id} className="crew-section">
            <div className="crew-header">
              <span className="crew-emoji">{crew.food.emoji}</span>
              <span className="crew-label">{crew.food.label} crew</span>
              <span className="crew-count">{crew.members.length}</span>
            </div>
            <div className="crew-members">
              {crew.members.map((m) => (
                <div key={m.id} className={`crew-member ${m.id === profileId ? "is-me" : ""}`}>
                  <AvatarCanvas animalIdx={m.animal_idx} paletteIdx={m.palette_idx} size={40} />
                  <div className="name">{m.id === profileId ? `${m.name} (you)` : m.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
