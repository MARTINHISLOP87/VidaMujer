CREATE TABLE IF NOT EXISTS menstrual_day_moods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menstrual_day_id INTEGER NOT NULL,
    mood_id INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY(menstrual_day_id)
        REFERENCES menstrual_days(id)
        ON DELETE CASCADE,
    FOREIGN KEY(mood_id)
        REFERENCES moods(id)
);