CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT NOT NULL COLLATE NOCASE UNIQUE, password_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE trips (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, payload TEXT NOT NULL, created_at TEXT NOT NULL, completed_at TEXT);
--> statement-breakpoint
CREATE INDEX trips_by_user ON trips(user_id, created_at DESC);
--> statement-breakpoint
CREATE TABLE stamps (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, city_id TEXT NOT NULL, sight_id TEXT NOT NULL, earned_at TEXT NOT NULL, PRIMARY KEY(user_id, city_id, sight_id));
--> statement-breakpoint
CREATE TABLE auth_limits (bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL, reset_at INTEGER NOT NULL);
