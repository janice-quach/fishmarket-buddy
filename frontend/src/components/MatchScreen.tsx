import { useEffect } from "react";
import { spawnConfetti } from "../lib/confetti";
import { foodEmoji } from "../lib/foods";
import type { Profile, ScreenId } from "../lib/types";
import { AvatarCanvas } from "./AvatarCanvas";

interface Props {
  buddy: Profile;
  myProfile: Profile;
  sharedFoods: string[];
  onContinue: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export function MatchScreen({ buddy, myProfile, sharedFoods, onContinue, onNavigate }: Props) {
  useEffect(() => {
    spawnConfetti();
  }, []);

  return (
    <div className="screen active" id="match-screen">
      <h2>it's a match!</h2>
      <div className="match-avatars">
        <AvatarCanvas animalIdx={myProfile.animal_idx} paletteIdx={myProfile.palette_idx} size={80} />
        <AvatarCanvas animalIdx={buddy.animal_idx} paletteIdx={buddy.palette_idx} size={80} />
      </div>
      <div className="match-heart">❤️</div>
      <div className="match-foods">
        {sharedFoods.length > 0
          ? `you both love ${sharedFoods.map(foodEmoji).join(" ")}`
          : "different tastes, same vibes"}
      </div>
      <button type="button" className="btn" onClick={onContinue}>
        keep swiping
      </button>
      <button type="button" className="btn small secondary" onClick={() => onNavigate("matches")}>
        see matches
      </button>
    </div>
  );
}
