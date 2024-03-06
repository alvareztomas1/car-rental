const AbstractService = require("../../car/service/abstractService");
const ReserveNotDefinedError = require("./error/reserveNotDefinedError");

module.exports = class ReserveService extends AbstractService {
	constructor(reserveRepository) {
		super();
		this.reserveRepository = reserveRepository;
	}
	getAll(){
		return this.reserveRepository.getAll();
	}
	save(reserve) {
		if(reserve === undefined){
			throw new ReserveNotDefinedError("Reserve is not defined");
		}

		return this.reserveRepository.save(reserve);
	}

	calculateCost(since, until, carPrice){
		const days = Math.floor((new Date(until) - new Date(since)) / (1000 * 60 * 60 * 24));
		return Math.floor(days * carPrice);
	}

	delete(id){
		if(id === undefined){
			throw new ReserveNotDefinedError("Reserve is not defined");
		}

		return this.reserveRepository.delete(id);
	}
};

