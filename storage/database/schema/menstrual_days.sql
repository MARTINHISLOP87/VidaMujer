CREATE TABLE IF NOT EXISTS menstrual_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cycle_id INTEGER NOT NULL,
    day_date DATE NOT NULL,
    day_number INTEGER NOT NULL,
    is_period_day INTEGER DEFAULT 1,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(cycle_id)
        REFERENCES menstrual_cycles(id)
        ON DELETE CASCADE,
    UNIQUE(cycle_id, day_date)
);