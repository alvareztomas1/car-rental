DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS reserves;

CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    car_year INTEGER NOT NULL,
    transmission TEXT NOT NULL,
    seats INTEGER NOT NULL CHECK (seats BETWEEN 2 AND 5),
    doors INTEGER NOT NULL CHECK (doors BETWEEN 2 AND 5),
    air_conditioning INTEGER CHECK (air_conditioning IN (0, 1)),
    trunk INTEGER NOT NULL,
    fuel TEXT NOT NULL,
    price INTEGER NOT NULL,
    unlimited_mileage INTEGER CHECK (unlimited_mileage IN (0, 1)),
    car_image TEXT NOT NULL,
    car_description TEXT NOT NULL,
    created_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL
);
CREATE TABLE IF NOT EXISTS reserves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_car_id INTEGER NOT NULL,
    since DATE NOT NULL,
    until DATE NOT NULL,
    created_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL,
    FOREIGN KEY (fk_car_id) REFERENCES cars (id)
);
