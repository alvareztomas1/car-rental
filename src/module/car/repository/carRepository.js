const AbstractRepository = require("./abstractRepository");
const { fromDbToEntity } = require("../mapper/carMapper");
const CarNotFoundError = require("./error/carNotFoundError");

module.exports = class CarRepository extends AbstractRepository {
	constructor(MainDatabaseAdapter) {
		super();
		this.MainDatabaseAdapter = MainDatabaseAdapter;
	}
	getAll() {
		const cars = this.MainDatabaseAdapter.prepare(
			`SELECT
			id, 
			brand, 
			model, 
			car_year, 
			transmission, 
			seats, 
			doors, 
			air_conditioning, 
			trunk, 
			fuel, 
			price, 
			unlimited_mileage, 
			car_image, 
			car_description, 
			reserved FROM cars`
		).all();

		return cars.map((carsData) => fromDbToEntity(carsData));
	}
	getById(id) {
		const car = this.MainDatabaseAdapter.prepare(
			`SELECT
            id, 
            brand, 
            model, 
            car_year, 
            transmission, 
            seats, 
            doors, 
            air_conditioning, 
            trunk, 
            fuel, 
            price, 
            unlimited_mileage, 
            car_image, 
            car_description, 
            reserved FROM cars
            WHERE id = ?`
		).get(id);

		if (car === undefined) {
			throw new CarNotFoundError("Car not found");
		}

		return fromDbToEntity(car);
	}

	save(car){
		
		let id;
		const idUpdate = car.id;

		if(idUpdate){
			id = car.id;
			const statement = `UPDATE cars SET
				${car.image ? "car_image = ?," : ""}
				brand = ?,
				model = ?,
				car_year = ?,
				transmission = ?,
				seats = ?,
				doors = ?,
				air_conditioning = ?,
				trunk = ?,
				fuel = ?,
				price = ?,
				unlimited_mileage = ?,
				car_description = ?,
				reserved = ?
				WHERE id = ?`;
			
			const values = [
				car.brand,
				car.model,
				car.year,
				car.transmission,
				car.seats,
				car.doors,
				car.airConditioning,
				car.trunk,
				car.fuel,
				car.price,
				car.unlimitedMileage,
				car.description,
				car.reserved,
				car.id
			];

			if(car.image){
				values.unshift(car.image.path);
			}

			this.MainDatabaseAdapter.prepare(statement).run(values);

		}else{
			const statement  = `INSERT INTO cars (
					brand, 
					model, 
					car_year, 
					transmission, 
					seats, 
					doors, 
					air_conditioning, 
					trunk, 
					fuel, 
					price, 
					unlimited_mileage, 
					car_image, 
					car_description, 
					reserved) 
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

			const values = [
				car.brand,
				car.model,
				car.year,
				car.transmission,
				car.seats,
				car.doors,
				car.airConditioning,
				car.trunk,
				car.fuel,
				car.price,
				car.unlimitedMileage,
				car.image.path,
				car.description,
				car.reserved
			];

			const result = this.MainDatabaseAdapter.prepare(statement).run(values);
			id = result.lastInsertRowid;

		}

		return this.getById(id);
	}
};