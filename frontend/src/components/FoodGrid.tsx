import { FOODS } from "../lib/foods";

interface Props {
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export function FoodGrid({ selected, onToggle }: Props) {
  return (
    <div className="food-grid">
      {FOODS.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`food-chip ${selected.has(f.id) ? "selected" : ""}`}
          onClick={() => onToggle(f.id)}
        >
          <span className="emoji">{f.emoji}</span>
          {f.label}
        </button>
      ))}
    </div>
  );
}
