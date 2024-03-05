const AbstractService = require("../../car/service/abstractService");
const ReserveNotDefinedError = require("./error/reserveNotDefinedError");

module.exports = class ReserveService extends AbstractService {
	constructor(reserveRepository) {
		super();
		this.reserveRepository = reserveRepository;
	}
	save(reserve) {
		if(reserve === undefined){
			throw new ReserveNotDefinedError("Reserve is not defined");
		}

		return this.reserveRepository.save(reserve);
	}
};

