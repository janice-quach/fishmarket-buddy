import { useCallback, useEffect, useRef, useState } from "react";
import { getMyLikes, getProfiles, likeProfile } from "../lib/api";
import { foodEmoji } from "../lib/foods";
import type { Profile, ScreenId } from "../lib/types";
import { AvatarCanvas } from "./AvatarCanvas";

interface Props {
  profileId: string;
  onMatch: (buddy: Profile, myProfile: Profile, sharedFoods: string[]) => void;
  onNavigate: (screen: ScreenId) => void;
  profilesRef: React.MutableRefObject<Profile[]>;
}

export function BrowseScreen({ profileId, onMatch, onNavigate: _, profilesRef }: Props) {
  const [browsable, setBrowsable] = useState<Profile[]>([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const likedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.all([getProfiles(), getMyLikes(profileId)])
      .then(([profiles, likedIds]) => {
        if (cancelled) return;
        profilesRef.current = profiles;
        likedRef.current = new Set(likedIds);
        setCount(profiles.length);
        setBrowsable(profiles.filter((p) => p.id !== profileId && !likedRef.current.has(p.id)));
        setIdx(0);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [profileId, profilesRef]);

  const buddy = browsable[idx];

  const advance = useCallback(() => {
    setIdx((i) => i + 1);
    setSwiping(null);
  }, []);

  const swipeNo = useCallback(() => {
    setSwiping("left");
    setTimeout(advance, 300);
  }, [advance]);

  const swipeYes = useCallback(async () => {
    if (!buddy) return;
    setSwiping("right");

    setTimeout(async () => {
      try {
        const result = await likeProfile(profileId, buddy.id);
        likedRef.current.add(buddy.id);

        if (result.matched) {
          const myProfile = profilesRef.current.find((p) => p.id === profileId);
          if (myProfile) {
            const shared = buddy.foods.filter((fid) => myProfile.foods.includes(fid));
            onMatch(buddy, myProfile, shared);
            return;
          }
        }
      } catch {
        // continue on error
      }
      advance();
    }, 300);
  }, [buddy, profileId, onMatch, advance, profilesRef]);

  if (loading) {
    return (
      <div className="screen active">
        <div className="loading">loading crew...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen active">
        <div style={{ fontSize: 8, color: "var(--pink)" }}>failed to load — try again</div>
      </div>
    );
  }

  return (
    <div className="screen active">
      <h2>swipe your crew</h2>
      <div className="people-count">
        {count} {count === 1 ? "person" : "people"} joined
      </div>
      <div className="card-stack">
        <span className="swipe-hint left" style={{ opacity: swiping === "left" ? 1 : 0 }}>
          nah
        </span>
        <span className="swipe-hint right" style={{ opacity: swiping === "right" ? 1 : 0 }}>
          yep!
        </span>
        {buddy ? (
          <BuddyCard buddy={buddy} swiping={swiping} />
        ) : (
          <div className="buddy-card">
            <div style={{ fontSize: 32, fontFamily: "system-ui" }}>🐡</div>
            <div style={{ fontSize: 8, lineHeight: 1.8 }}>
              no more people!
              <br />
              waiting for more
              <br />
              to join...
            </div>
          </div>
        )}
      </div>
      <div className="swipe-buttons">
        <button type="button" className="swipe-btn nope" onClick={swipeNo} disabled={!buddy}>
          ✕
        </button>
        <button type="button" className="swipe-btn yep" onClick={swipeYes} disabled={!buddy}>
          ♥
        </button>
      </div>
    </div>
  );
}

function BuddyCard({ buddy, swiping }: { buddy: Profile; swiping: "left" | "right" | null }) {
  const transform =
    swiping === "left"
      ? "translateX(-400px) rotate(-20deg)"
      : swiping === "right"
        ? "translateX(400px) rotate(20deg)"
        : "";
  const opacity = swiping ? 0 : 1;

  return (
    <div
      className="buddy-card"
      style={{
        transition: swiping ? "transform 0.3s ease, opacity 0.3s ease" : undefined,
        transform,
        opacity,
      }}
    >
      <AvatarCanvas animalIdx={buddy.animal_idx} paletteIdx={buddy.palette_idx} size={96} />
      <div className="name">{buddy.name}</div>
      <div className="foods">{buddy.foods.map(foodEmoji).join(" ")}</div>
      {buddy.tagline && <div className="tagline">"{buddy.tagline}"</div>}
    </div>
  );
}
