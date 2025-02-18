CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  spanish TEXT NOT NULL,
  pronunciation TEXT,
  english TEXT NOT NULL,
  parts_of_speech TEXT NOT NULL  -- Store as JSON string
);