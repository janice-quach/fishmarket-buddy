import { useCallback, useEffect, useState } from "react";
import { updateProfile } from "../lib/api";
import { randomAvatar } from "../lib/avatar";
import type { Profile } from "../lib/types";
import { AvatarCanvas } from "./AvatarCanvas";
import { FoodGrid } from "./FoodGrid";

interface Props {
  profileId: string;
  writeToken: string;
  profilesRef: React.MutableRefObject<Profile[]>;
}

export function MeScreen({ profileId, writeToken, profilesRef }: Props) {
  const myProfile = profilesRef.current.find((p) => p.id === profileId);

  const [name, setName] = useState(myProfile?.name ?? "");
  const [tagline, setTagline] = useState(myProfile?.tagline ?? "");
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set(myProfile?.foods ?? []));
  const [avatar, setAvatar] = useState({
    animalIdx: myProfile?.animal_idx ?? 0,
    paletteIdx: myProfile?.palette_idx ?? 0,
  });
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    if (myProfile) {
      setName(myProfile.name);
      setTagline(myProfile.tagline ?? "");
      setSelectedFoods(new Set(myProfile.foods));
      setAvatar({ animalIdx: myProfile.animal_idx, paletteIdx: myProfile.palette_idx });
    }
  }, [myProfile]);

  const toggleFood = useCallback((id: string) => {
    setSelectedFoods((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const regen = useCallback(() => setAvatar(randomAvatar()), []);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (selectedFoods.size === 0) {
      setStatus({ text: "pick at least one food!", error: true });
      return;
    }

    try {
      const updated = await updateProfile(profileId, writeToken, {
        name: trimmed,
        foods: [...selectedFoods],
        animal_idx: avatar.animalIdx,
        palette_idx: avatar.paletteIdx,
        tagline: tagline.trim() || null,
      });

      const idx = profilesRef.current.findIndex((p) => p.id === profileId);
      if (idx >= 0) {
        const existing = profilesRef.current[idx];
        if (existing) {
          profilesRef.current[idx] = { ...existing, ...updated, foods: [...selectedFoods] };
        }
      }

      setStatus({ text: "saved ✓", error: false });
      setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus({ text: "failed to save", error: true });
    }
  };

  return (
    <div className="screen active scrollable">
      <h2>your card</h2>
      <div className="avatar-area">
        <AvatarCanvas
          animalIdx={avatar.animalIdx}
          paletteIdx={avatar.paletteIdx}
          size={128}
          className="avatar-border"
        />
        <button type="button" className="btn small secondary" onClick={regen}>
          ↻ new look
        </button>
      </div>
      <div className="input-wrap">
        <input
          type="text"
          placeholder="your name"
          maxLength={12}
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <h2>cravings</h2>
      <FoodGrid selected={selectedFoods} onToggle={toggleFood} />
      <h2>your vibe?</h2>
      <div className="input-wrap">
        <input
          type="text"
          placeholder="e.g. here for the oysters"
          maxLength={40}
          autoComplete="off"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
      </div>
      <div className="status-msg" style={status?.error ? { color: "var(--pink)" } : undefined}>
        {status?.text ?? ""}
      </div>
      <button type="button" className="btn" onClick={save} style={{ marginTop: 8 }}>
        save changes
      </button>
    </div>
  );
}
