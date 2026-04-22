import type { ScreenId } from "../lib/types";

interface Props {
  active: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const TABS: { id: ScreenId; icon: string; label: string }[] = [
  { id: "browse", icon: "🐟", label: "swipe" },
  { id: "crews", icon: "⚓", label: "crews" },
  { id: "matches", icon: "💕", label: "buddies" },
  { id: "me", icon: "🪞", label: "me" },
];

export function NavBar({ active, onNavigate }: Props) {
  return (
    <nav className="nav-bar visible">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-btn ${active === tab.id ? "active" : ""}`}
          onClick={() => onNavigate(tab.id)}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
}
