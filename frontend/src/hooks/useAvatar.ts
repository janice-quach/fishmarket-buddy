import { useCallback, useEffect, useRef, useState } from "react";
import { drawAvatar, randomAvatar } from "../lib/avatar";

export function useAvatar(size: number, initial?: { animalIdx: number; paletteIdx: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [avatar, setAvatar] = useState(initial ?? randomAvatar);

  useEffect(() => {
    if (canvasRef.current) {
      drawAvatar(canvasRef.current, avatar.animalIdx, avatar.paletteIdx, size);
    }
  }, [avatar, size]);

  const regen = useCallback(() => setAvatar(randomAvatar()), []);

  return { canvasRef, avatar, setAvatar, regen } as const;
}
