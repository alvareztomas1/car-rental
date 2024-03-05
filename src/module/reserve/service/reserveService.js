const AbstractService = require("../../car/service/abstractService");

module.exports = class ReserveService extends AbstractService {
	constructor(reserveRepository) {
		super();
		this.reserveRepository = reserveRepository;
	}
};

