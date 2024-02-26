const AbstractService = require("./abstractService");
const CarIdNotDefinedError = require("./error/carIdNotDefinedError");
const CarNotDefinedError = require ("./error/carNotDefinedError");

module.exports = class CarService extends AbstractService {
	constructor(carRepository){
		super();
		this.carRepository = carRepository;
	}
	async getAll(){
		return this.carRepository.getAll();
	}
	
	async getById(id){
		if(id === undefined){
			throw new CarIdNotDefinedError("Car id not defined");
		}
		return this.carRepository.getById(id);
	}

	async save(car){
		if(car === undefined){
			throw new CarNotDefinedError("Car is not defined");
		}
		return this.carRepository.save(car);
	}
};