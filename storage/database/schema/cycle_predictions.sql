CREATE TABLE IF NOT EXISTS cycle_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    duration_days INTEGER,
    cycle_length INTEGER,
    flow_id INTEGER,
    is_predicted INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    
    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);