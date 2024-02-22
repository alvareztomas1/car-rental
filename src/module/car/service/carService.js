const AbstractService = require("./abstractService");

module.exports = class CarService extends AbstractService {
	constructor(carRepository){
		super();
		this.carRepository = carRepository;
	}
	async getAll(){
		return this.carRepository.getAll();
	}
	


};