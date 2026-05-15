import { useEffect, useState } from "react";
import { getMatches } from "../lib/api";
import { foodEmoji } from "../lib/foods";
import type { Profile, ScreenId } from "../lib/types";
import { AvatarCanvas } from "./AvatarCanvas";

interface Props {
  profileId: string;
  writeToken: string;
  onNavigate: (screen: ScreenId) => void;
}

export function MatchesScreen({ profileId, writeToken, onNavigate }: Props) {
  const [matches, setMatches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMatches(profileId, writeToken)
      .then((m) => {
        if (!cancelled) setMatches(m);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  return (
    <div className="screen active scrollable">
      <h2>your buddies</h2>
      {loading ? (
        <div className="loading">loading...</div>
      ) : matches.length === 0 ? (
        <div className="no-matches">
          no matches yet!
          <br />
          keep swiping 🐟
        </div>
      ) : (
        <div className="matches-list">
          {matches.map((m) => (
            <div key={m.id} className="match-row">
              <AvatarCanvas animalIdx={m.animal_idx} paletteIdx={m.palette_idx} size={48} />
              <div className="info">
                <div className="name">{m.name}</div>
                <div className="foods">{m.foods.map(foodEmoji).join(" ")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="btn small" onClick={() => onNavigate("browse")} style={{ marginTop: 12 }}>
        back to swiping
      </button>
    </div>
  );
}
