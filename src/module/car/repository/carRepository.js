const AbstractRepository = require("./abstractRepository");
const { fromModelToCarEntity } = require("../mapper/carMapper");
const CarNotFoundError = require("./error/carNotFoundError");
// const CarIsReservedError = require("./error/carIsReservedError");

module.exports = class CarRepository extends AbstractRepository {
	constructor(carModel) {
		super();
		this.carModel = carModel;
	}
	async getAll() {
		const cars = await this.carModel.findAll();
		return cars.map((carData) => fromModelToCarEntity(carData));
	}
	async getById(id) {
		const car = await this.carModel.findByPk(id);

		if (car === undefined) {
			throw new CarNotFoundError("Car not found");
		}
		
		return fromModelToCarEntity(car);
	}
	async save(car){

		const carModelToSave = {
			id: car.id ? car.id : undefined,
			brand: car.brand,
			model: car.model,
			car_year: car.year,
			transmission: car.transmission,
			seats: car.seats,
			doors: car.doors,
			air_conditioning: car.airConditioning,
			trunk: car.trunk,
			fuel: car.fuel,
			price: car.price,
			unlimited_mileage: car.unlimitedMileage,
			car_image: car.image ? car.image.path : undefined,
			car_description: car.description
		};

		const buildOptions = {
			isNewRecord: !carModelToSave.id
		};
		
		let carModel;
		carModel = this.carModel.build(carModelToSave, buildOptions);
		carModel = await carModel.save();

		return fromModelToCarEntity(carModel);

	}
	async delete(id){
		const teamBackup = await this.getById(id);
		const deletedTeam = await this.carModel.destroy({ where: { id } });

		if(deletedTeam === undefined){
			throw new CarNotFoundError("Car with received id not found");
		}

		// TODO: check if car is reserved

		return teamBackup;
	}

};