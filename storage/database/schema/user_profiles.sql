CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    birth_date DATE NOT NULL,
    blood_type TEXT,
    height_cm REAL,
    initial_weight REAL,
    current_weight REAL,
    marital_status TEXT,
    has_children INTEGER DEFAULT 0,
    children_count INTEGER DEFAULT 0,
    occupation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);