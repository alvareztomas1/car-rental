const AbstractRepository = require("./abstractRepository");
const { fromDbToEntity } = require("../mapper/carMapper");


module.exports = class CarRepository extends AbstractRepository{
	constructor(MainDatabaseAdapter) {
		super();
		this.MainDatabaseAdapter = MainDatabaseAdapter;
	}
	async getAll(){
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
	
};