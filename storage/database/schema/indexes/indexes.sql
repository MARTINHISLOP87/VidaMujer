CREATE INDEX IF NOT EXISTS idx_cycles_user
ON menstrual_cycles(user_id);

CREATE INDEX IF NOT EXISTS idx_cycles_start
ON menstrual_cycles(start_date);

CREATE INDEX IF NOT EXISTS idx_days_cycle
ON menstrual_days(cycle_id);

CREATE INDEX IF NOT EXISTS idx_days_date
ON menstrual_days(day_date);

CREATE INDEX IF NOT EXISTS idx_symptoms_day
ON menstrual_day_symptoms(menstrual_day_id);

CREATE INDEX IF NOT EXISTS idx_moods_day
ON menstrual_day_moods(menstrual_day_id);

CREATE INDEX IF NOT EXISTS idx_flows_day
ON menstrual_day_flows(menstrual_day_id);