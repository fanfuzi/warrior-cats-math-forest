-- Warrior Cats Math Forest - database schema
-- All statements use IF NOT EXISTS so this file can be re-run on an existing
-- database to add new tables without touching existing data.

-- Users: account credentials
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt          TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

-- Sessions: opaque revocable tokens (no JWT needed)
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User data: the full game-state JSON blob (same shape as localStorage)
CREATE TABLE IF NOT EXISTS user_data (
  user_id    TEXT PRIMARY KEY,
  data       TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============ Learning system tables (Phase A) ============

-- Attempts: one row per answered question (raw data for the mistake book)
CREATE TABLE IF NOT EXISTS attempts (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL,
  level_id       TEXT NOT NULL,
  region         TEXT NOT NULL,
  season         INTEGER NOT NULL,
  kp             TEXT NOT NULL,
  q_key          TEXT NOT NULL,
  correct        INTEGER NOT NULL,
  user_answer    TEXT,
  correct_answer TEXT,
  tier           INTEGER,
  duration_ms    INTEGER,
  created_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_kp ON attempts(user_id, kp);
CREATE INDEX IF NOT EXISTS idx_attempts_user_time ON attempts(user_id, created_at);

-- Mistakes: spaced-repetition queue, derived from wrong attempts
CREATE TABLE IF NOT EXISTS mistakes (
  user_id        TEXT NOT NULL,
  q_key          TEXT NOT NULL,
  level_id       TEXT NOT NULL,
  kp             TEXT NOT NULL,
  error_type     TEXT,
  wrong_count    INTEGER DEFAULT 1,
  last_wrong_at  TEXT NOT NULL,
  next_review_at TEXT NOT NULL,
  mastered       INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, q_key)
);

-- Weak points: per-knowledge-point mastery, refreshed by AI
CREATE TABLE IF NOT EXISTS weak_points (
  user_id         TEXT NOT NULL,
  kp              TEXT NOT NULL,
  season          INTEGER,
  attempts        INTEGER DEFAULT 0,
  correct         INTEGER DEFAULT 0,
  mastery_rate    REAL DEFAULT 0,
  avg_duration_ms INTEGER,
  trend           TEXT,
  ai_summary      TEXT,
  ai_updated_at   TEXT,
  last_updated    TEXT NOT NULL,
  PRIMARY KEY (user_id, kp)
);

-- Daily check-in: per-day plan & progress, by grade (season)
CREATE TABLE IF NOT EXISTS daily_checkin (
  user_id      TEXT NOT NULL,
  date         TEXT NOT NULL,
  season       INTEGER NOT NULL,
  plan         TEXT NOT NULL,
  progress     TEXT NOT NULL,
  streak_count INTEGER,
  PRIMARY KEY (user_id, date)
);

-- Courses: micro-lessons for weak knowledge points (global, not per-user)
CREATE TABLE IF NOT EXISTS courses (
  id        TEXT PRIMARY KEY,
  kp        TEXT NOT NULL,
  season    INTEGER,
  title_en  TEXT,
  title_zh  TEXT,
  cpa_steps TEXT NOT NULL,
  practice_level_id TEXT,
  created_at TEXT
);
