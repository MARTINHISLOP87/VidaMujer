CREATE TABLE IF NOT EXISTS menstrual_cycles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    cycle_number INTEGER,
    start_date DATE NOT NULL,
    end_date DATE,
    cycle_length INTEGER,
    period_length INTEGER,
    ovulation_date DATE,
    fertile_start DATE,
    fertile_end DATE,
    is_predicted INTEGER DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);