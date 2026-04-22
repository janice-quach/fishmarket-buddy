export interface Food {
  id: string;
  emoji: string;
  label: string;
}

export const FOODS: Food[] = [
  { id: "sashimi", emoji: "🍣", label: "sashimi" },
  { id: "oysters", emoji: "🦪", label: "oysters" },
  { id: "fishnchips", emoji: "🍟", label: "fish & chips" },
  { id: "lobster", emoji: "🦞", label: "lobster" },
  { id: "crab", emoji: "🦀", label: "crab" },
  { id: "prawns", emoji: "🦐", label: "prawns" },
  { id: "calamari", emoji: "🦑", label: "calamari" },
  { id: "poke", emoji: "🥣", label: "poke bowl" },
  { id: "tacos", emoji: "🌮", label: "fish tacos" },
];

export function foodEmoji(id: string): string {
  return FOODS.find((f) => f.id === id)?.emoji ?? "";
}
