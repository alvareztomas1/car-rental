const CarService = require("../carService");
const CarIdNotDefinedError = require("../error/carIdNotDefinedError");
const CarNotDefinedError = require("../error/carNotDefinedError");

const repositoryMock = {
	getAll: jest.fn(),
	getById: jest.fn((id) => {}),
	save: jest.fn((car) => {}),
	delete: jest.fn((id) => {})
};

const service = new CarService(repositoryMock);

afterEach(() => {
	jest.clearAllMocks(); 
});


describe("getAll method", () => {
	test("Verifies getAll calls repository.getAll method", () => {
		service.getAll();
    
		expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
	});
});

describe("getById method", () => {
	test("verifies repository.GetById method is being called", () => {
		service.getById(1);

		expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
		expect(repositoryMock.getById).toHaveBeenCalledWith(1);
	});
	test("verifies save method throws an error when receives an undefined id", async () => {
        
		try{
			await service.getById(undefined);
		}catch(e){
			expect(e).toBeInstanceOf(CarIdNotDefinedError);
		}


	});
});

describe("save method", () => {
	test("verifies carRepository.save method is being called", async () => {
		await service.save({});
		expect(repositoryMock.save).toHaveBeenCalledTimes(1);
		expect(repositoryMock.save).toHaveBeenCalledWith({});
	});

	test("verifies save method throws an error when receives an undefined car", async () => {
		try{
			await service.save(undefined);
		}catch(e){
			expect(e).toBeInstanceOf(CarNotDefinedError);
		}
	});
});

describe("delete method", () => {
	test("verifies carRepository.delete method is being called", async () => {
		await service.delete(1);
		expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
		expect(repositoryMock.delete).toHaveBeenCalledWith(1);
	});
	test("verifies delete method throws an error when receives an undefined id", async () => {
		try{
			await service.delete(undefined);
		}catch(e){
			expect(e).toBeInstanceOf(CarIdNotDefinedError);
		}
	});
});

describe("validateForm method", () => {
	test("verifies validateForm calls validateFieldCallbackFunction", () => {
		const dataMock = {
			id: 1,
		};
		const callbackFunctionMock = jest.fn((key, value) => {});
        
		service.validateForm(dataMock, callbackFunctionMock);
		expect(callbackFunctionMock).toHaveBeenCalledTimes(1);
		expect(callbackFunctionMock).toHaveBeenCalledWith("id", 1);
	});
});

describe("validateField method", () => {
	test("verifies id case calls carService getById method", () => {
		service.validateField("id", 1);
		expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
		expect(repositoryMock.getById).toHaveBeenCalledWith(1);
	});
	test("verifies id case returns true when receives a '' character", () => {
		expect(service.validateField("id", "")).toEqual(true);
	});
	test("verifies brand case returns true when receives a valid input", () => {
		expect(service.validateField("brand", "chevrolet")).toEqual(true);
	});
	test("verifies brand case returns false when receives an invalid input", () => {
		expect(service.validateField("brand", "1343a4.13-.-")).toEqual(false);
	});
	test("verifies brand case returns true when receives a valid input", () => {
		expect(service.validateField("model", "corolla")).toEqual(true);
	});
	test("verifies brand case returns false when receives an invalid input", () => {
		expect(service.validateField("model", "1343a4.13-.-1343a4.13-.-1343a4.13-.-1343a4.13-.-")).toEqual(false);
	});
	test("verifies year case returns true when receives a valid input", () => {
		expect(service.validateField("year", "2014")).toEqual(true);
	});
	test("verifies year case returns false when receives an invalid input", () => {
		expect(service.validateField("year", "a")).toEqual(false);
	});
	test("verifies transmission case returns true when receives a valid input", () => {
		expect(service.validateField("transmission", "Automatic")).toEqual(true);
	});
	test("verifies transmission case returns false when receives an invalid input", () => {
		expect(service.validateField("transmission", "a")).toEqual(false);
	});
	test("verifies seats case returns true when receives a valid input", () => {
		expect(service.validateField("seats", "2")).toEqual(true);
	});
	test("verifies seats case returns false when receives an invalid input", () => {
		expect(service.validateField("seats", "a")).toEqual(false);
	});
	test("verifies doors case returns true when receives a valid input", () => {
		expect(service.validateField("doors", "2")).toEqual(true);
	});
	test("verifies doors case returns false when receives an invalid input", () => {
		expect(service.validateField("doors", "a")).toEqual(false);
	});
	test("verifies airConditioning case returns true when receives a valid input", () => {
		expect(service.validateField("airConditioning", "1")).toEqual(true);
	});
	test("verifies airConditioning case returns false when receives an invalid input", () => {
		expect(service.validateField("airConditioning", "a")).toEqual(false);
	});
	test("verifies trunk case returns true when receives a valid input", () => {
		expect(service.validateField("trunk", "300")).toEqual(true);
	});
	test("verifies trunk case returns false when receives an invalid input", () => {
		expect(service.validateField("trunk", "a")).toEqual(false);
	});
	test("verifies fuel case returns true when receives a valid input", () => {
		expect(service.validateField("fuel", "Gasoline")).toEqual(true);
	});
	test("verifies fuel case returns false when receives an invalid input", () => {
		expect(service.validateField("fuel", "a")).toEqual(false);
	});
	test("verifies price case returns true when receives a valid input", () => {
		expect(service.validateField("price", "30")).toEqual(true);
	});
	test("verifies price case returns false when receives an invalid input", () => {
		expect(service.validateField("price", "a")).toEqual(false);
	});
	test("verifies unlimitedMileage case returns true when receives a valid input", () => {
		expect(service.validateField("unlimitedMileage", "1")).toEqual(true);
	});
	test("verifies unlimitedMileage case returns false when receives an invalid input", () => {
		expect(service.validateField("unlimitedMileage", "a")).toEqual(false);
	});
	test("verifies image case returns true when receives a valid input", () => {
		const falseImage = {
			path: "\\img\\cars\\123123.png",
			size: 1
		};
		expect(service.validateField("image", falseImage)).toEqual(true);
	});
	test("verifies image case returns false when receives a valid input", () => {
		const falseImage = {
			path: "\\img\\cars\\123123.png",
			size: 100000000
		};
		expect(service.validateField("image", falseImage)).toEqual(false);
	});
	test("verifies image case returns true when receives an undefined image", () => {
		const falseImage = undefined;
		expect(service.validateField("image", falseImage)).toEqual(true);
	});
	test("verifies description case returns true when receives a valid input", () => {
		expect(service.validateField("description", "Car description")).toEqual(true);
	});
	test("verifies description case returns false when receives an invalid input", () => {
		expect(service.validateField("description", "")).toEqual(false);
	});
});

