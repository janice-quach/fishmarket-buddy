CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  name TEXT NOT NULL,
  foods TEXT NOT NULL,
  animal_idx INTEGER NOT NULL,
  palette_idx INTEGER NOT NULL,
  tagline TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS likes (
  from_id TEXT NOT NULL REFERENCES profiles(id),
  to_id TEXT NOT NULL REFERENCES profiles(id),
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (from_id, to_id)
);
