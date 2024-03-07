const AbstractService = require("../../car/service/abstractService");
const ReserveNotDefinedError = require("./error/reserveNotDefinedError");

module.exports = class ReserveService extends AbstractService {
	constructor(reserveRepository, carService) {
		super();
		this.reserveRepository = reserveRepository;
		this.carService = carService;
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

	validate(data){

		const validation = {};

		Object.keys(data).forEach((field) => {
			validation[`${field}`] = this.validateField(field, data[field]);
		});

		return validation;
	}

	validateField(type, input){
		
		switch(type){
		case "since":
			return this.validateDate(input);
		case "until":
			return this.validateDate(input);
		case "car-id":
			return this.carService.getById(input) ? true : false;
		}
	}

	validateDate(date){
		const match = date.match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
		if (!match) return false;

		const year = parseInt(match[0]);
		const month = parseInt(match[1]);
		const day = parseInt(match[2]);

		const currentYear = new Date().getFullYear();

		if (year < currentYear || year > currentYear + 1) return false;

		const daysInMonth = new Date(year, month, 0).getDate();
		if (isNaN(year) || isNaN(month) || isNaN(day) || day < 1 || day > daysInMonth) {
			return false;
		}

		return true;
	}
};