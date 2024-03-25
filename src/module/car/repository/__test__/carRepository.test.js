const { Sequelize } = require("sequelize");
const CarModel = require("../../model/carModel");
const ReserveModel = require("../../../reserve/model/reserveModel");
const Car = require("../../entity/car");
const CarRepository = require("../carRepository");
const CarNotFoundError = require("../error/carNotFoundError");
const CouldNotDeleteCarError = require("../error/couldNotDeleteCarError");
const CarIsReservedError = require("../error/carIsReservedError");
const CarIdNotDefinedError = require("../error/carIdNotDefinedError");

const sequelizeInstance = new Sequelize("sqlite::memory", {
	logging: false
});
let repository;

const samepleCar = new Car({
	brand: "chevrolet",
	model: "onix",
	year: 2020,
	transmission: "Automatic",
	seats: "4",
	doors: "5",
	airConditioning: 1,
	trunk: 500,
	fuel: "Hybrid",
	price: 30,
	unlimitedMileage: 1,
	image: {
		path: "image"
	},
	description: "car description"
});

beforeAll(async () => {
	const carModel = CarModel.setup(sequelizeInstance);
	const reserveModel = ReserveModel.setup(sequelizeInstance);

	repository = new CarRepository(carModel, reserveModel);
});

beforeEach(async () => {
	try{
		await sequelizeInstance.sync({ force: true });
	}catch(e){
		throw e;
	}
});

describe("getAll method", () => {
	test("getAll returns an array with a car list", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newCar = await repository.save(samepleCar);
		expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);
        
		await expect(repository.getAll()).resolves.toEqual([newCar]);
	});
});

describe("getById method", () => {
	test("getById returns a car when founds a car with the received id", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newCar = await repository.save(samepleCar);
		expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);

		await expect(repository.getById(newCar.id)).resolves.toEqual(newCar);

	});
	test("getById throws an error when couldn't find a car with the received id", async () => {
		await expect(repository.getById(3)).rejects.toThrow(CarNotFoundError);
	});
	test("getById throws an error when the id is invalid", async () => {
		await expect(repository.getById(undefined)).rejects.toThrow(CarIdNotDefinedError);
	});
	test("getById throws an error when couldn't found the car", async () => {
		await expect(repository.getById(3)).rejects.toThrow(CarNotFoundError);
	});
});

describe("save method", () => {
	test("creates a car when it doesn't have an id", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newCar = await repository.save(samepleCar);
		expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);
	});
	test("edits a car when it has an id", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newCar = await repository.save(samepleCar);
		expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);
    
		newCar.brand = "toyota";
		const modifiedCar = await repository.save(newCar);
		expect(modifiedCar.id).toEqual(NEW_AUTOGENERATED_ID);
		expect(modifiedCar.brand).toEqual("toyota");
	});

});

describe("delete method", () => {
	test("deleting a car returns the deleted car", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newCar = await repository.save(samepleCar);
		expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);
    
		await expect(repository.delete(newCar.id)).resolves.toEqual(newCar);    
	});

	test("deleting a car destroy the register", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newCar = await repository.save(samepleCar);
		expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);
        
		await repository.delete(newCar.id);

		try{
			await repository.getById(newCar.id);
		}catch(e){
			expect(e).toBeInstanceOf(CarNotFoundError);
		}
		
	});

	test("deleting an error throws an error when couldn't delete the car", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newCar = await repository.save(samepleCar);

		await expect(repository.delete()).rejects.toThrow(CouldNotDeleteCarError);
	});

	test("deleting a car that has a reservation throws an error", async () => {
		const fakeReserve = {
			car: {
				id: 1
			}
		};
		repository.reserveModel.findOne = jest.fn(() => fakeReserve);

		const NEW_AUTOGENERATED_ID = 1;
		const newCar = await repository.save(samepleCar);
		expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);

		await expect(repository.delete(newCar.id)).rejects.toThrow(CarIsReservedError);
	});
});


