const ReserveService = require("../reserveService");
const ReserveIdNotDefinedError = require("../error/reserveNotDefinedError");
const ReserveNotDefinedError = require("../error/reserveNotDefinedError");

const reserveRepositoryMock = {
	getAll: jest.fn(),
	getById: jest.fn(),
	save: jest.fn(),
	delete: jest.fn()
};
const carServiceMock = {
	getById: jest.fn()
};
const userServiceMock = {
	getById: jest.fn()
};

const service = new ReserveService(reserveRepositoryMock, carServiceMock, userServiceMock);

afterEach(() => {
	jest.clearAllMocks();
});

describe("getAll method", () => {
	test("returns all reserves", () => {
		service.getAll();
		expect(reserveRepositoryMock.getAll).toHaveBeenCalledTimes(1);
	});
});
describe("getById method", () => {
	test("returns a reserve with received id", () => {
		service.getById(1);
		expect(reserveRepositoryMock.getById).toHaveBeenCalledTimes(1);
		expect(reserveRepositoryMock.getById).toHaveBeenCalledWith(1);
	});
	test("throws an error when receives an invalid id", async () => {
		await expect(service.getById(undefined)).rejects.toThrow(ReserveIdNotDefinedError);
	});
});
describe("save method", () => {
	test("returns a reserve with received id", () => {
		service.save(1);
		expect(reserveRepositoryMock.save).toHaveBeenCalledTimes(1);
		expect(reserveRepositoryMock.save).toHaveBeenCalledWith(1);
	});
	test("throws an error when receives an invalid id", async () => {
		await expect(service.save(undefined)).rejects.toThrow(ReserveNotDefinedError);
	});
});
describe("delete method", () => {
	test("returns a reserve with received id", () => {
		service.delete(1);
		expect(reserveRepositoryMock.delete).toHaveBeenCalledTimes(1);
		expect(reserveRepositoryMock.delete).toHaveBeenCalledWith(1);
	});
	test("throws an error when receives an invalid id", async () => {
		await expect(service.delete(undefined)).rejects.toThrow(ReserveNotDefinedError);
	});
});
describe("validate method", () => {
	test("validate each field sending keys anda values as params", () => {
		const  dataMock = {
			id: 1,
			since: "1999-01-01"
		};
		const callBackFunctionMock = jest.fn();

		service.validate(dataMock, callBackFunctionMock);
		expect(callBackFunctionMock).toHaveBeenCalledTimes(2);
		expect(callBackFunctionMock).toHaveBeenCalledWith("id", 1);
		expect(callBackFunctionMock).toHaveBeenCalledWith("since", "1999-01-01");
	});
});
describe("validateField", () => {
	test("id case returns true with '' input", () => {
		expect(service.validateField("id", "")).toEqual(true);
	});
	test("id case calls repository.getById method", () => {
		expect(service.validateField("id", 1)).toEqual(true);
		expect(reserveRepositoryMock.getById).toHaveBeenCalledTimes(1);
		expect(reserveRepositoryMock.getById).toHaveBeenCalledWith(1);
	});
	test("carId case calls carService.getById method", () => {
		service.validateField("carId", 1);
		expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
		expect(carServiceMock.getById).toHaveBeenCalledWith(1);
	});
	test("userId case calls carService.getById method", () => {
		service.validateField("userId", 1);
		expect(userServiceMock.getById).toHaveBeenCalledTimes(1);
		expect(userServiceMock.getById).toHaveBeenCalledWith(1);
	});
	test("paymentMethod case returns true with valid input", () => {
		expect(service.validateField("paymentMethod", "Paypal")).toEqual(true);
	});
	test("paymentMethod case returns false with valid input", () => {
		expect(service.validateField("paymentMethod", "asd")).toEqual(false);
	});
	describe("dates cases", () => {
		const CURRENT_YEAR = new Date().getFullYear();
		const CURRENT_MONTH = (new Date().getMonth() + 1).toString().padStart(2, '0');
		const CURRENT_DAY = new Date().getDate().toString().padStart(2, '0');

		describe("since case", () => {
			test("returns true with valid input", () => {
				expect(service.validateField("since", `${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}`)).toEqual(true);
			});
			test("returns false with invalid format", () => {
				expect(service.validateField("since", "12-12-1999")).toEqual(false);
			});
			test("returns false with older than minimum 'since' date", () => {
				const BEFORE_MINIMUM_DATE = CURRENT_YEAR - 1;
				expect(service.validateField("since", `${BEFORE_MINIMUM_DATE}-${CURRENT_MONTH}-${CURRENT_DAY}`)).toEqual(false);
			});
			test("returns false with unexisting date", () => {
				expect(service.validateField("since", `${CURRENT_YEAR}-02-31`)).toEqual(false);
			});
		});

		describe("until case", () => {
			test("returns true with valid input", () => {
				expect(service.validateField("until", `${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}`)).toEqual(true);
			});
			test("returns false with invalid format", () => {
				expect(service.validateField("until", "12-12-1999")).toEqual(false);
			});
			test("returns false with a date after the maximum 'until' date", () => {
				const AFTER_MAXIMUM_DATE = CURRENT_YEAR + 2;
				expect(service.validateField("until", `${AFTER_MAXIMUM_DATE}-${CURRENT_MONTH}-${CURRENT_DAY}`)).toEqual(false);
			});
			test("returns false with unexisting date", () => {
				expect(service.validateField("until", `${CURRENT_YEAR}-02-31`)).toEqual(false);
			});
		});
		
	});
	
});
describe("calculateCost", () => {
	test("returns the total price based on the start date and end date", () => {
		const startDate = "1900-01-01";
		const endDate = "1900-01-03";
		const pricePerDay = 10;
		
		expect(service.calculateCost(startDate, endDate, pricePerDay)).toEqual(30);
	});
	test("returns car price per day as the total price if the car is reserved one day", () => {
		const startDate = "1900-01-01";
		const endDate = "1900-01-01";
		const pricePerDay = 10;
		
		expect(service.calculateCost(startDate, endDate, pricePerDay)).toEqual(10);
	});

});

