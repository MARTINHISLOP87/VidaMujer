CREATE TABLE IF NOT EXISTS menstrual_day_symptoms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menstrual_day_id INTEGER NOT NULL,
    symptom_id INTEGER NOT NULL,
    intensity INTEGER NOT NULL CHECK(intensity BETWEEN 1 AND 5),
    notes TEXT,
    FOREIGN KEY(menstrual_day_id)
        REFERENCES menstrual_days(id)
        ON DELETE CASCADE,
    FOREIGN KEY(symptom_id)
        REFERENCES symptoms(id)
);