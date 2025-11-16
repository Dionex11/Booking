CREATE TABLE IF NOT EXISTS workspace (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'available'
);
INSERT INTO workspace (name, status) VALUES
('Desk A1', 'available'),
('Desk A2', 'available'),
('Desk B1', 'available'),
('Desk B2', 'available'),
('Meeting Room 1', 'available');
