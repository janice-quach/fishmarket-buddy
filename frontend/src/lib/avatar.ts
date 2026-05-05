interface Animal {
  name: string;
  pixels: string[];
}

interface Palette {
  body: string;
  accent: string;
  eye: string;
  extra: string;
}

const ANIMALS: Animal[] = [
  {
    name: "cat",
    pixels: [
      "....1111....",
      "...111111...",
      "..11....11..",
      ".11.1..1.11.",
      ".11......11.",
      "..11....11..",
      "...111111...",
      "....1111....",
      "...111111...",
      "..11111111..",
      "..11111111..",
      "...111111...",
    ],
  },
  {
    name: "fish",
    pixels: [
      "............",
      "....1111....",
      "...111111...",
      "..1111.1111.",
      ".11111111111",
      ".11111111111",
      "..1111.1111.",
      "...111111...",
      "....1111....",
      "............",
      "............",
      "............",
    ],
  },
  {
    name: "octopus",
    pixels: [
      "....1111....",
      "...111111...",
      "..11.11.11..",
      "..11111111..",
      "..11111111..",
      "...111111...",
      "..11.11.11..",
      ".11..11..11.",
      ".1...11...1.",
      "1....11....1",
      "............",
      "............",
    ],
  },
  {
    name: "crab",
    pixels: [
      "1..........1",
      ".1........1.",
      ".1..1111..1.",
      "..1.1..1.1..",
      "..11111111..",
      "..11.11.11..",
      "..11111111..",
      "...111111...",
      "..1..11..1..",
      ".1...11...1.",
      "............",
      "............",
    ],
  },
  {
    name: "penguin",
    pixels: [
      "....1111....",
      "...111111...",
      "..11.11.11..",
      "..11111111..",
      ".1.222222.1.",
      ".1.222222.1.",
      "...222222...",
      "...111111...",
      "...111111...",
      "..33....33..",
      "..333..333..",
      "............",
    ],
  },
  {
    name: "seal",
    pixels: [
      "............",
      "...111111...",
      "..11111111..",
      ".11.1..1.11.",
      ".1111..1111.",
      ".111.11.111.",
      "..11111111..",
      "...111111...",
      "....111111..",
      ".....11111..",
      "......1111..",
      "............",
    ],
  },
  {
    name: "shrimp",
    pixels: [
      ".....111....",
      "....11.11...",
      "...11...1...",
      "...1....1...",
      "..11...1....",
      "..1...1.....",
      "..1..1......",
      "..1.1.......",
      "...1........",
      "..1.........",
      "............",
      "............",
    ],
  },
  {
    name: "puffer",
    pixels: [
      "....1111....",
      "..11111111..",
      ".1111111111.",
      ".11.1111.11.",
      "111111111111",
      "111111111111",
      ".1111111111.",
      ".1111111111.",
      "..11111111..",
      "....1111....",
      "............",
      "............",
    ],
  },
];

const PALETTES: Palette[] = [
  { body: "#f582ae", accent: "#fef6e4", eye: "#232946", extra: "#f3d2c1" },
  { body: "#8bd3dd", accent: "#fef6e4", eye: "#232946", extra: "#b8c1ec" },
  { body: "#f3d2c1", accent: "#fef6e4", eye: "#232946", extra: "#f582ae" },
  { body: "#8ac926", accent: "#fef6e4", eye: "#232946", extra: "#f3d2c1" },
  { body: "#b8c1ec", accent: "#fff", eye: "#232946", extra: "#f582ae" },
  { body: "#ffbe0b", accent: "#fef6e4", eye: "#232946", extra: "#fb5607" },
  { body: "#ff006e", accent: "#fef6e4", eye: "#232946", extra: "#8338ec" },
  { body: "#3a86ff", accent: "#fef6e4", eye: "#232946", extra: "#ff006e" },
  { body: "#06d6a0", accent: "#fef6e4", eye: "#232946", extra: "#118ab2" },
  { body: "#e07a5f", accent: "#fef6e4", eye: "#232946", extra: "#3d405b" },
];

const EYE_MAP: Record<string, [number, number][]> = {
  cat: [
    [3, 3],
    [8, 3],
  ],
  fish: [[4, 3]],
  seal: [
    [3, 3],
    [8, 3],
  ],
  puffer: [
    [3, 3],
    [8, 3],
  ],
};

export function drawAvatar(canvas: HTMLCanvasElement, animalIdx: number, paletteIdx: number, size: number): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const animal = ANIMALS[animalIdx % ANIMALS.length];
  const palette = PALETTES[paletteIdx % PALETTES.length];
  if (!animal || !palette) return;
  const cellSize = size / 12;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#fef6e4";
  ctx.fillRect(0, 0, size, size);

  const colorMap: Record<string, string> = {
    "1": palette.body,
    "2": palette.accent,
    "3": palette.extra,
  };

  for (let y = 0; y < animal.pixels.length; y++) {
    const row = animal.pixels[y];
    if (!row) continue;
    for (let x = 0; x < row.length; x++) {
      const char = row[x];
      if (!char) continue;
      const color = colorMap[char];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  const eyes = EYE_MAP[animal.name];
  if (eyes) {
    ctx.fillStyle = palette.eye;
    for (const [ex, ey] of eyes) {
      ctx.fillRect(ex * cellSize, ey * cellSize, cellSize, cellSize);
    }
  }
}

export function randomAvatar(): { animalIdx: number; paletteIdx: number } {
  return {
    animalIdx: Math.floor(Math.random() * ANIMALS.length),
    paletteIdx: Math.floor(Math.random() * PALETTES.length),
  };
}
