import { useCallback, useState } from "react";
import { useAvatar } from "../hooks/useAvatar";
import { createProfile } from "../lib/api";
import { setProfileId } from "../lib/storage";
import type { ScreenId } from "../lib/types";
import { AvatarCanvas } from "./AvatarCanvas";
import { FoodGrid } from "./FoodGrid";

interface Props {
  onCreated: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export function ProfileScreen({ onCreated, onNavigate }: Props) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set());
  const [nameError, setNameError] = useState(false);
  const [foodError, setFoodError] = useState(false);
  const { avatar, regen } = useAvatar(128);

  const toggleFood = useCallback((id: string) => {
    setSelectedFoods((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setFoodError(false);
  }, []);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError(true);
      return;
    }
    if (selectedFoods.size === 0) {
      setFoodError(true);
      return;
    }

    const profile = await createProfile({
      name: trimmed,
      foods: [...selectedFoods],
      animal_idx: avatar.animalIdx,
      palette_idx: avatar.paletteIdx,
      tagline: tagline.trim() || null,
    });
    setProfileId(profile.id);
    onCreated(profile.id);
    onNavigate("browse");
  };

  return (
    <div className="screen active scrollable">
      <h2>who are you?</h2>
      <div className="input-wrap">
        <input
          type="text"
          placeholder="your name"
          maxLength={12}
          autoComplete="off"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(false);
          }}
          style={nameError ? { borderColor: "#f582ae" } : undefined}
        />
      </div>
      <div className="avatar-area">
        <AvatarCanvas
          animalIdx={avatar.animalIdx}
          paletteIdx={avatar.paletteIdx}
          size={128}
          className="avatar-border"
        />
        <button type="button" className="btn small secondary" onClick={regen}>
          ↻ new buddy
        </button>
      </div>
      <h2>what do you crave?</h2>
      <div style={foodError ? { outline: "2px solid #f582ae" } : undefined}>
        <FoodGrid selected={selectedFoods} onToggle={toggleFood} />
      </div>
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
      <button type="button" className="btn" onClick={save} style={{ marginTop: 8 }}>
        find my crew
      </button>
    </div>
  );
}
