import { useEffect, useRef } from "react";
import { drawAvatar } from "../lib/avatar";

interface Props {
  animalIdx: number;
  paletteIdx: number;
  size: number;
  className?: string;
}

export function AvatarCanvas({ animalIdx, paletteIdx, size, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      drawAvatar(ref.current, animalIdx, paletteIdx, size);
    }
  }, [animalIdx, paletteIdx, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      style={{ width: size, height: size, imageRendering: "pixelated" }}
      className={className}
    />
  );
}
