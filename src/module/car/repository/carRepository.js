const AbstractRepository = require("../../abstractRepository");
const { fromModelToCarEntity } = require("../mapper/carMapper");
const CarNotFoundError = require("./error/carNotFoundError");
const CarIsReservedError = require("./error/carIsReservedError");
const CouldNotDeleteCarError = require("./error/couldNotDeleteCarError");
const CarIdNotDefinedError = require("./error/carIdNotDefinedError");

module.exports = class CarRepository extends AbstractRepository {
	constructor(carModel, reserveModel) {
		super();
		this.carModel = carModel;
		this.reserveModel = reserveModel;
	}
	async getAll() {
		const cars = await this.carModel.findAll({
			attributes: { exclude: ["created_at", "updated_at"] },
		});

		return cars.map((carData) => fromModelToCarEntity(carData.toJSON()));
	}
	async getById(id) {

		if(id === undefined){
			throw new CarIdNotDefinedError("Car id is not defined");
		}

		const car = await this.carModel.findByPk(id, {
			attributes: { exclude: ["created_at", "updated_at"] },
		});

		if (!car) {
			throw new CarNotFoundError("Car not found");
		}
		
		return fromModelToCarEntity(car.toJSON());
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

		if(id === undefined){
			throw new CouldNotDeleteCarError;
		}

		const teamIsReserved = await this.reserveModel.findOne({ where: { fk_car_id: id } });

		if(teamIsReserved){
			throw new CarIsReservedError("Car is reserved");
		}
		
		const teamBackup = await this.getById(id);
		await this.carModel.destroy({ where: { id } });

		return teamBackup;
	}

};
