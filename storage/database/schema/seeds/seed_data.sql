INSERT OR IGNORE INTO symptoms(name,icon,description) VALUES
('Dolor abdominal','activity','Dolor o cólicos abdominales'),
('Dolor de cabeza','brain','Cefalea relacionada con el ciclo'),
('Fatiga','moon','Sensación de cansancio'),
('Acné','sparkles','Brotes hormonales'),
('Inflamación','circle','Retención de líquidos'),
('Náuseas','pill','Malestar estomacal'),
('Dolor lumbar','back','Dolor en la parte baja de la espalda'),
('Cólicos','flame','Cólicos menstruales'),
('Sensibilidad en senos','heart','Dolor o sensibilidad mamaria'),
('Ansiedad','alert-circle','Ansiedad asociada al ciclo');

INSERT OR IGNORE INTO moods(name,emoji) VALUES
('Feliz','😊'),
('Triste','😢'),
('Enojada','😠'),
('Ansiosa','😰'),
('Relajada','😌'),
('Motivada','💪'),
('Cansada','😴'),
('Enamorada','❤️');

INSERT OR IGNORE INTO flows(name) VALUES
('Ligero'),
('Moderado'),
('Abundante'),
('Muy abundante');