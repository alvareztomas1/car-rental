const AbstractService = require("./abstractService");
const CarIdNotDefinedError = require("./error/carIdNotDefinedError");
const CarNotDefinedError = require("./error/carNotDefinedError");

module.exports = class CarService extends AbstractService {
	constructor(carRepository) {
		super();
		this.carRepository = carRepository;
	}
	async getAll() {
		return this.carRepository.getAll();
	}

	async getById(id) {
		if (id === undefined) {
			throw new CarIdNotDefinedError("Car id not defined");
		}
		return this.carRepository.getById(id);
	}

	async save(car) {
		if (car === undefined) {
			throw new CarNotDefinedError("Car is not defined");
		}
		return this.carRepository.save(car);
	}

	validateForm(data) {
		const validation = {};

		Object.keys(data).forEach((key) => {
			validation[`${key}`] = this.validateInput(key, data[key]);
		});

		return validation;
	}

	validateInput(type, input) {
		let actualYear;
		let maxImageSize;
		switch (type) {

		case "id":
			return /^(undefined|^[1-9]\d*)$/.test(input);

		case "brand":
			return /^[a-zA-Z0-9\s]{3,30}$/.test(input);

		case "model":
			return /^([A-Za-z0-9\- .]{3,30})$/.test(input);

		case "year":
			actualYear = new Date().getFullYear();
			return input >= 1900 && input <= actualYear;

		case "transmission":
			return /^(Automatic|Manual)$/.test(input);

		case "seats":
			return /^(2|4|5|6|7|8)$/.test(input);

		case "doors":
			return /^(2|3|4|5|6|7|8)$/.test(input);

		case "airConditioning":
			return /^(0|1)$/.test(input);

		case "trunk":
			return /^(2[0-9]{2}|[3-9][0-9]{2}|1[0-4][0-9]{2}|1500)\b$/.test(input);

		case "fuel":
			return /^(Gasoline|Hybrid|Electric|Diesel|Natural-gas)$/.test(input);

		case "price":
			return /^(2[0-9]|[3-9][0-9]|100)\b$/.test(input);

		case "unlimitedMileage":
			return /^(0|1)$/.test(input);

		case "image":
			maxImageSize = 5 * 1024 * 1024;
			return /^\\img\\cars\\[0-9]+\.(jpg|jpeg|avif|png)$/.test(String.raw`${input.path}`) && input.size <= maxImageSize;

		case "description":
			return /^[a-zA-Z0-9,.!?;() -]{1,200}$/.test(input);

		case "reserved":
			return /^(0|1)$/.test(input);
		}
	}
};