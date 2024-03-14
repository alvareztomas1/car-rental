DROP TABLE IF EXISTS cars;

CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    car_year INTEGER NOT NULL,
    transmission TEXT NOT NULL,
    seats TEXT NOT NULL,
    doors TEXT NOT NULL,
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
