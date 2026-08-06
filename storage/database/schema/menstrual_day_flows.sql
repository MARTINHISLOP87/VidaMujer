CREATE TABLE IF NOT EXISTS menstrual_day_flows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menstrual_day_id INTEGER NOT NULL,
    flow_id INTEGER NOT NULL,
    FOREIGN KEY(menstrual_day_id)
        REFERENCES menstrual_days(id)
        ON DELETE CASCADE,
    FOREIGN KEY(flow_id)
        REFERENCES flows(id)
);